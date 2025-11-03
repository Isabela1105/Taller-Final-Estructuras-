// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Home() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState("");

  // forms
  const [nodeName, setNodeName] = useState("");
  const [srcId, setSrcId] = useState("");
  const [dstId, setDstId] = useState("");
  const [weight, setWeight] = useState("");

  const [bfsStart, setBfsStart] = useState("");
  const [bfsResult, setBfsResult] = useState(null);

  const [djSrc, setDjSrc] = useState("");
  const [djDst, setDjDst] = useState("");
  const [djResult, setDjResult] = useState(null);

  const loadAll = async () => {
    try {
      setError("");
      const [ns, es] = await Promise.all([api.listNodes(), api.listEdges()]);
      setNodes(ns);
      setEdges(es);
    } catch (e) { setError(e.message); }
  };

  useEffect(() => { loadAll(); }, []);

  // NODOS
  const addNode = async (e) => {
    e.preventDefault();
    try {
      await api.createNode(nodeName.trim());
      setNodeName("");
      await loadAll();
    } catch (e) { setError(e.message); }
  };
  const delNode = async (id) => {
    try { await api.deleteNode(id); await loadAll(); }
    catch (e) { setError(e.message); }
  };

  // ARISTAS
  const addEdge = async (e) => {
    e.preventDefault();
    try {
      await api.createEdge(Number(srcId), Number(dstId), Number(weight));
      setSrcId(""); setDstId(""); setWeight("");
      await loadAll();
    } catch (e) { setError(e.message); }
  };
  const delEdge = async (id) => {
    try { await api.deleteEdge(id); await loadAll(); }
    catch (e) { setError(e.message); }
  };

  // ALGORITMOS
  const runBfs = async (e) => {
    e.preventDefault();
    try { setBfsResult(await api.bfs(Number(bfsStart))); }
    catch (e) { setError(e.message); }
  };
  const runDijkstra = async (e) => {
    e.preventDefault();
    try { setDjResult(await api.dijkstra(Number(djSrc), Number(djDst))); }
    catch (e) { setError(e.message); }
  };

  return (
    <div className="min-h-screen p-6" style={{background:"#19f0a0"}}>
      <div className="max-w-5xl mx-auto bg-white/70 p-6 rounded-2xl">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Home (protegido)</h1>
          <button
            className="px-3 py-1 rounded bg-red-500 text-white"
            onClick={() => { localStorage.removeItem("token"); window.location.href="/login"; }}
          >
            Cerrar sesión
          </button>
        </header>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error} <button className="ml-2 underline" onClick={()=>setError("")}>cerrar</button>
          </div>
        )}

        {/* NODOS */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Nodos</h2>
          <form onSubmit={addNode} className="flex gap-2 mb-3">
            <input className="border rounded px-2 py-1" placeholder="Nombre del nodo"
              value={nodeName} onChange={e=>setNodeName(e.target.value)} required />
            <button className="px-3 py-1 rounded bg-emerald-600 text-white">Crear</button>
          </form>
          <ul className="space-y-1">
            {nodes.map(n=>(
              <li key={n.id} className="flex items-center gap-2">
                <span>#{n.id} — {n.name}</span>
                <button className="px-2 py-0.5 rounded bg-gray-800 text-white"
                  onClick={()=>delNode(n.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </section>

        {/* ARISTAS */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Aristas</h2>
          <form onSubmit={addEdge} className="flex flex-wrap gap-2 mb-3">
            <input className="border rounded px-2 py-1 w-24" placeholder="src_id"
              value={srcId} onChange={e=>setSrcId(e.target.value)} required />
            <input className="border rounded px-2 py-1 w-24" placeholder="dst_id"
              value={dstId} onChange={e=>setDstId(e.target.value)} required />
            <input className="border rounded px-2 py-1 w-28" placeholder="weight"
              value={weight} onChange={e=>setWeight(e.target.value)} required />
            <button className="px-3 py-1 rounded bg-emerald-600 text-white">Crear</button>
          </form>
          <ul className="space-y-1">
            {edges.map(e=>(
              <li key={e.id} className="flex items-center gap-2">
                <span>#{e.id}: {e.src_id} → {e.dst_id} (w={e.weight})</span>
                <button className="px-2 py-0.5 rounded bg-gray-800 text-white"
                  onClick={()=>delEdge(e.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </section>

        {/* ALGORITMOS */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Algoritmos</h2>

          <form onSubmit={runBfs} className="flex gap-2 items-center mb-3">
            <label>Start ID</label>
            <input className="border rounded px-2 py-1 w-24" value={bfsStart}
              onChange={e=>setBfsStart(e.target.value)} required />
            <button className="px-3 py-1 rounded bg-indigo-600 text-white">BFS</button>
          </form>
          {bfsResult && (
            <div className="mb-4">
              <div><b>order:</b> {bfsResult.order.join(", ")}</div>
              <table className="mt-2 border">
                <thead><tr><th className="border px-2">node</th><th className="border px-2">parent</th><th className="border px-2">depth</th></tr></thead>
                <tbody>
                  {bfsResult.tree.map((r,i)=>(
                    <tr key={i}>
                      <td className="border px-2">{r.node_id}</td>
                      <td className="border px-2">{r.parent_id ?? "null"}</td>
                      <td className="border px-2">{r.depth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <form onSubmit={runDijkstra} className="flex gap-2 items-center">
            <label>src</label>
            <input className="border rounded px-2 py-1 w-24" value={djSrc}
              onChange={e=>setDjSrc(e.target.value)} required />
            <label>dst</label>
            <input className="border rounded px-2 py-1 w-24" value={djDst}
              onChange={e=>setDjDst(e.target.value)} required />
            <button className="px-3 py-1 rounded bg-indigo-600 text-white">Dijkstra</button>
          </form>
          {djResult && (
            <div className="mt-3">
              <div><b>path:</b> {djResult.path.join(" → ")}</div>
              <div><b>distance:</b> {djResult.distance}</div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
