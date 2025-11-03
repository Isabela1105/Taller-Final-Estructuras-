// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Lee token siempre del localStorage (no pasarlo manualmente)
function authHeaders() {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function apiFetch(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    // redirige a login
    if (window.location.pathname !== "/login") window.location.href = "/login";
    throw new Error("No autorizado");
  }

  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const j = await res.json();
      if (j?.detail) msg = typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail);
      if (j?.message) msg = j.message;
    } catch {}
    throw new Error(msg);
  }

  // algunos 204 no tienen body
  try { return await res.json(); } catch { return {}; }
}

export const api = {
  me: () => apiFetch("/auth/me"),
  // Nodos
  listNodes: () => apiFetch("/graph/nodes"),
  createNode: (name) => apiFetch("/graph/nodes", { method: "POST", body: { name } }),
  deleteNode: (id) => apiFetch(`/graph/nodes/${id}`, { method: "DELETE" }),
  // Aristas
  listEdges: () => apiFetch("/graph/edges"),
  createEdge: (src_id, dst_id, weight) =>
    apiFetch("/graph/edges", { method: "POST", body: { src_id, dst_id, weight: Number(weight) } }),
  deleteEdge: (id) => apiFetch(`/graph/edges/${id}`, { method: "DELETE" }),
  // Algoritmos
  bfs: (start_id) => apiFetch(`/graph/bfs?start_id=${encodeURIComponent(start_id)}`),
  dijkstra: (src_id, dst_id) =>
    apiFetch(`/graph/shortest-path?src_id=${encodeURIComponent(src_id)}&dst_id=${encodeURIComponent(dst_id)}`),
};
