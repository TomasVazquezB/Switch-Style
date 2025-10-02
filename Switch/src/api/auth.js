// src/api/auth.js
import api, { csrf } from "./axios";

// 🔹 Guardar usuario y token en localStorage
export const guardarUsuario = (usuario, token) => {
  localStorage.setItem("usuario", JSON.stringify(usuario));
  if (token) localStorage.setItem("token", token);
};

// 🔹 Obtener usuario desde localStorage
export const obtenerUsuario = () => {
  const data = localStorage.getItem("usuario");
  return data ? JSON.parse(data) : null;
};

// 🔹 Obtener token desde localStorage
export const obtenerToken = () => localStorage.getItem("token");

// 🔹 Verifica si hay usuario y token
export const estaAutenticado = () => Boolean(obtenerUsuario() && obtenerToken());

// 🔹 Cerrar sesión
export const cerrarSesion = async () => {
  try {
    // Si usás Sanctum, pedimos CSRF antes de logout
    await csrf();
    await api.post("/api/logout"); // opcional si tu backend tiene endpoint de logout
  } catch (e) {
    console.warn("Error cerrando sesión en el backend", e);
  } finally {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  }
};

// 🔹 Login
export const login = async (email, password) => {
  try {
    // Pedir CSRF primero si usás Sanctum
    await csrf();

    const res = await api.post("/api/login", { email, password });

    // Guardar usuario y token (si tu backend devuelve token)
    const usuario = res.data.usuario || res.data.user || null;
    const token = res.data.token || null;

    guardarUsuario(usuario, token);

    return usuario;
  } catch (error) {
    throw error;
  }
};

// 🔹 Registro
export const register = async (datos) => {
  try {
    await csrf();

    const res = await api.post("/api/register", datos);

    const usuario = res.data.usuario || res.data.user || null;
    const token = res.data.token || null;

    guardarUsuario(usuario, token);

    return usuario;
  } catch (error) {
    throw error;
  }
};
