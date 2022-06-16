import datetime
import enum
import json
import uuid

from sqlalchemy import create_engine, Column, Integer, ForeignKey, String, DateTime, Enum, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session

from utils.secrets import secrets

Base = declarative_base()
engine = create_engine(secrets.DATABASE_URI)


def get_session() -> Session:
    return Session(engine)


def short_lived_secret_uid():
    return f"secret_{uuid.uuid4()}"


def session_token_uid():
    return f"session_{uuid.uuid4()}"


def user_uid():
    return f"user_{uuid.uuid4()}"


def topic_uid():
    return f"topic_{uuid.uuid4()}"


class ShortLivedSecret(Base):
    __tablename__ = "short_lived_secrets"

    id = Column(String, primary_key=True)
    secret = Column(String, default=short_lived_secret_uid)
    created_at = Column(DateTime, default=datetime.datetime.now)
    expires_at = Column(DateTime, default=datetime.datetime.now)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    name = Column(String)
    login = Column(String)
    avatar_url = Column(String)
    data = Column(String)
    email = Column(String)
    contact_me_general = Column(Boolean)
    contact_me_topic_chosen = Column(Boolean)
    created_at = Column(DateTime, default=datetime.datetime.now)

    @property
    def get_email(self):
        data = json.loads(self.data)
        return data["email"]


class SessionToken(Base):
    __tablename__ = "session_tokens"

    id = Column(String, primary_key=True)
    token = Column(String, default=session_token_uid)
    user_id = Column(String, ForeignKey('users.id'))
    created_at = Column(DateTime, default=datetime.datetime.now)

    github_code = Column(String)
    github_access_token = Column(String)
    secret = Column(String, ForeignKey('short_lived_secrets.secret'))


class TopicType(str, enum.Enum):
    PROPOSED = "proposed"
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    HIDDEN = "hidden"


class TopicStructure(str, enum.Enum):
    TALK = "talk"
    ROUND_TABLE = "round table"
    PANEL = "panel"
    FISH_BOWL = "fish bowl"


class Topic(Base):
    __tablename__ = "topics"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey('users.id'))
    title = Column(String(256))
    description = Column(String(1024))
    topic_type = Column(Enum(TopicType), default=TopicType.PROPOSED)
    topic_structure = Column(Enum(TopicStructure), default=TopicStructure.ROUND_TABLE)
    created_at = Column(DateTime, default=datetime.datetime.now)
    scheduled_datetime = datetime.datetime


class VoteType(enum.Enum):
    IN_PERSON = "in_person"
    REMOTE = "remote"
    NONE = "none"


class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True)
    topic_id = Column(String, ForeignKey('topics.id'))
    user_id = Column(String, ForeignKey('users.id'))
    vote_type = Column(Enum(VoteType))
    created_at = Column(DateTime, default=datetime.datetime.now)
