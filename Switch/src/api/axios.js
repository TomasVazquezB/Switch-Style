import axios from "axios";
import { obtenerToken } from "./auth";

const api = axios.create({
  baseURL: "/api",
  headers: {"Content-Type": "application/json",Accept: "application/json",},
  withCredentials: true, 
});

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

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

api.interceptors.request.use(
  (config) => {
    const xsrfToken = getCookie("XSRF-TOKEN");
    if (xsrfToken) {config.headers["X-XSRF-TOKEN"] = xsrfToken;
    }

    const token = obtenerToken?.();
    if (token) {config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {console.error("❌ Error de red o CORS:", error);
    } else {
      console.error(`⚠️ HTTP ${error.response.status}:`, error.response.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;