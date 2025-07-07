import api from './axios';

export const getUsuarioAutenticado = async () => {
    try {
        // Paso 1: obtener cookie CSRF
        await api.get('/sanctum/csrf-cookie', {
            withCredentials: true // ✅ importante
        });

        // Paso 2: llamar al endpoint protegido con cookies
        const response = await api.get('/api/user', {
            withCredentials: true // ✅ obligatorio para enviar cookies de sesión
        });

        return response.data;
    } catch (error) {
        console.error('Error al obtener usuario autenticado:', error);
        return null;
    }
};
