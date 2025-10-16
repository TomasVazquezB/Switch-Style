import React, { createContext, useState, useEffect } from "react";
import api, { csrf } from "../api/axios";
import { guardarUsuario, obtenerUsuario, cerrarSesion } from "../api/auth";

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuario, setUsuario] = useState(obtenerUsuario());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initCsrf = async () => {
    try {
      await csrf();
    } catch (err) {
      console.error("❌ Error al obtener CSRF:", err);
      setError("No se pudo inicializar CSRF");
    }
  };

  const login = async (email, password) => {
    try {
      await initCsrf();
      const response = await api.post("/login", { email, password });
      const { user } = response.data;
      guardarUsuario(user);
      setUsuario(user);
      setError(null);
      return true;
    } catch (err) {
      console.error("❌ Error en login:", err);
      setError("Credenciales inválidas o error de conexión");
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("❌ Error en logout:", err);
    } finally {
      cerrarSesion();
      setUsuario(null);
    }
  };

  const fetchProductos = async () => {
    try {
      const [ropaRes, accesoriosRes] = await Promise.all([
        api.get("/ropa"),
        api.get("/accesorios"),
      ]);

      const ropaData = Array.isArray(ropaRes.data) ? ropaRes.data : [];
      const accesoriosData = Array.isArray(accesoriosRes.data) ? accesoriosRes.data : [];

      const ropaNormalizada = ropaData.map((producto) => ({...producto, imagen_url: producto.Imagen ? `https://switchstyle.laravel.cloud/storage/${producto.Imagen}` : null, titulo: producto.Titulo || producto.titulo || "", tipo: producto.Tipo || producto.tipo || "", descripcion: producto.Descripcion || producto.descripcion || "", categoria: "Ropa", tipoProducto: "ropa",}));
      const accesoriosNormalizados = accesoriosData.map((producto) => ({...producto, imagen_url: producto.ruta_imagen ? `${api.defaults.baseURL}/storage/${producto.ruta_imagen}` : null,titulo: producto.titulo || producto.Titulo || "", tipo: "Accesorio", descripcion: producto.descripcion || producto.Descripcion || "", categoria: "Accesorios", tipoProducto: "accesorio",}));

      setProductos([...ropaNormalizada, ...accesoriosNormalizados]);
    } catch (err) {
      console.error("❌ Error al obtener productos:", err);
      setError("Error al obtener productos");
      setProductos([]);
    }
  };

  const fetchUsuarios = async () => {
    try {
      await initCsrf();
      const response = await api.get("/usuario");
      setUsuarios(response.data);
    } catch (err) {
      console.error("❌ Error al obtener usuarios:", err);
      setError("Error al obtener usuarios");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchProductos();
      if (usuario) await fetchUsuarios();
      setLoading(false);
    };
    fetchData();
  }, [usuario]);

  return (
    <DataContext.Provider value={{productos,usuarios,usuario,loading,error,login,logout,fetchProductos,fetchUsuarios,}}>{children}</DataContext.Provider>
  );
};

export { DataContext, DataProvider };
