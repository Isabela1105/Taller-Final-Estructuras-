import { useState } from "react";
import { apiFetch } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import SectionCard from "../ui/SectionCard.jsx";
import ErrorBanner from "../ui/ErrorBanner.jsx";
import Input from "../ui/Input.jsx";

export default function AlgorithmsSection() {
    const { token } = useAuth();
    const [error, setError] = useState(null);

    const [startId, setStartId] = useState("");
    const [bfsOrder, setBfsOrder] = useState([]);
    const [bfsTree, setBfsTree] = useState([]); // [{ parent, child }]

    const [srcId, setSrcId] = useState("");
    const [dstId, setDstId] = useState("");
    const [path, setPath] = useState([]);
    const [distance, setDistance] = useState(null);

    const runBfs = async (e) => {
    e.preventDefault();
    setError(null);
    try {
        const res = await apiFetch("/algorithms/bfs", { method: "POST", token, body: { start_id: startId } });
        setBfsOrder(res?.order || []);
        setBfsTree(res?.tree || []);
        } catch (e) { setError(e.message); }
    }
    const runDijkstra = async (e) => {
    e.preventDefault();
    setError(null);
    try {
        const res = await apiFetch("/algorithms/dijkstra", { method: "POST", token, body: { src_id: srcId, dst_id: dstId } });
        setPath(res?.path || []);
        setDistance(typeof res?.distance === "number" ? res.distance : null);
        } catch (e) { setError(e.message); }
    };
    return (
<SectionCard title="Algoritmos">
<ErrorBanner error={error} onClose={() => setError(null)} />


{/* BFS */}
<div style={{ marginBottom: 16 }}>
<h3 style={{ margin: 0, marginBottom: 8 }}>BFS</h3>
<form onSubmit={runBfs} className="row row-3" style={{ marginBottom: 8 }}>
<Input label="start_id" value={startId} onChange={setStartId} required />
<div style={{ display: "flex", alignItems: "end" }}>
<button className="btn">Ejecutar BFS</button>
</div>
</form>
{bfsOrder.length > 0 && (
<div className="card" style={{ padding: 12, marginBottom: 8 }}>
<div style={{ fontWeight: 600, marginBottom: 4 }}>Orden de visita</div>
<div className="badge">{bfsOrder.join(" → ")}</div>
</div>
)}
{bfsTree.length > 0 && (
<table className="table">
<thead>
<tr><th>Padre</th><th>Hijo</th></tr>
</thead>
<tbody>
{bfsTree.map((e, i) => (
<tr key={i}><td>{e.parent}</td><td>{e.child}</td></tr>
))}
</tbody>
</table>
)}
</div>


{/* Dijkstra */}
<div>
<h3 style={{ margin: 0, marginBottom: 8 }}>Dijkstra</h3>
<form onSubmit={runDijkstra} className="row row-4" style={{ marginBottom: 8 }}>
<Input label="src_id" value={srcId} onChange={setSrcId} required />
<Input label="dst_id" value={dstId} onChange={setDstId} required />
<div style={{ display: "flex", alignItems: "end" }}>
<button className="btn">Ejecutar Dijkstra</button>
</div>
</form>
{(path.length > 0 || typeof distance === "number") && (
<div className="card" style={{ padding: 12 }}>
{path.length > 0 && (
<div style={{ marginBottom: 6 }}>
<div style={{ fontWeight: 600 }}>Camino</div>
<div className="badge">{path.join(" → ")}</div>
</div>
)}
{typeof distance === "number" && (
<div>
<div style={{ fontWeight: 600 }}>Distancia total</div>
<div className="badge">{distance}</div>
</div>
)}
</div>
)}
</div>
</SectionCard>
);
}
