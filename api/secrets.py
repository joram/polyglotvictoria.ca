from pydantic import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str
    GITHUB_SCOPE: str = "read:user"
    REACT_APP_REDIRECT_URI: str = "http://localhost:3000/login"


secrets = Settings()
