export default function ErrorBanner({ error, onClose }) {
    if (!error) return null;
    return(
    <div className="card" style={{ borderColor: "#fecaca", background: "#fef2f2" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", color: "#991b1b" }}>{String(error)}</pre>
            <button className="btn" style={{ background: "#ef4444" }} onClick={onClose}>Cerrar</button>
        </div>
    </div>
    );
}