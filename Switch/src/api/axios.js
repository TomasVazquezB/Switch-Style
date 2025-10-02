// src/api/axios.js
import axios from "axios";
import { obtenerToken } from "./auth";

// 🔹 Instancia principal de Axios
const api = axios.create({
  baseURL: "https://switchstyle.laravel.cloud/api", 
  withCredentials: true, // necesario para cookies de Sanctum
  headers: {
    "X-Requested-With": "XMLHttpRequest", // Laravel espera esto en AJAX
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 🔹 Función helper para pedir CSRF de Sanctum
export const csrf = async () => {
  try {
    await api.get("/sanctum/csrf-cookie"); // usa misma instancia
  } catch (error) {
    console.error("Error al obtener CSRF:", error);
    throw error;
  }
};

// 🔹 Interceptor de request para agregar token JWT si existe
api.interceptors.request.use(
  (config) => {
    const token = obtenerToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Interceptor de response para manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // error de red o CORS
      console.error("Network error o CORS:", error);
    } else {
      console.error(
        `HTTP ${error.response.status}:`,
        error.response.data || error.message
      );
    }
    return Promise.reject(error);
  }
);

export default api;
