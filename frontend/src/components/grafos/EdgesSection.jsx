import { useEffect, useState } from "react";
import { apiFetch } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import SectionCard from "../ui/SectionCard.jsx";
import ErrorBanner from "../ui/ErrorBanner.jsx";
import Input from "../ui/Input.jsx";
import Table from "../table/Table.jsx";


export default function EdgesSection() {
const { token } = useAuth();
const [rows, setRows] = useState([]);
const [id, setId] = useState("");
const [src, setSrc] = useState("");
const [dst, setDst] = useState("");
const [weight, setWeight] = useState(1);
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);


const load = async () => {
try {
setError(null);
const data = await apiFetch("/edges", { token });
setRows(data || []);
} catch (e) { setError(e.message); }
};


useEffect(() => { load(); /* eslint-disable-next-line */ }, []);


const onCreate = async (e) => {
e.preventDefault();
setLoading(true); setError(null);
try {
await apiFetch("/edges", { method: "POST", token, body: { id, src_id: src, dst_id: dst, weight: Number(weight) } });
setId(""); setSrc(""); setDst(""); setWeight(1);
await load();
} catch (e) { setError(e.message); }
finally { setLoading(false); }
};


const onDelete = async (edgeId) => {
try {
await apiFetch(`/edges/${encodeURIComponent(edgeId)}`, { method: "DELETE", token });
await load();
} catch (e) { setError(e.message); }
};


return (
<SectionCard title="Aristas">
<ErrorBanner error={error} onClose={() => setError(null)} />
<form onSubmit={onCreate} className="row row-5" style={{ marginBottom: 12 }}>
<Input label="ID" value={id} onChange={setId} required />
<Input label="Origen (src_id)" value={src} onChange={setSrc} required />
<Input label="Destino (dst_id)" value={dst} onChange={setDst} required />
<Input label="Peso (weight)" type="number" value={weight} onChange={setWeight} required />
<div style={{ display: "flex", alignItems: "end" }}>
<button className="btn" disabled={loading}>{loading ? "Creando…" : "Crear"}</button>
</div>
</form>
<Table
keyField="id"
columns={[
{ key: "id", header: "ID" },
{ key: "src_id", header: "Origen" },
{ key: "dst_id", header: "Destino" },
{ key: "weight", header: "Peso" },
{ key: "actions", header: "Acciones", render: (r) => (
<button className="btn" onClick={() => onDelete(r.id)}>Eliminar</button>
)},
]}
rows={rows}
/>
</SectionCard>
);
}
