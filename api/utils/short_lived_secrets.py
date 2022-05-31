import datetime
import uuid


short_lived_secrets = {}


def get_short_lived_secret():
    short_lived_secret = f"secret_{str(uuid.uuid4())}"
    short_lived_secrets[short_lived_secret] = datetime.datetime.now() + datetime.timedelta(minutes=5)
    return short_lived_secret


def verify_short_lived_secret(secret: str) -> bool:
    expires_at = short_lived_secrets.get(secret, 0)
    if expires_at == 0:
        return False
    if expires_at < datetime.datetime.now():
        return False
    return True
