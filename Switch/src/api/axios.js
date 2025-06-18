import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // NO uses 127.0.0.1 aquí
  withCredentials: true,
});

export default api;

