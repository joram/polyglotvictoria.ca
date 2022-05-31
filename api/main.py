import datetime
import enum
import json
import urllib.parse
from typing import List

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models import Topic, get_session, User, SessionToken, user_uid, session_token_uid, short_lived_secret_uid, \
    ShortLivedSecret, topic_uid, TopicType, TopicStructure
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
    title: str
    description: str
    votes_in_person: int
    votes_remote: int
    type: TopicType
    structure: TopicStructure


@app.get("/topics")
async def list_topic() -> List[TopicResponse]:
    qs = get_session().query(Topic)
    topics = [
        TopicResponse(
            title=topic.title,
            description=topic.description,
            votes_in_person=0,
            votes_remote=0,
            type=topic.topic_type,
            structure=topic.topic_structure,
        ) for topic in qs
    ]
    return topics

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
