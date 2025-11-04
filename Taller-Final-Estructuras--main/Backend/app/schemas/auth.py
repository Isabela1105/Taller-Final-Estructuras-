# app/schemas/auth.py
from pydantic import BaseModel, constr

# -------- Requests --------
class RegisterRequest(BaseModel):
    username: constr(min_length=3, max_length=50)
    password: constr(min_length=4, max_length=72)  # bcrypt admite 72 bytes

class LoginJSON(BaseModel):
    username: str
    password: str

# -------- Responses --------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserPublic(BaseModel):
    id: int
    username: str
