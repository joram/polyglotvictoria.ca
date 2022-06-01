import datetime
import enum
import json
import urllib.parse
from typing import List, Optional, Tuple

from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models import Topic, get_session, User, SessionToken, user_uid, session_token_uid, short_lived_secret_uid, \
    ShortLivedSecret, topic_uid, TopicType, TopicStructure, Vote, VoteType
from utils.auth import verify_session_key
from utils.github import get_github_user_details, get_github_access_token
from utils.secrets import secrets
from utils.short_lived_secrets import get_short_lived_secret, verify_short_lived_secret

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
    return "https://github.com/login/oauth/authorize?"+querystring


@app.get("/auth/session_token")
async def auth(code: str, state: str) -> dict:
    session = get_session()

    session_token = None
    qs = session.query(SessionToken).filter(SessionToken.github_code == code, SessionToken.secret == state)
    if qs.count() == 1:
        session_token = qs.first()
        github_profile = get_github_user_details(session_token.github_access_token)

    if session_token is None:
        # if not verify_short_lived_secret(state):
        #     return {"error": "INVALID_STATE", "message": "short lived secret does not exist in server, please refresh."}
        github_access_token = get_github_access_token(code)
        github_profile = get_github_user_details(github_access_token)
        user_qs = session.query(User).filter(User.login==github_profile["login"])
        if user_qs.count() > 0:
            user = user_qs.first()
        else:
            user = User(
                id=user_uid(),
                name=github_profile["name"],
                login=github_profile["login"],
                avatar_url=github_profile["avatar_url"],
                data=json.dumps(github_profile)
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


@app.get("/topics")
async def list_topics(session_token: Optional[str] = Header(default=None)) -> List[TopicResponse]:
    def get_votes(topic_id:str) -> Tuple[int, int]:
        session = get_session()
        remote_qs = session.query(Vote).filter(Vote.topic_id==topic_id, Vote.vote_type==VoteType.REMOTE)
        in_person_qs = session.query(Vote).filter(Vote.topic_id==topic_id, Vote.vote_type==VoteType.IN_PERSON)
        return remote_qs.count(), in_person_qs.count()

    session = get_session()
    qs = session.query(Topic)
    if session_token in [None, "undefined"]:
        topics = []
        for topic in qs:
            votes_remote, votes_in_person = get_votes(topic.id)
            topics.append(TopicResponse(
                id=topic.id,
                title=topic.title,
                description=topic.description,
                votes_in_person=votes_in_person,
                votes_remote=votes_remote,
                type=topic.topic_type,
                structure=topic.topic_structure,
            ))
        return topics

    session_token = session.query(SessionToken).filter(SessionToken.token == session_token).first()
    user,_ = session.query(User, User.id==session_token.user_id).first()
    topics = []
    for topic in qs:
        voted_in_person = session.query(Vote).filter(
            Vote.user_id == user.id,
            Vote.topic_id == topic.id,
            Vote.vote_type == VoteType.IN_PERSON,
        ).count() >= 1
        voted_remote = session.query(Vote).filter(
            Vote.user_id == user.id,
            Vote.topic_id == topic.id,
            Vote.vote_type == VoteType.REMOTE,
        ).count() >= 1
        votes_remote, votes_in_person = get_votes(topic.id)
        topics.append(TopicResponse(
            id=topic.id,
            title=topic.title,
            description=topic.description,
            votes_in_person=votes_in_person,
            votes_remote=votes_remote,
            type=topic.topic_type,
            structure=topic.topic_structure,
            voted_in_person=voted_in_person,
            voted_remote=voted_remote,
        ))
    return topics


class TopicVoteRequest(BaseModel):
    type: VoteType


@app.post("/topic/{topic_id}/vote")
async def vote_for_topic(topic_id: str, data:TopicVoteRequest, user: User = Depends(verify_session_key),):
    session = get_session()

    # Remove all existing queries
    session.query(Vote).filter(
        Vote.topic_id == topic_id,
        Vote.user_id == user.id,
    ).delete()
    session.commit()

    if data.type == VoteType.NONE:
        return

    # New voted
    vote = Vote(
        vote_type=data.type,
        user_id=user.id,
        topic_id=topic_id
    )
    session = get_session()
    session.add(vote)
    session.commit()


class TopicCreateRequest(BaseModel):
    title: str
    description: str
    structure: TopicStructure


@app.post("/topic")
async def create_topic(data:TopicCreateRequest, user: User = Depends(verify_session_key),):

    topic = Topic(
        id=topic_uid(),
        title=data.title,
        description=data.description,
        user_id=user.id,
        topic_type=TopicType.PROPOSED,
        topic_structure=data.structure,
    )

    session = get_session()
    session.add(topic)
    session.commit()

    return topic
