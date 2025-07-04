export const guardarUsuario = (usuario) => {
  localStorage.setItem('usuario', JSON.stringify(usuario));
};

export const obtenerUsuario = () => {
  const data = localStorage.getItem('usuario');
  return data ? JSON.parse(data) : null;
};

export const cerrarSesion = () => {
  localStorage.removeItem('usuario');
  localStorage.removeItem('token'); // por si lo usás luego
};

export const estaAutenticado = () => {
  return localStorage.getItem('usuario') !== null;
};
