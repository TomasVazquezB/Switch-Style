// src/api/axios.js
import axios from "axios";
import { obtenerToken } from "./auth"; // <- una sola vez

const api = axios.create({
  baseURL: "https://switchstyle.laravel.cloud/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // 🔑 clave para cookies de Sanctum
});

// 🔹 Función helper para pedir CSRF de Sanctum
export const csrf = async () => {
  try {
    await axios.get("https://switchstyle.laravel.cloud/sanctum/csrf-cookie", {
      withCredentials: true,
    });
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
      console.log("Enviando token:", token);
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