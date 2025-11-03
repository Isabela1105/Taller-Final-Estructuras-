import csv
from pathlib import Path
from sqlmodel import Session, select
from app.db.session import engine
from app.db.init_db import init_db
from app.models.node import Node
from app.models.edge import Edge
from app.crud.node import get_by_name, create_node

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"

def ensure_node(session: Session, name: str) -> Node:
    n = get_by_name(session, name)
    if n:
        return n
    return create_node(session, name)

def main():
    init_db()
    with Session(engine) as db:
        # 1) Nodos
        nodes_csv = DATA / "nodes.csv"
        if nodes_csv.exists():
            with nodes_csv.open(newline="", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    name = row.get("name") or row.get("Name") or row.get("NAME")
                    if not name:
                        continue
                    ensure_node(db, name.strip())

        # 2) Aristas
        edges_csv = DATA / "edges.csv"
        if edges_csv.exists():
            with edges_csv.open(newline="", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    src_name = (row.get("src_name") or "").strip()
                    dst_name = (row.get("dst_name") or "").strip()
                    w_str = (row.get("weight") or "1").strip()
                    if not src_name or not dst_name:
                        continue
                    try:
                        weight = float(w_str)
                    except:
                        continue
                    if weight <= 0:
                        continue

                    src = ensure_node(db, src_name)
                    dst = ensure_node(db, dst_name)

                    # idempotente: existe una arista igual?
                    exists = db.exec(
                        select(Edge).where(
                            (Edge.src_id == src.id) &
                            (Edge.dst_id == dst.id) &
                            (Edge.weight == weight)
                        )
                    ).first()
                    if not exists:
                        db.add(Edge(src_id=src.id, dst_id=dst.id, weight=weight))
                        db.commit()

if __name__ == "__main__":
    main()
