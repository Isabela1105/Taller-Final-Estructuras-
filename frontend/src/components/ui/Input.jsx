export default function Input({ label, type = "text", value, onChange, placeholder, required, className }) {
return (
    <label className={className}>
        <span className="label">{label}</span>
        <input
            className="input"
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
        />
    </label>
);
}