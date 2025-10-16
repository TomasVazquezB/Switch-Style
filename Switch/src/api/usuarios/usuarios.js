import api from '../axios.js';

export const registrarUsuario = async (data) => {
    try {
        await api.get('/sanctum/csrf-cookie');

        const response = await api.post('/api/register', {nombre: data.nombre,apellido: data.apellido,correo: data.email,password: data.contrasena,tipo_usuario: 'Free',});

        return response.data; 
    } catch (error) {
        console.error('Error registrando usuario:', error);
        throw error.response?.data || { message: 'Error al registrar usuario' };
    }
};