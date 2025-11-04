from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlmodel import Session
from ..db.session import engine
from ..crud.user import get_by_username
from .config import settings

oauth2 = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_db():
    with Session(engine) as session:
        yield session

def get_current_user(token: str = Depends(oauth2), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise ValueError
    except (JWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = get_by_username(db, username)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
