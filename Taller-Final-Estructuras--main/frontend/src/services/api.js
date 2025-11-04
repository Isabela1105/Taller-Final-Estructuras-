// src/services/api.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

//  Función para incluir el token automáticamente
function authHeaders() {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// Función general para hacer peticiones
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

  try {
    return await res.json();
  } catch {
    return {};
  }
}

//  --- AUTH ---
export const auth = {
  // Registrar usuario
  register: (username, password) =>
    apiFetch("/auth/register", { method: "POST", body: { username, password } }),

  // Iniciar sesión y guardar token
  login: async (username, password) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: { username, password },
    });
    localStorage.setItem("token", data.access_token);
    return data;
  },

  // Obtener usuario autenticado
  me: () => apiFetch("/auth/me"),
};

// --- API general ---
export const api = {
  me: () => apiFetch("/auth/me"),

  // --- Nodos ---
  listNodes: () => apiFetch("/graph/nodes"),
  createNode: (name) => apiFetch("/graph/nodes", { method: "POST", body: { name } }),
  deleteNode: (id) => apiFetch(`/graph/nodes/${id}`, { method: "DELETE" }),

  // --- Aristas ---
  listEdges: () => apiFetch("/graph/edges"),
  createEdge: (src_id, dst_id, weight) =>
    apiFetch("/graph/edges", { method: "POST", body: { src_id, dst_id, weight: Number(weight) } }),
  deleteEdge: (id) => apiFetch(`/graph/edges/${id}`, { method: "DELETE" }),

  // --- Algoritmos ---
  bfs: (start_id) => apiFetch(`/graph/bfs?start_id=${encodeURIComponent(start_id)}`),
  dijkstra: (src_id, dst_id) =>
    apiFetch(
      `/graph/shortest-path?src_id=${encodeURIComponent(src_id)}&dst_id=${encodeURIComponent(dst_id)}`
    ),
};
