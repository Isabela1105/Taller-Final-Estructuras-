from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .db.init_db import init_db
from .routers import auth, graph_nodes, graph_edges, algorithms

app = FastAPI(title="Graph API (FastAPI + SQLModel)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(graph_nodes.router, prefix="/api")
app.include_router(graph_edges.router, prefix="/api")
app.include_router(algorithms.router, prefix="/api")


@app.on_event("startup")
def startup():
    init_db()

@app.get("/")
def root():
    return {"ok": True}
