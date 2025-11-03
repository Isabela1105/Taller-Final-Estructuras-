from pydantic import BaseModel

class RegisterRequest(BaseModel):
    username: str
    password: str

class LoginJSON(BaseModel):
    username: str
    password: str

class MeResponse(BaseModel):
    id: int
    username: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

from pydantic import BaseModel, Field

class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    # máx 200 car. por si se pega algo largo; lo normalizamos antes de hashear
    password: str = Field(min_length=3, max_length=200)

