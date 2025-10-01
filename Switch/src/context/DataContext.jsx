// src/context/DataContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios"; // <- usa tu axios con baseURL configurada

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Traer productos
  const fetchProductos = async () => {
    try {
      const response = await api.get("/ropa"); // <- no pongas /api de nuevo
      setProductos(response.data);
    } catch (err) {
      setError("Hubo un error al obtener los productos");
      console.error(err);
    }
  };

  // 🔹 Traer usuarios
  const fetchUsuarios = async () => {
    try {
      const response = await api.get("/usuario");
      setUsuarios(response.data);
    } catch (err) {
      setError("Hubo un error al obtener los usuarios");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchProductos();
      await fetchUsuarios();
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ productos, usuarios, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };