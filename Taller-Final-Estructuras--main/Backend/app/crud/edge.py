from sqlmodel import Session, select
from ..models.edge import Edge

def list_edges(db: Session):
    return db.exec(select(Edge)).all()

def create_edge(db: Session, src_id: int, dst_id: int, weight: float) -> Edge:
    e = Edge(src_id=src_id, dst_id=dst_id, weight=weight)
    db.add(e); db.commit(); db.refresh(e); return e

def delete_edge(db: Session, edge_id: int):
    obj = db.get(Edge, edge_id)
    if obj:
        db.delete(obj); db.commit()
        return True
    return False
