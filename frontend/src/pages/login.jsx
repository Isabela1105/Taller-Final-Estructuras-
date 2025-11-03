import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { Link } from "react-router-dom"; 

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Llamada al backend FastAPI → POST /auth/login
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: { username, password },
      });

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        navigate("/"); // Redirige al home protegido
      } else {
        setError("Respuesta inesperada del servidor");
      }
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-400">
      <div className="bg-emerald-300 p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold"
            >
              Cerrar
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Entrar
          </button>
            <p className="text-center mt-4">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-emerald-800 underline">
                Crear cuenta
            </Link>
            </p>

        </form>
      </div>
    </div>

  );
}
