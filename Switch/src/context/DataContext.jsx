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

  // 🔹 Inicializar CSRF para todas las llamadas
  const initCsrf = async () => {
    try {
      await csrf();
    } catch (err) {
      console.error("Error al obtener CSRF:", err);
      setError("No se pudo inicializar CSRF");
    }
  };

  // 🔹 Login
  const login = async (email, password) => {
    try {
      await initCsrf();
      const response = await api.post("/login", { email, password });
      const { user } = response.data;
      guardarUsuario(user); // guarda en localStorage
      setUsuario(user);
      setError(null);
      return true;
    } catch (err) {
      console.error("Error en login:", err);
      setError("Credenciales inválidas o error de conexión");
      return false;
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Error en logout:", err);
    } finally {
      cerrarSesion();
      setUsuario(null);
    }
  };

  // 🔹 Obtener productos
  const fetchProductos = async (darkMode = false) => {
    try {
      const response = await api.get("/ropa");
      const productosConImagen = response.data.map((producto) => {
        let imagenNormal = `https://switchstyle.laravel.cloud/storage/${producto.Imagen}`;
        if (producto.ImagenNocturna && darkMode) {
          imagenNormal = `https://switchstyle.laravel.cloud/storage/${producto.ImagenNocturna}`;
        }
        return { ...producto, imagen_url: imagenNormal };
      });
      setProductos(productosConImagen);
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setError("Error al obtener productos");
    }
  };

  // 🔹 Obtener usuarios (protegido)
  const fetchUsuarios = async () => {
    try {
      await initCsrf(); // 🔹 Asegurarse de CSRF antes de llamar a endpoint protegido
      const response = await api.get("/usuario");
      setUsuarios(response.data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("Error al obtener usuarios");
    }
  };

  const ropa = productos.filter((p) => p.Tipo === "Ropa");
  const accesorios = productos.filter((p) => p.Tipo === "Accesorios");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchProductos();
      if (usuario) await fetchUsuarios(); // 🔹 Solo si hay sesión
      setLoading(false);
    };
    fetchData();
  }, [usuario]); // 🔹 Dependencia de usuario

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
