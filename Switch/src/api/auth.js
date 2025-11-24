import api from "./axios";

// ==========================
// NORMALIZAR USUARIO
// ==========================
export const guardarUsuario = (usuario, token) => {
  if (usuario) {

    const usuarioNormalizado = {
      id: usuario.id,
      nombre: usuario.nombre || usuario.name || "Usuario",
      correo: usuario.correo || usuario.email || "",
      rol: usuario.rol || usuario.role || "Usuario",
      token: token || usuario.token || null,
    };

    localStorage.setItem("usuario", JSON.stringify(usuarioNormalizado));
  }

  if (token) localStorage.setItem("token", token);
};

export const obtenerUsuario = () => {
  const data = localStorage.getItem("usuario");
  return data ? JSON.parse(data) : null;
};

export const obtenerToken = () => localStorage.getItem("token");

export const estaAutenticado = () =>
  Boolean(obtenerUsuario() && obtenerToken());

export const cerrarSesion = async () => {
  try {
    await api.post("/logout");
  } catch (error) {
    console.warn("Error cerrando sesión:", error.response?.data || error);
  } finally {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  }
};

export const login = async (correo, password) => {
  try {
    const res = await api.post("/login", { correo, password });

    const usuario = res.data.user || res.data.usuario || null;
    const token = res.data.token || null;

    guardarUsuario(usuario, token);

    return usuario;
  } catch (error) {
    console.error("Error en login:", error.response?.data || error);
    throw error;
  }
};

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