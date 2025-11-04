// src/routes/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../services/api";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking"); // checking | ok | noauth

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setStatus("noauth"); return; }

    let mounted = true;
    api.me()
      .then(() => mounted && setStatus("ok"))
      .catch(() => mounted && setStatus("noauth"));
    return () => { mounted = false; };
  }, []);

  if (status === "checking") return <div style={{padding:24}}>Cargando…</div>;
  if (status === "noauth") return <Navigate to="/login" replace />;

  return children;
}
