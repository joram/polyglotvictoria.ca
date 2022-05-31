import datetime
import enum
import uuid

from sqlalchemy import create_engine, Column, Integer, ForeignKey, String, DateTime, Enum
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


class ShortLivedSecret(Base):
    __tablename__ = "short_lived_secrets"

    id = Column(Integer, primary_key=True)
    uid = Column(String, default=short_lived_secret_uid)
    created_at = Column(DateTime, default=datetime.datetime.now)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    login = Column(String)
    avatar_url = Column(String)
    data = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.now)


class SessionToken(Base):
    __tablename__ = "session_tokens"

    id = Column(Integer, primary_key=True)
    uid = Column(String, default=session_token_uid)
    user_id = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime, default=datetime.datetime.now)
    expires_at = Column(DateTime)


class Topic(Base):
    __tablename__ = "topics"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    title = Column(String)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.now)
    scheduled_datetime = datetime.datetime


class VoteType(enum.Enum):
    IN_PERSON = "in_person"
    REMOTE = "remote"


class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True)
    topic_id = Column(Integer, ForeignKey('topics.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    vote_type = Column(Enum(VoteType))
    created_at = Column(DateTime, default=datetime.datetime.now)
