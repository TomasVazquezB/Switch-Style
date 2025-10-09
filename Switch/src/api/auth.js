// src/api/auth.js
import api from "./axios";

// 🔹 Guardar usuario y token en localStorage
export const guardarUsuario = (usuario, token) => {
  if (usuario) localStorage.setItem("usuario", JSON.stringify(usuario));
  if (token) localStorage.setItem("token", token);
};

// 🔹 Obtener usuario desde localStorage
export const obtenerUsuario = () => {
  const data = localStorage.getItem("usuario");
  return data ? JSON.parse(data) : null;
};

// 🔹 Obtener token desde localStorage
export const obtenerToken = () => localStorage.getItem("token");

// 🔹 Verificar si hay sesión activa
export const estaAutenticado = () =>
  Boolean(obtenerUsuario() && obtenerToken());

// 🔹 Cerrar sesión
export const cerrarSesion = async () => {
  try {
    // Llamamos al endpoint de logout si existe
    await api.post("/logout");
  } catch (error) {
    console.warn("Error cerrando sesión:", error.response?.data || error);
  } finally {
    // Eliminamos datos locales
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  }
};

// 🔹 Login de usuario
export const login = async (correo, password) => {
  try {
    // Enviamos las credenciales al backend
    const res = await api.post("/login", {
      correo,       // 👈 usa el mismo campo que tu backend espera
      password,     // 👈 asegúrate de que sea 'password' (no 'contraseña')
    });

    // Obtenemos el token y los datos de usuario del backend
    const usuario = res.data.user || res.data.usuario || null;
    const token = res.data.token || null;

    // Guardamos en localStorage
    guardarUsuario(usuario, token);

    return usuario;
  } catch (error) {
    console.error("Error en login:", error.response?.data || error);
    throw error;
  }
};

// 🔹 Registro de usuario
export const register = async (datos) => {
  try {
    const res = await api.post("/register", datos);

    const usuario = res.data.user || res.data.usuario || null;
    const token = res.data.token || null;

    guardarUsuario(usuario, token);

    return usuario;
  } catch (error) {
    console.error("Error en registro:", error.response?.data || error);
    throw error;
  }
};