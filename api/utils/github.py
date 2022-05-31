from typing import Optional

import requests
from utils.secrets import secrets


def get_github_access_token(code:str) -> Optional[str]:
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
    if "access_token" not in data:
        return None
    github_access_token = data['access_token']
    return github_access_token

def get_github_user_details(github_access_token:str) -> dict:
    user_details_response = requests.get("https://api.github.com/user", headers={"Authorization": f"token {github_access_token}"})
    return user_details_response.json()
