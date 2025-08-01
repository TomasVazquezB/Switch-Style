import api from '../../api/axios.js';

export const registrarUsuario = async (data) => {
    await api.get('/sanctum/csrf-cookie');

    const response = await api.post('/api/register', {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.email,
        password: data.contrasena,
        tipo: 'Free', 
    });

    return response.data;
};
