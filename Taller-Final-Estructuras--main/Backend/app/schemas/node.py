from pydantic import BaseModel

class NodeCreate(BaseModel):
    name: str

class NodeOut(BaseModel):
    id: int
    name: str
