import json
import json
import pprint
import urllib.parse
from typing import List, Optional, Tuple

from fastapi import FastAPI, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel

from models import (
    Topic,
    get_session,
    User,
    SessionToken,
    user_uid,
    session_token_uid,
    short_lived_secret_uid,
    ShortLivedSecret,
    topic_uid,
    TopicType,
    TopicStructure,
    Vote,
    VoteType,
)
from utils.auth import verify_session_key, verify_admin_session_key
from utils.github import get_github_user_details, get_github_access_token
from utils.s3 import save_to_s3, POLYGLOT_VICTORIA_BUCKET_NAME
from utils.secrets import secrets
from utils.slack import send_message

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/auth/github_url")
async def auth_github_url():
    session = get_session()

    short_lived_secret = ShortLivedSecret(
        id=short_lived_secret_uid(),
    )
    session.add(short_lived_secret)
    session.commit()
    data = {
        "client_id": secrets.GITHUB_CLIENT_ID,
        "redirect_uri": secrets.GITHUB_REDIRECT_URI,
        "scope": secrets.GITHUB_SCOPE,
        "state": short_lived_secret.secret,
        "allow_signup": True,
    }
    querystring = urllib.parse.urlencode(data)
    return "https://github.com/login/oauth/authorize?" + querystring


@app.get("/auth/session_token")
async def auth(code: str, state: str) -> dict:
    session = get_session()
    github_profile = {}

    session_token = None
    qs = session.query(SessionToken).filter(
        SessionToken.github_code == code, SessionToken.secret == state
    )
    if qs.count() == 1:
        session_token = qs.first()
        github_profile = get_github_user_details(session_token.github_access_token)


    if session_token is None:
        # if not verify_short_lived_secret(state):
        #     return {"error": "INVALID_STATE", "message": "short lived secret does not exist in server, please refresh."}
        github_access_token = get_github_access_token(code)
        github_profile = get_github_user_details(github_access_token)
        user_qs = session.query(User).filter(User.login == github_profile["login"])
        if user_qs.count() > 0:
            user = user_qs.first()
        else:
            user = User(
                id=user_uid(),
                name=github_profile["name"],
                login=github_profile["login"],
                avatar_url=github_profile["avatar_url"],
                email=github_profile["email"],
                data=json.dumps(github_profile),
            )
            session.add(user)

        session_token = SessionToken(
            id=session_token_uid(),
            user_id=user.id,
            github_code=code,
            github_access_token=github_access_token,
            secret=state,
        )

        session.add(session_token)
        session.commit()

    return {
        "session_token": session_token.token,
        "github_profile": github_profile,
    }


class TopicResponse(BaseModel):
    id: str
    title: str
    description: str
    votes_in_person: int
    votes_remote: int
    type: TopicType
    structure: TopicStructure
    voted_in_person: bool = False
    voted_remote: bool = False


def _get_votes(topic_id: str) -> Tuple[int, int]:
    session = get_session()
    remote_qs = session.query(Vote).filter(
        Vote.topic_id == topic_id, Vote.vote_type == VoteType.REMOTE
    )
    in_person_qs = session.query(Vote).filter(
        Vote.topic_id == topic_id, Vote.vote_type == VoteType.IN_PERSON
    )
    return remote_qs.count(), in_person_qs.count()


def _get_topics():
    session = get_session()
    qs = session.query(Topic)
    topics = []
    for topic in qs:
        votes_remote, votes_in_person = _get_votes(topic.id)
        topics.append(
            TopicResponse(
                id=topic.id,
                title=topic.title,
                description=topic.description,
                votes_in_person=votes_in_person,
                votes_remote=votes_remote,
                type=topic.topic_type,
                structure=topic.topic_structure,
            )
        )
    return topics


@app.get("/topics")
async def list_topics(
    session_token: Optional[str] = Header(default=None),
) -> List[TopicResponse]:
    if session_token in [None, "undefined"]:
        return _get_topics()

    session = get_session()
    qs = session.query(Topic)
    session_token = (
        session.query(SessionToken).filter(SessionToken.token == session_token).first()
    )
    user, _ = session.query(User, User.id == session_token.user_id).first()
    topics = []
    for topic in qs:
        voted_in_person = (
            session.query(Vote)
            .filter(
                Vote.user_id == user.id,
                Vote.topic_id == topic.id,
                Vote.vote_type == VoteType.IN_PERSON,
            )
            .count()
            >= 1
        )
        voted_remote = (
            session.query(Vote)
            .filter(
                Vote.user_id == user.id,
                Vote.topic_id == topic.id,
                Vote.vote_type == VoteType.REMOTE,
            )
            .count()
            >= 1
        )
        votes_remote, votes_in_person = _get_votes(topic.id)
        topics.append(
            TopicResponse(
                id=topic.id,
                title=topic.title,
                description=topic.description,
                votes_in_person=votes_in_person,
                votes_remote=votes_remote,
                type=topic.topic_type,
                structure=topic.topic_structure,
                voted_in_person=voted_in_person,
                voted_remote=voted_remote,
            )
        )
    return topics


class TopicVoteRequest(BaseModel):
    type: VoteType


