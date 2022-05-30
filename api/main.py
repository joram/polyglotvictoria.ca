import urllib.parse
import uuid

import requests
from fastapi import FastAPI
from secrets import secrets
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/auth/github_url")
async def auth_github_url():
    short_lived_secret = f"secret_{str(uuid.uuid4())}"
    data = {
        "client_id": secrets.GITHUB_CLIENT_ID, # string	Required. The client ID you received from GitHub when you registered.
        "redirect_uri": secrets.REACT_APP_REDIRECT_URI, # The URL in your application where users will be sent after authorization. See details below about redirect urls.
        "scope": secrets.GITHUB_SCOPE, # A space-delimited list of scopes. If not provided, scope defaults to an empty list for users that have not authorized any scopes for the application. For users who have authorized scopes for the application, the user won't be shown the OAuth authorization page with the list of scopes. Instead, this step of the flow will automatically complete with the set of scopes the user has authorized for the application. For example, if a user has already performed the web flow twice and has authorized one token with user scope and another token with repo scope, a third web flow that does not provide a scope will receive a token with user and repo scope.
        "state": short_lived_secret, # An unguessable random string. It is used to protect against cross-site request forgery attacks.
        "allow_signup": True,
    }
    querystring = urllib.parse.urlencode(data)
    return "https://github.com/login/oauth/authorize?"+querystring


@app.get("/auth")
async def auth(code:str, state:str) -> dict:
    print(code, state)
    # TODO: verify state i.e. short_lived_secret

    response = requests.post(
        "https://github.com/login/oauth/access_token",
        data={
            "client_id": secrets.GITHUB_CLIENT_ID,
            "client_secret": secrets.GITHUB_CLIENT_SECRET,
            "code": code,
        },
        headers={
            "Accept": "application/json",
        }
    )
    data = response.json()
    print(response.status_code)
    print(data)
    if "access_token" not in data:
        return data

    user_details_response = requests.get("https://api.github.com/user", headers={"Authorization": f"token {data.get('access_token')}"})
    print(user_details_response.json())
    return user_details_response.json()