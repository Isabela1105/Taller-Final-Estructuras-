from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
from .config import settings
import hashlib

# bcrypt a través de passlib
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _normalize_password(p: str) -> str:
    # Siempre pre-hash para evitar límite de 72 bytes y diferencias por encoding
    return hashlib.sha256(p.encode("utf-8")).hexdigest()

def get_password_hash(password: str) -> str:
    return pwd_context.hash(_normalize_password(password))

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(_normalize_password(plain), hashed)

def create_access_token(subject: str, expires_minutes: Optional[int] = None) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=expires_minutes or settings.ACCESS_TOKEN_EXPIRES_MINUTES
    )
    to_encode = {"sub": subject, "exp": expire}
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)