@app.post("/topic/{topic_id}/vote")
async def vote_for_topic(
    topic_id: str,
    data: TopicVoteRequest,
    user_session=Depends(verify_session_key),
):
    user, session = user_session

    # Remove all existing queries
    session.query(Vote).filter(
        Vote.topic_id == topic_id,
        Vote.user_id == user.id,
    ).delete()
    session.commit()

    if data.type == VoteType.NONE:
        return

    # New voted
    vote = Vote(vote_type=data.type, user_id=user.id, topic_id=topic_id)
    session = get_session()
    session.add(vote)
    session.commit()

    topic = session.query(Topic).filter(Topic.id == topic_id).first()
    send_message(f"`{user.name}` voted for a topic `{topic.title}`")

    save_to_s3(
        bucket_name=POLYGLOT_VICTORIA_BUCKET_NAME,
        bucket_key="cache/topics.json",
        json_data={"topics": [t.json() for t in _get_topics()]},
    )


class TopicCreateRequest(BaseModel):
    title: str
    description: str
    structure: TopicStructure


@app.post("/topic")
async def create_topic(
    data: TopicCreateRequest,
    user_session=Depends(verify_session_key),
):
    user, session = user_session

    topic = Topic(
        id=topic_uid(),
        title=data.title,
        description=data.description,
        user_id=user.id,
        topic_type=TopicType.PROPOSED,
        topic_structure=data.structure,
    )

    session.add(topic)
    session.commit()

    send_message(f"`{user.name}` created a topic `{topic.title}`")

    save_to_s3(
        bucket_name=POLYGLOT_VICTORIA_BUCKET_NAME,
        bucket_key="cache/topics.json",
        json_data={"topics": [t.json() for t in _get_topics()]},
    )

    return topic


class UserResponse(BaseModel):
    name: str
    avatar_url: str
    email: Optional[str]
    id: str
    login: str
    contact_me_general: Optional[bool] = True
    contact_me_topic_chosen: Optional[bool] = True

    @classmethod
    def from_model(cls, user: User) -> "UserResponse":
        return UserResponse(
            id=user.id,
            name=user.name,
            login=user.login,
            email=user.email,
            avatar_url=user.avatar_url,
            contact_me_general=user.contact_me_general,
            contact_me_topic_chosen=user.contact_me_topic_chosen,
        )


@app.get("/user")
async def delete_topic(
    user_session=Depends(verify_session_key),
) -> UserResponse:
    (user, session) = user_session
    return UserResponse.from_model(user)


@app.post("/user")
async def delete_topic(
    data: UserResponse,
    user_session=Depends(verify_session_key),
) -> UserResponse:
    (user, session) = user_session
    user.email = data.email
    user.contact_me_general = data.contact_me_general
    user.contact_me_topic_chosen = data.contact_me_topic_chosen

    session.add(user)
    session.commit()

    return UserResponse.from_model(user)


class AdminTopicGetResponse(BaseModel):
    title: str
    description: str
    structure: TopicStructure
    user: UserResponse
    voted: List[UserResponse]


@app.delete("/topic/{topic_id}")
async def delete_topic(topic_id: str, _ = Depends(verify_admin_session_key)):
    session = get_session()
    topic = session.query(Topic).filter(Topic.id == topic_id).first()
    session.delete(topic)
    session.commit()

    def dictt(topic):
        data = json.loads(topic.json())
        return data

    save_to_s3(
        bucket_name=POLYGLOT_VICTORIA_BUCKET_NAME,
        bucket_key="cache/topics.json",
        json_data={"topics": [dictt(t) for t in _get_topics()]},
    )


@app.get("/topic/{topic_id}")
async def admin_topic_get(
    topic_id: str, _ = Depends(verify_admin_session_key)
) -> AdminTopicGetResponse:

    session = get_session()
    topic = session.query(Topic).filter(Topic.id == topic_id).first()

    def get_user_response(user_id):
        user = get_session().query(User).filter(User.id == user_id).first()

        return UserResponse(
            name=user.name,
            avatar_url=user.avatar_url,
            email=user.email,
            id=user.id,
            login=user.login or "",
            contact_me_general=user.contact_me_general,
            contact_me_topic_chosen=user.contact_me_topic_chosen,
        )

    votes_qs = session.query(Vote).filter(Vote.topic_id == topic_id)

    return AdminTopicGetResponse(
        title=topic.title,
        description=topic.description,
        structure=topic.topic_structure,
        user=get_user_response(topic.user_id),
        voted=[get_user_response(vote.user_id) for vote in votes_qs],
    )


@app.post("/topic/{topic_id}")
async def admin_topic_edit(
    topic_id: str,
    data: TopicCreateRequest,
    user_sesion = Depends(verify_admin_session_key),
):
    user, session = user_sesion
    topic = session.query(Topic).filter(Topic.id == topic_id).first()

    topic.title = data.title
    topic.description = data.description
    topic.topic_structure = data.structure

    session.add(topic)
    session.commit()

    save_to_s3(
        bucket_name=POLYGLOT_VICTORIA_BUCKET_NAME,
        bucket_key="cache/topics.json",
        json_data={"topics": [t.dict() for t in _get_topics()]},
    )
