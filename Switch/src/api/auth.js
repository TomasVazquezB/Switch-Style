export const guardarUsuario = (usuario, token) => {
  localStorage.setItem('usuario', JSON.stringify(usuario));
  localStorage.setItem('token', token);
};

export const obtenerUsuario = () => {
  const data = localStorage.getItem('usuario');
  return data ? JSON.parse(data) : null;
};

export const obtenerToken = () => {
  return localStorage.getItem('token');
};

export const cerrarSesion = () => {
  localStorage.removeItem('usuario');
  localStorage.removeItem('token'); 
};

export const estaAutenticado = () => {
  return !!localStorage.getItem('usuario') && !!localStorage.getItem('token');
};