import api from '../../api/axios.js';

export const registrarUsuario = async (formData) => {
  const response = await api.post('/api/register', {
    name: formData.nombre,
    apellido: formData.apellido,
    email: formData.email,
    username: formData.usuario,
    password: formData.contrasena,
    password_confirmation: formData.contrasena,
  });

  return response.data.user;
};
