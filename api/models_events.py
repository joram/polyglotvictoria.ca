import datetime
import enum

from sqlalchemy import Column, String, ForeignKey, Enum, Boolean, DateTime

from models import Base


class EventState(enum.Enum):
    DRAFT = "draft"
    OPEN_REGISTRATION = "open"
    CLOSED_REGISTRATION = "closed"
    PAST = "past"


class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True)
    state = Column(Enum(EventState))
    created_at = Column(DateTime, default=datetime.datetime.now)


class RegistrationTypeEnum(enum.Enum):
    INPERSON = "in-person"
    REMOTE = "remote"


class ShirtSizeEnum(enum.Enum):
    NONE = "none"
    XXS = "xxs"
    XS = "xs"
    S = "s"
    M = "m"
    L = "l"
    XL = "xl"
    XXL = "xxl"


class Registration(Base):
    __tablename__ = "registrations"

    id = Column(String, primary_key=True)
    event_id = Column(String, ForeignKey('topics.id'))
    email = Column(String)
    user_id = Column(String, ForeignKey('topics.id'))
    registration_type = Column(Enum(RegistrationTypeEnum))
    cancelled = Column(Boolean, default=False)

    shirt = Column(Boolean, default=False)
    shirt_size = Column(Enum(ShirtSizeEnum), default=ShirtSizeEnum.NONE)
    created_at = Column(DateTime, default=datetime.datetime.now)
