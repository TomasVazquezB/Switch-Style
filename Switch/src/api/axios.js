import axios from "axios";
import { obtenerToken } from "./auth";

export const BASE_URL = "https://switchstyle.laravel.cloud/api";
export const ROOT_URL = "https://switchstyle.laravel.cloud";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';')[0]);
  return null;
}

export const csrf = async () => {
  await axios.get(`${ROOT_URL}/sanctum/csrf-cookie`, { withCredentials: true });
};

// 🔹 Instancia segura para endpoints protegidos (como /mis-pedidos)
export const secureApi = axios.create({
  baseURL: BASE_URL, // ✅ IMPORTANTE: apunta al backend, no al frontend
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Necesario para Sanctum
});

const api = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const xsrfToken = getCookie("XSRF-TOKEN");
    if (xsrfToken) config.headers["X-XSRF-TOKEN"] = xsrfToken;

    const token = obtenerToken?.();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

export const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  withCredentials: false, // tokens no necesitan cookies
});

export function setAuthToken(token) {
  if (token) {
    publicApi.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete publicApi.defaults.headers.Authorization;
  }
}

export default api;

// 🔹 Nueva instancia para endpoints del backend (como /user)
export const backendApi = axios.create({
  baseURL: `${ROOT_URL}/api`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

backendApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Copiamos los interceptores del api principal
secureApi.interceptors.request.use(
  (config) => {
    const xsrfToken = getCookie("XSRF-TOKEN");
    if (xsrfToken) config.headers["X-XSRF-TOKEN"] = xsrfToken;

    const token = obtenerToken?.();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);
