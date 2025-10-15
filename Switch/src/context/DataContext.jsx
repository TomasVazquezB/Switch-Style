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

  // 🔹 Inicializar CSRF
  const initCsrf = async () => {
    try {
      await csrf();
    } catch (err) {
      console.error("❌ Error al obtener CSRF:", err);
      setError("No se pudo inicializar CSRF");
    }
  };

  // 🔹 Login
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

  // 🔹 Logout
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

  // 🔹 Obtener productos (una sola versión)
  const fetchProductos = async () => {
    try {
      const response = await api.get("/ropa");
      if (!Array.isArray(response.data)) {
        console.warn("⚠️ Respuesta inesperada de /ropa:", response.data);
        setProductos([]);
        return;
      }

      const productosConImagen = response.data.map((producto) => ({
        ...producto,
        imagen_url: `https://switchstyle.laravel.cloud/storage/${producto.Imagen}`,
        titulo: producto.Titulo || producto.titulo || "",
        tipo: producto.Tipo || producto.tipo || "",
        descripcion: producto.Descripcion || producto.descripcion || "",
      }));

      setProductos(productosConImagen);
    } catch (err) {
      console.error("❌ Error al obtener productos:", err);
      setError("Error al obtener productos");
    }
  };

  // 🔹 Obtener usuarios (solo si hay sesión)
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

  const ropa = productos.filter((p) => p.tipo === "Ropa" || p.Tipo === "Ropa");
  const accesorios = productos.filter((p) => p.tipo === "Accesorios" || p.Tipo === "Accesorios");

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
    <DataContext.Provider
      value={{
        productos,
        ropa,
        accesorios,
        usuarios,
        usuario,
        loading,
        error,
        login,
        logout,
        fetchProductos,
        fetchUsuarios,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };