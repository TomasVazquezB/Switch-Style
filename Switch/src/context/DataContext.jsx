import React, { createContext, useState, useEffect } from "react";
import { backendApi, publicApi } from "../api/axios";
import { guardarUsuario, obtenerUsuario, cerrarSesion } from "../api/auth";

export const DataContext = createContext();

const normalizarUsuario = (user, token = null) => {
  if (!user) return null;

  return {
    id: user.id,
    nombre: user.nombre || user.name || user.Nombre || "Usuario",
    correo: user.email || user.correo,
    rol: user.rol || user.role || "Usuario",
    token: token ?? user.token ?? null,
  };
};

export const DataProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [usuario, setUsuario] = useState(normalizarUsuario(obtenerUsuario()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --------------------------
  // LOGIN
  // --------------------------
  const login = async (email, password) => {
    try {
      const response = await backendApi.post("/login", { email, password });
      const { user, token } = response.data;

      const usuarioNormalizado = {
        id: user.id,
        nombre: user.nombre || user.name || "Usuario",
        correo: user.email || user.correo,
        rol: user.rol || user.role || "Usuario",
        token: token,
      };


      guardarUsuario(usuarioNormalizado);
      setUsuario(usuarioNormalizado);
      setError(null);
      return true;

    } catch (err) {
      console.error("❌ Error en login:", err);
      setError("Credenciales inválidas o error de conexión");
      return false;
    }
  };

  // --------------------------
  // LOGOUT
  // --------------------------
  const logout = async () => {
    try {
      await backendApi.post("/logout");
    } catch (err) {
      console.error("❌ Error en logout:", err);
    } finally {
      cerrarSesion();
      setUsuario(null);
    }
  };

  // --------------------------
  // OBTENER USUARIO DEL BACKEND
  // --------------------------
  const fetchUsuario = async () => {
    try {
      const { data } = await backendApi.get("/usuario");
      const usuarioNormalizado = normalizarUsuario(data, obtenerUsuario()?.token);
      setUsuario(usuarioNormalizado);
      guardarUsuario(usuarioNormalizado);
    } catch (err) {
      console.error("❌ Error al obtener usuario:", err);
    }
  };



  // --------------------------
  // PRODUCTOS
  // --------------------------
  const fetchProductos = async () => {
    try {
      const [ropaRes, accesoriosRes] = await Promise.all([
        publicApi.get("/ropa"),
        publicApi.get("/accesorios"),
      ]);

      const ropaData = Array.isArray(ropaRes.data) ? ropaRes.data : [];
      const accesoriosData = Array.isArray(accesoriosRes.data) ? accesoriosRes.data : [];

      const ropaNormalizada = ropaData.map((producto) => ({
        ...producto,
        imagen_url: producto.Imagen ? `https://switchstyle.laravel.cloud/storage/${producto.Imagen}` : null,
        titulo: producto.Titulo || producto.titulo || "",
        tipo: producto.Tipo || producto.tipo || "",
        descripcion: producto.Descripcion || producto.descripcion || "",
        categoria: "Ropa",
        tipoProducto: "ropa",
      }));

      const accesoriosNormalizados = accesoriosData.map((producto) => ({
        ...producto,
        imagen_url: producto.ruta_imagen ? `https://switchstyle.laravel.cloud/storage/${producto.ruta_imagen}` : null,
        titulo: producto.titulo || producto.Titulo || "",
        tipo: "Accesorio",
        descripcion: producto.descripcion || producto.Descripcion || "",
        categoria: "Accesorios",
        tipoProducto: "accesorio",
      }));

      setProductos([...ropaNormalizada, ...accesoriosNormalizados]);

    } catch (err) {
      console.error("❌ Error al obtener productos:", err);
      setError("Error al obtener productos");
    }
  };

  // --------------------------
  // INIT
  // --------------------------
  useEffect(() => {
    fetchProductos();
    const tokenGuardado = obtenerUsuario()?.token;
    if (tokenGuardado) fetchUsuario();
  }, []);

  return (
    <DataContext.Provider
      value={{
        productos,
        usuario,
        setUsuario,
        loading,
        error,
        login,
        logout,
        fetchProductos,
        fetchUsuario,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
