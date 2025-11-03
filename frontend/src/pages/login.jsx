import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { apiFetch } from "../services/api.js";
import SectionCard from "../components/ui/SectionCard.jsx";
import Input from "../components/ui/Input.jsx";
import ErrorBanner from "../components/ui/ErrorBanner.jsx";


export default function Login() {
const { token, login } = useAuth();
const navigate = useNavigate();
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);


useEffect(() => { if (token) navigate("/"); }, [token, navigate]);


const onSubmit = async (e) => {
e.preventDefault();
setError(null); setLoading(true);
try {
const res = await apiFetch("/login", { method: "POST", body: { username, password } });
if (res?.token) { login(res.token); navigate("/"); }
else { throw new Error("Respuesta de login inválida: falta 'token'."); }
} catch (err) { setError(err.message || "Error de autenticación"); }
finally { setLoading(false); }
};


return (
<div className="container" style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
<div style={{ width: 400, maxWidth: "100%" }}>
<SectionCard title="Iniciar sesión">
<ErrorBanner error={error} onClose={() => setError(null)} />
<form onSubmit={onSubmit} className="row" style={{ gap: 14 }}>
<Input label="Usuario" value={username} onChange={setUsername} required placeholder="tu_usuario" />
<Input label="Contraseña" type="password" value={password} onChange={setPassword} required placeholder="••••••••" />
<button className="btn" disabled={loading}>{loading ? "Ingresando…" : "Entrar"}</button>
</form>
</SectionCard>
</div>
</div>
);
}

