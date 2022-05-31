import datetime
import urllib.parse
from typing import List

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from models import Topic, get_session, User
from utils.auth import verify_session_key
from utils.github import get_github_user_details
from utils.secrets import secrets
from utils.session_tokens import get_session_token, create_session_token, delete_session_token
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

    data = {
        "client_id": secrets.GITHUB_CLIENT_ID, # string	Required. The client ID you received from GitHub when you registered.
        "redirect_uri": secrets.GITHUB_REDIRECT_URI, # The URL in your application where users will be sent after authorization. See details below about redirect urls.
        "scope": secrets.GITHUB_SCOPE, # A space-delimited list of scopes. If not provided, scope defaults to an empty list for users that have not authorized any scopes for the application. For users who have authorized scopes for the application, the user won't be shown the OAuth authorization page with the list of scopes. Instead, this step of the flow will automatically complete with the set of scopes the user has authorized for the application. For example, if a user has already performed the web flow twice and has authorized one token with user scope and another token with repo scope, a third web flow that does not provide a scope will receive a token with user and repo scope.
        "state": get_short_lived_secret(), # An unguessable random string. It is used to protect against cross-site request forgery attacks.
        "allow_signup": True,
    }
    querystring = urllib.parse.urlencode(data)
    return "https://github.com/login/oauth/authorize?"+querystring


@app.get("/auth/session_token")
async def auth(code:str, state:str) -> dict:
    data = get_session_token(code, state)
    if data:
        session_token, github_access_token = data
        return {
            "session_token": session_token,
            "github_profile": get_github_user_details(github_access_token),
        }

    if not verify_short_lived_secret(state):
        return {"error": "INVALID_STATE", "message": "short lived secret does not exist in server, please refresh."}

    session_token, github_access_token = create_session_token(code, state)
    return {
        "session_token": session_token,
        "github_profile": get_github_user_details(github_access_token),
    }


@app.delete("/auth/session_token")
async def auth(session_token:str):
    delete_session_token(session_token)


@app.get("/topics")
async def list_topic(session_token:str) -> List[Topic]:
    return get_session().query(Topic)


@app.post("/topic/create")
async def create_topic(title:str, description: str, user: User = Depends(verify_session_key),):

    topic = Topic(
        title=title,
        description=description,
        user_id=user.id,
    )

    session = get_session()
    session.add(topic)
    session.commit()

    return topic