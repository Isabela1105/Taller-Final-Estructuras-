import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/api"; // ✅ usamos el objeto auth

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await auth.register(username, password); // ✅ usa la función del api.js
      navigate("/login"); // redirige al login al terminar
    } catch (err) {
      setError(err.message || "Error al registrar.");
    }
  };

  return (
    <div style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
      <form onSubmit={handleSubmit} style={{ width: 320 }}>
        <h2>Crear cuenta</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <label>Usuario</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registrarme</button>
      </form>
    </div>
  );
}
