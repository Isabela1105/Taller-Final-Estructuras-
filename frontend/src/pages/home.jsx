import { useEffect, useState } from "react";

// Puedes dejar esto como está si ya tenías api.js.
// Aquí lo dejo inline para que el archivo funcione solo.
const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export default function Home() {
  // --- Nodos ---
  const [nodes, setNodes] = useState([]);
  const [nodeName, setNodeName] = useState("");

  // --- Conexiones (aristas) ---
  const [edges, setEdges] = useState([]);
  const [edgeSrc, setEdgeSrc] = useState("");
  const [edgeDst, setEdgeDst] = useState("");
  const [edgeWeight, setEdgeWeight] = useState("");

  // --- Algoritmos ---
  const [bfsStart, setBfsStart] = useState("");
  const [bfsOrder, setBfsOrder] = useState([]);
  const [bfsTree, setBfsTree] = useState([]);

  const [dSrc, setDSrc] = useState("");
  const [dDst, setDDst] = useState("");
  const [dPath, setDPath] = useState([]);
  const [dDistance, setDDistance] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadNodes();
    loadEdges();
  }, []);

  async function loadNodes() {
    setErrorMsg("");
    try {
      const res = await fetch(`${API}/graph/nodes`, { headers: authHeaders() });
      if (!res.ok) throw await res.json();
      setNodes(await res.json());
    } catch (e) {
      setErrorMsg(e?.detail || "No se pudieron cargar los puntos.");
    }
  }

  async function loadEdges() {
    setErrorMsg("");
    try {
      const res = await fetch(`${API}/graph/edges`, { headers: authHeaders() });
      if (!res.ok) throw await res.json();
      setEdges(await res.json());
    } catch (e) {
      setErrorMsg(e?.detail || "No se pudieron cargar las conexiones.");
    }
  }

  // ---------- Nodos ----------
  async function createNode(e) {
    e.preventDefault();
    if (!nodeName.trim()) return;
    setErrorMsg("");
    try {
      const res = await fetch(`${API}/graph/nodes`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ name: nodeName.trim() }),
      });
      if (!res.ok) throw await res.json();
      setNodeName("");
      await loadNodes();
    } catch (e) {
      setErrorMsg(e?.detail || "Error creando el punto.");
    }
  }

  async function deleteNode(id) {
    setErrorMsg("");
    try {
      const res = await fetch(`${API}/graph/nodes/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.status !== 204) throw await res.json();
      await Promise.all([loadNodes(), loadEdges()]);
    } catch (e) {
      setErrorMsg(e?.detail || "No se pudo eliminar el punto.");
    }
  }

  // ---------- Conexiones ----------
  async function createEdge(e) {
    e.preventDefault();
    setErrorMsg("");
    try {
      const payload = {
        src_id: Number(edgeSrc),
        dst_id: Number(edgeDst),
        weight: Number(edgeWeight),
      };
      const res = await fetch(`${API}/graph/edges`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw await res.json();
      setEdgeSrc("");
      setEdgeDst("");
      setEdgeWeight("");
      await loadEdges();
    } catch (e) {
      setErrorMsg(e?.detail || "Error creando la conexión.");
    }
  }

  async function deleteEdge(id) {
    setErrorMsg("");
    try {
      const res = await fetch(`${API}/graph/edges/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.status !== 204) throw await res.json();
      await loadEdges();
    } catch (e) {
      setErrorMsg(e?.detail || "No se pudo eliminar la conexión.");
    }
  }

  // ---------- Algoritmos ----------
  async function runBFS(e) {
    e.preventDefault();
    if (!bfsStart) return;
    setErrorMsg("");
    setBfsOrder([]);
    setBfsTree([]);

    try {
      const res = await fetch(`${API}/graph/bfs?start_id=${bfsStart}`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw await res.json();
      const data = await res.json();
      setBfsOrder(data.order || []);
      setBfsTree(data.tree || []);
    } catch (e) {
      setErrorMsg(e?.detail || "No se pudo ejecutar BFS.");
    }
  }

  async function runDijkstra(e) {
    e.preventDefault();
    if (!dSrc || !dDst) return;
    setErrorMsg("");
    setDPath([]);
    setDDistance(null);

    try {
      const res = await fetch(
        `${API}/graph/shortest-path?src_id=${dSrc}&dst_id=${dDst}`,
        { headers: authHeaders() }
      );
      if (!res.ok) throw await res.json();
      const data = await res.json();
      setDPath(data.path || []);
      setDDistance(data.distance ?? null);
    } catch (e) {
      setErrorMsg(e?.detail || "No se pudo ejecutar Dijkstra.");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <div className="page">
      <header className="topbar">
        <h1 className="title">Mapa de puntos y conexiones</h1>
        <button className="btn btn-outline" onClick={logout}>
          Cerrar sesión
        </button>
      </header>

      {errorMsg && (
        <div className="alert">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg("")} className="btn btn-danger btn-sm">
            Cerrar
          </button>
        </div>
      )}

      <main className="container grid-2">
        {/* ---------- NODOS ---------- */}
        <section className="card">
          <h2 className="card-title">Puntos (nodos)</h2>
          <form className="row gap" onSubmit={createNode}>
            <input
              className="input"
              placeholder="Nombre del lugar o punto"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
            />
            <button className="btn">Crear</button>
          </form>

          <div className="list">
            {nodes.length === 0 ? (
              <p className="muted">Aún no hay puntos creados.</p>
            ) : (
              nodes.map((n) => (
                <div key={n.id} className="list-item">
                  <div>
                    <span className="badge">ID {n.id}</span>{" "}
                    <strong>{n.name}</strong>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteNode(n.id)}
                  >
                    Eliminar
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ---------- CONEXIONES ---------- */}
        <section className="card">
          <h2 className="card-title">Conexiones (aristas)</h2>
          <form className="row gap" onSubmit={createEdge}>
            <input
              className="input"
              placeholder="Desde (ID origen)"
              value={edgeSrc}
              onChange={(e) => setEdgeSrc(e.target.value)}
              inputMode="numeric"
            />
            <input
              className="input"
              placeholder="Hasta (ID destino)"
              value={edgeDst}
              onChange={(e) => setEdgeDst(e.target.value)}
              inputMode="numeric"
            />
            <input
              className="input"
              placeholder="Distancia o peso (> 0)"
              value={edgeWeight}
              onChange={(e) => setEdgeWeight(e.target.value)}
              inputMode="decimal"
            />
            <button className="btn">Crear</button>
          </form>

          <div className="table">
            <div className="table-head">
              <div>#</div>
              <div>Desde</div>
              <div>Hasta</div>
              <div>Distancia</div>
              <div>Acciones</div>
            </div>
            {edges.length === 0 ? (
              <div className="muted p-2">Aún no hay conexiones.</div>
            ) : (
              edges.map((e) => (
                <div key={e.id} className="table-row">
                  <div>{e.id}</div>
                  <div>{e.src_id}</div>
                  <div>{e.dst_id}</div>
                  <div>{e.weight}</div>
                  <div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteEdge(e.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ---------- ALGORITMOS ---------- */}
        <section className="card span-2">
          <h2 className="card-title">Algoritmos</h2>

          <div className="algorithm">
            <h3 className="subtitle">Explorar conexiones (BFS)</h3>
            <form className="row gap" onSubmit={runBFS}>
              <input
                className="input"
                placeholder="ID inicial"
                value={bfsStart}
                onChange={(e) => setBfsStart(e.target.value)}
                inputMode="numeric"
              />
              <button className="btn">BFS</button>
            </form>

            {!!bfsOrder.length && (
              <>
                <div className="chips">
                  {bfsOrder.map((id, i) => (
                    <span key={i} className="chip">
                      {id}
                    </span>
                  ))}
                </div>

                <div className="table mt">
                  <div className="table-head">
                    <div>Nodo</div>
                    <div>Padre</div>
                    <div>Profundidad</div>
                  </div>
                  {bfsTree.map((row, idx) => (
                    <div key={idx} className="table-row">
                      <div>{row.node_id}</div>
                      <div>{row.parent_id ?? "—"}</div>
                      <div>{row.depth}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="algorithm mt">
            <h3 className="subtitle">Ruta más corta (Dijkstra)</h3>
            <form className="row gap" onSubmit={runDijkstra}>
              <input
                className="input"
                placeholder="Desde (ID inicio)"
                value={dSrc}
                onChange={(e) => setDSrc(e.target.value)}
                inputMode="numeric"
              />
              <input
                className="input"
                placeholder="Hasta (ID destino)"
                value={dDst}
                onChange={(e) => setDDst(e.target.value)}
                inputMode="numeric"
              />
              <button className="btn">Dijkstra</button>
            </form>

            {dPath.length > 0 && (
              <div className="mt">
                <div className="chips">
                  {dPath.map((id, i) => (
                    <span key={i} className="chip">
                      {id}
                    </span>
                  ))}
                </div>
                <p className="muted mt">
                  Distancia total: <strong>{dDistance}</strong>
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

