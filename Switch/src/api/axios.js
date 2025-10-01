// src/api/axios.js
import axios from "axios";
import { obtenerToken } from "./auth";

const api = axios.create({
  baseURL: "https://switchstyle.laravel.cloud/api", // Tu dominio y prefijo de API
  withCredentials: true, // Para cookies de Sanctum
  headers: {
    "X-Requested-With": "XMLHttpRequest", // Laravel lo espera en AJAX
  },
});

// Endpoint para obtener CSRF (Sanctum)
export const csrf = () =>
  axios.get("https://switchstyle.laravel.cloud/sanctum/csrf-cookie", {
    withCredentials: true,
  });

// Interceptor para agregar token en headers
api.interceptors.request.use(
  (config) => {
    const token = obtenerToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;