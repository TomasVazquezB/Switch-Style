import axios from "axios";
import { obtenerToken } from "./auth";

const BASE_URL = import.meta.env.VITE_API_URL || "https://switchstyle.laravel.cloud/api";
const ROOT_URL = BASE_URL.replace(/\/api$/, ""); // 🔹 Quita el /api del final

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // ✅ Necesario para cookies CSRF y sesiones
});

// 🧠 Helper para leer cookies
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

// ✅ CORREGIDO: Llama al endpoint correcto (sin /api)
export const csrf = async () => {
  try {
    await axios.get(`${ROOT_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
    console.log("✅ CSRF cookie obtenida correctamente");
  } catch (error) {
    console.error("❌ Error al obtener CSRF cookie:", error);
    throw error;
  }
};

// 🔐 Interceptor para incluir token CSRF y Bearer
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("❌ Error de red o CORS:", error);
    } else {
      console.error(`⚠️ HTTP ${error.response.status}:`, error.response.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
