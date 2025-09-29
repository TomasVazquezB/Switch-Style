import api from '../axios.js';

export const registrarUsuario = async (data) => {
    try {
        // Primero obtenemos la cookie de CSRF de Sanctum
        await api.get('/sanctum/csrf-cookie');

        // Luego hacemos POST a /register
        const response = await api.post('/api/register', {
            nombre: data.nombre,
            apellido: data.apellido,
            correo: data.email,
            password: data.contrasena,
            tipo_usuario: 'Free', // Por defecto
        });

        return response.data; // Espera que tu backend devuelva el usuario registrado
    } catch (error) {
        console.error('Error registrando usuario:', error);
        throw error.response?.data || { message: 'Error al registrar usuario' };
    }
};
