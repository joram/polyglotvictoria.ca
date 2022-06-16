from typing import Optional

from pydantic import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str
    GITHUB_SCOPE: str = "read:user"
    GITHUB_REDIRECT_URI: str
    DATABASE_URI: str = 'sqlite:///data/database.sqlite'
    SLACK_WEBHOOK_URL: Optional[str]


secrets = Settings()
