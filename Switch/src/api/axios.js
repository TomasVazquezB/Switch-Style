// src/api/axios.js
import axios from "axios";
import { obtenerToken } from "./auth";

// ✅ Instancia global de Axios
const api = axios.create({
  // ⚙️ Usamos el proxy configurado en vite.config.js
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // 🔑 Envía cookies (XSRF-TOKEN, sesión, etc.)
});

// ✅ Helper: obtener cookie por nombre
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

// ✅ Helper: obtener cookie CSRF de Sanctum
export const csrf = async () => {
  try {
    await axios.get("https://switchstyle.laravel.cloud/sanctum/csrf-cookie", {
      withCredentials: true,
    });
    console.log("✅ CSRF cookie obtenida correctamente");
  } catch (error) {
    console.error("❌ Error al obtener CSRF cookie:", error);
    throw error;
  }
};

// ✅ Interceptor para agregar automáticamente CSRF y JWT
api.interceptors.request.use(
  (config) => {
    const xsrfToken = getCookie("XSRF-TOKEN");
    if (xsrfToken) {
      config.headers["X-XSRF-TOKEN"] = xsrfToken;
    }

    const token = obtenerToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Interceptor de respuesta con logs claros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("❌ Error de red o CORS:", error);
    } else {
      console.error(
        `⚠️ HTTP ${error.response.status}:`,
        error.response.data || error.message
      );
    }
    return Promise.reject(error);
  }
);

export default api;