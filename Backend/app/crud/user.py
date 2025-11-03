from sqlmodel import Session, select
from ..models.user import User

def get_by_username(db: Session, username: str) -> User | None:
    return db.exec(select(User).where(User.username == username)).first()

def create_user(db: Session, username: str, hashed_password: str) -> User:
    user = User(username=username, hashed_password=hashed_password)
    db.add(user); db.commit(); db.refresh(user); return user
