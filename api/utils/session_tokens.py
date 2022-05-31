import uuid
from typing import Optional, Tuple

from utils.github import get_github_access_token

session_tokens = {}


def get_session_token(code:str, state:str) -> Optional[Tuple[str, str]]:
    if (code, state) not in session_tokens:
        return None
    return session_tokens[(code, state)]


def create_session_token(code:str, state:str) -> Tuple[str, str]:
    github_access_token = get_github_access_token(code)
    session_token = f"session_token_{uuid.uuid4()}"
    session_tokens[(code, state)] = session_token, github_access_token
    return session_token, github_access_token


def delete_session_token(session_token:str):
    for key in session_tokens:
        if session_token == session_tokens[key][0]:
            del session_tokens[key]
