from sqlmodel import SQLModel, Field

class Edge(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    src_id: int = Field(foreign_key="node.id")
    dst_id: int = Field(foreign_key="node.id")
    weight: float = 1.0
