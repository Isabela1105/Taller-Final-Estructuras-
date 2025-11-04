import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import SectionCard from "../ui/SectionCard.jsx";
import ErrorBanner from "../ui/ErrorBanner.jsx";
import Input from "../ui/Input.jsx";
import Table from "../table/Table.jsx";


export default function NodesSection() {
const { token } = useAuth();
const [rows, setRows] = useState([]);
const [id, setId] = useState("");
const [label, setLabel] = useState("");
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);


const load = async () => {
try {
setError(null);
const data = await apiFetch("/nodes", { token });
setRows(data || []);
} catch (e) { setError(e.message); }
};


useEffect(() => { load(); /* eslint-disable-next-line */ }, []);


const onCreate = async (e) => {
e.preventDefault();
setLoading(true); setError(null);
try {
await apiFetch("/nodes", { method: "POST", token, body: { id, label } });
setId(""); setLabel("");
await load();
} catch (e) { setError(e.message); }
finally { setLoading(false); }
};


const onDelete = async (nodeId) => {
try {
await apiFetch(`/nodes/${encodeURIComponent(nodeId)}`, { method: "DELETE", token });
await load();
} catch (e) { setError(e.message); }
};


return (
<SectionCard title="Nodos">
<ErrorBanner error={error} onClose={() => setError(null)} />
<form onSubmit={onCreate} className="row row-3" style={{ marginBottom: 12 }}>
<Input label="ID" value={id} onChange={setId} required />
<Input label="Etiqueta" value={label} onChange={setLabel} required />
<div style={{ display: "flex", alignItems: "end" }}>
<button className="btn" disabled={loading}>{loading ? "Creando…" : "Crear"}</button>
</div>
</form>
<Table
keyField="id"
columns={[
{ key: "id", header: "ID" },
{ key: "label", header: "Etiqueta" },
{ key: "actions", header: "Acciones", render: (r) => (
<button className="btn" onClick={() => onDelete(r.id)}>Eliminar</button>
)},
]}
rows={rows}
/>
</SectionCard>
);
}