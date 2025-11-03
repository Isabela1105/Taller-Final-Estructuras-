from pydantic import BaseModel, Field

class EdgeCreate(BaseModel):
    src_id: int
    dst_id: int
    weight: float = Field(gt=0)

class EdgeOut(BaseModel):
    id: int
    src_id: int
    dst_id: int
    weight: float
