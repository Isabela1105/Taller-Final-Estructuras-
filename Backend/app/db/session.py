from sqlmodel import create_engine
from ..core.config import settings

connect_args = {"check_same_thread": False} if settings.SQLITE_URL.startswith("sqlite") else {}
engine = create_engine(settings.SQLITE_URL, connect_args=connect_args)
