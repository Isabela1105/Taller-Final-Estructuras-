export default function SectionCard({ title, right, children }) {
    return (
        <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{title}</h2>
                {right}
            </div>
            {children}
        </div>
);
}