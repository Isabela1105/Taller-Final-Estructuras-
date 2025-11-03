from sqlmodel import Session, select
from ..models.node import Node

def get_by_name(db: Session, name: str) -> Node | None:
    return db.exec(select(Node).where(Node.name == name)).first()

def list_nodes(db: Session): 
    return db.exec(select(Node)).all()

def create_node(db: Session, name: str) -> Node:
    n = Node(name=name)
    db.add(n); db.commit(); db.refresh(n); return n

def delete_node(db: Session, node_id: int):
    obj = db.get(Node, node_id)
    if obj:
        db.delete(obj); db.commit()
        return True
    return False
