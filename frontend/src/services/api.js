// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function apiFetch(path, { method = "GET", body, token, expectJson = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) {
    let errMsg = `Error ${res.status}`;
    try {
      const err = await res.json();
      if (err?.message) errMsg = err.message;
      if (err?.errors) errMsg = Array.isArray(err.errors) ? err.errors.join("\n") : JSON.stringify(err.errors);
    } catch (_) {}
    throw new Error(errMsg);
  }

  return expectJson ? res.json() : res.text();
}
