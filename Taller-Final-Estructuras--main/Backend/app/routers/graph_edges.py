from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from ..core.deps import get_db, get_current_user
from ..schemas.edge import EdgeCreate
from ..models.edge import Edge
from ..models.node import Node
from ..crud import edge as crud_edge

router = APIRouter(prefix="/graph/edges", tags=["graph:edges"], dependencies=[Depends(get_current_user)])

@router.post("", status_code=201)
def create_edge(body: EdgeCreate, db: Session = Depends(get_db)):
    if body.weight <= 0:
        raise HTTPException(status_code=400, detail="weight must be > 0")
    if not db.get(Node, body.src_id) or not db.get(Node, body.dst_id):
        raise HTTPException(status_code=400, detail="src_id and dst_id must exist")
    e = crud_edge.create_edge(db, body.src_id, body.dst_id, float(body.weight))
    return {"id": e.id, "src_id": e.src_id, "dst_id": e.dst_id, "weight": e.weight}

@router.get("")
def list_edges(db: Session = Depends(get_db)):
    return [{"id": e.id, "src_id": e.src_id, "dst_id": e.dst_id, "weight": e.weight} for e in crud_edge.list_edges(db)]

@router.delete("/{edge_id}", status_code=204)
def delete_edge(edge_id: int, db: Session = Depends(get_db)):
    ok = crud_edge.delete_edge(db, edge_id)
    if not ok:
        raise HTTPException(status_code=404, detail="edge not found")
    return
