from fastapi import Header, HTTPException

from fastapi import Header, HTTPException

from models import get_session, SessionToken, User


async def verify_session_key(session_token: str = Header(default=None)) -> User:  # noqa: B008
    session = get_session()

    # get session token
    session_token_qs = session.query(SessionToken).filter(SessionToken.token == session_token)
    if session_token_qs.count() != 1:
        raise HTTPException(status_code=403, detail="Invalid Session Key")
    session_token = session_token_qs.first()

    # get user
    user_qs = session.query(User).filter(User.id==session_token.user_id)
    if user_qs.count() != 1:
        raise HTTPException(status_code=403, detail="Missing User")

    return user_qs.first()
