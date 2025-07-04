import api from '../../api/axios.js';

export const registrarUsuario = async (data) => {
    // 1. Obtener CSRF token antes del POST
    await api.get('/sanctum/csrf-cookie');

    // 2. Hacer el registro
    const response = await api.post('/api/register', {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.email,
        password: data.contrasena,
        tipo: 'Free', 
    });

    return response.data;
};
