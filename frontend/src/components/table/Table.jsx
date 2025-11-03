export default function Table({ columns, rows, keyField }) {
    return (
        <div style={{ overflowX: "auto" }}>
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((c) => (
                            <th key={c.key}>{c.header}</th>
            ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={r[keyField]}>
                            {columns.map((c) => (
                                <td key={c.key}>{typeof c.render === "function" ? c.render(r) : r[c.key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}