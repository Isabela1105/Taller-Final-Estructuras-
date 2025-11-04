// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import Login from "./pages/login.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/register.jsx"; 

export default function App() {
  // Regla: si ya hay token y el usuario visita /login o /register,
  // lo mandamos al Home para evitar re-login innecesario.
  const token = localStorage.getItem("token");

  return (
    <AuthProvider>
      <Routes>
        {/* Públicas */}
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={token ? <Navigate to="/" replace /> : <Register />}
        />

        {/* Protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={<Navigate to={token ? "/" : "/login"} replace />}
        />
      </Routes>
    </AuthProvider>
  );
}


