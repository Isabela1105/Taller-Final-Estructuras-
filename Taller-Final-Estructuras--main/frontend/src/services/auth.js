import axios from "axios";

const API_URL = "http://127.0.0.1:8000/auth";

// Iniciar sesión
export async function login(username, password) {
  const response = await axios.post(`${API_URL}/login`, {
    username,
    password,
  });

  const { access_token } = response.data;
  localStorage.setItem("token", access_token);
  return access_token;
}

// Registrar usuario
export async function register(username, password) {
  return axios.post(`${API_URL}/register`, { username, password });
}

// Obtener usuario autenticado
export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token");

  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
