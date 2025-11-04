from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from ..core.deps import get_db, get_current_user
from ..schemas.node import NodeCreate
from ..models.node import Node
from ..models.edge import Edge
from ..crud import node as crud_node

router = APIRouter(prefix="/graph/nodes", tags=["graph:nodes"], dependencies=[Depends(get_current_user)])

@router.post("", status_code=201)
def create_node(body: NodeCreate, db: Session = Depends(get_db)):
    if crud_node.get_by_name(db, body.name):
        raise HTTPException(status_code=400, detail="node name must be unique")
    n = crud_node.create_node(db, body.name)
    return {"id": n.id, "name": n.name}

@router.get("")
def list_nodes(db: Session = Depends(get_db)):
    return [{"id": n.id, "name": n.name} for n in crud_node.list_nodes(db)]

@router.delete("/{node_id}", status_code=204)
def delete_node(node_id: int, db: Session = Depends(get_db)):
    n = db.get(Node, node_id)
    if not n:
        raise HTTPException(status_code=404, detail="node not found")
    # borrar aristas incidentes
    for e in db.exec(select(Edge).where((Edge.src_id == node_id) | (Edge.dst_id == node_id))).all():
        db.delete(e)
    db.delete(n)
    db.commit()
    return
