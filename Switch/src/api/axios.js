import axios from 'axios';
import { obtenerUsuario } from './auth';

const api = axios.create({
  baseURL: 'https://switchstyle.laravel.cloud', // sin /api porque lo pondrás en la ruta
  withCredentials: true, // necesario para Sanctum y cookies
});

// Interceptor para incluir token JWT si existe (opcional)
api.interceptors.request.use(
  (config) => {
    const usuario = obtenerUsuario();
    if (usuario?.token) {
      config.headers.Authorization = `Bearer ${usuario.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
