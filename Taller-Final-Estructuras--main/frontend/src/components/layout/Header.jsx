import { useAuth } from "../../context/AuthContext.jsx";


export default function Header() {
const { token, logout } = useAuth();
return (
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
<h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Home (Protegida)</h1>
<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
{token && <span className="badge">token: {token.slice(0, 10)}…</span>}
<button className="btn" onClick={logout}>Salir</button>
</div>
</div>
);
}