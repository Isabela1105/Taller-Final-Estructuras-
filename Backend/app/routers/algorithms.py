from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..core.deps import get_db, get_current_user
from ..models.edge import Edge
from ..models.node import Node

router = APIRouter(prefix="/graph", tags=["graph:algorithms"], dependencies=[Depends(get_current_user)])

def build_graph(db: Session):
    nodes = [n.id for n in db.exec(select(Node)).all()]
    graph: dict[int, list[tuple[int, float]]] = {n: [] for n in nodes}
    for e in db.exec(select(Edge)).all():
        graph.setdefault(e.src_id, []).append((e.dst_id, float(e.weight)))
    return graph

@router.get("/bfs")
def bfs(start_id: int, db: Session = Depends(get_db)):
    graph = build_graph(db)
    if start_id not in graph:
        raise HTTPException(status_code=404, detail="start node not found")

    order: list[int] = []
    tree: list[dict] = []
    from collections import deque
    q = deque()
    visited = set([start_id])
    parent = {start_id: None}
    depth = {start_id: 0}
    q.append(start_id)

    while q:
        u = q.popleft()
        order.append(u)
        tree.append({"node_id": u, "parent_id": parent[u], "depth": depth[u]})
        for v, _w in graph.get(u, []):
            if v not in visited:
                visited.add(v)
                parent[v] = u
                depth[v] = depth[u] + 1
                q.append(v)

    return {"order": order, "tree": tree}

@router.get("/shortest-path")
def shortest_path(src_id: int, dst_id: int, db: Session = Depends(get_db)):
    graph = build_graph(db)
    if src_id not in graph or dst_id not in graph:
        raise HTTPException(status_code=404, detail="src or dst not found")

    import heapq
    dist = {n: float("inf") for n in graph}
    prev: dict[int, int] = {}
    dist[src_id] = 0.0
    pq = [(0.0, src_id)]

    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in graph.get(u, []):
            if w <= 0:
                continue  # seguridad: solo pesos positivos
            alt = d + w
            if alt < dist[v]:
                dist[v] = alt
                prev[v] = u
                heapq.heappush(pq, (alt, v))

    if dist[dst_id] == float("inf"):
        raise HTTPException(status_code=404, detail="no path between src and dst")

    path = []
    cur = dst_id
    while cur in prev:
        path.insert(0, cur)
        cur = prev[cur]
    path.insert(0, src_id)

    return {"path": path, "distance": dist[dst_id]}
