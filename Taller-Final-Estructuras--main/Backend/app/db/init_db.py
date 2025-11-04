from sqlmodel import SQLModel, Session, select
from .session import engine
from ..models.user import User

def init_db():
    SQLModel.metadata.create_all(engine)
    # opcional: crear usuario demo si no existe (comentado por seguridad)
    # with Session(engine) as db:
    #     exists = db.exec(select(User).where(User.username == "demo")).first()
    #     if not exists:
    #         from ..core.security import get_password_hash
    #         db.add(User(username="demo", hashed_password=get_password_hash("1234")))
    #         db.commit()
