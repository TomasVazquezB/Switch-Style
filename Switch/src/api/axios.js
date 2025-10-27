import axios from "axios";
import { obtenerToken } from "./auth";

export const BASE_URL = "https://switchstyle.laravel.cloud/api";
export const ROOT_URL = "https://switchstyle.laravel.cloud";

// --- API protegida (login, usuarios, etc.) ---
const api = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// --- API pública (productos, imágenes, etc.) ---
export const publicApi = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export const csrf = async () => {
  await axios.get(`${ROOT_URL}/sanctum/csrf-cookie`, { withCredentials: true });
};

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

export default api;
