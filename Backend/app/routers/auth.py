from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlmodel import Session
from ..core.deps import get_db
from ..core.security import get_password_hash, verify_password, create_access_token
from ..crud.user import get_by_username, create_user
from ..schemas.auth import RegisterRequest, LoginJSON, Token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    if get_by_username(db, body.username):
        raise HTTPException(status_code=400, detail="username already exists")
    hashed = get_password_hash(body.password)
    create_user(db, username=body.username, hashed_password=hashed)
    return {"message": "ok"}

@router.post("/login", response_model=Token)
def login(body: LoginJSON, db: Session = Depends(get_db)):
    user = get_by_username(db, body.username)
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="invalid credentials")
    token = create_access_token(user.username)
    return {"access_token": token, "token_type": "bearer"}
