// src/api/auth.js

// Guardar usuario y token
export const guardarUsuario = (usuario, token) => {
  localStorage.setItem('usuario', JSON.stringify(usuario));
  if (token) localStorage.setItem('token', token);
};

// Obtener usuario
export const obtenerUsuario = () => {
  const data = localStorage.getItem('usuario');
  return data ? JSON.parse(data) : null;
};

// Obtener token
export const obtenerToken = () => localStorage.getItem('token');

// Cerrar sesión
export const cerrarSesion = () => {
  localStorage.removeItem('usuario');
  localStorage.removeItem('token');
};

// Verifica si está autenticado
export const estaAutenticado = () => Boolean(obtenerUsuario() && obtenerToken());
