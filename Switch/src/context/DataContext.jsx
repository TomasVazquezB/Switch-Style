import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchProductos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/ropa`);
      setProductos(response.data);
    } catch (err) {
      setError('Hubo un error al obtener los productos');
      console.error(err);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/usuario`);
      setUsuarios(response.data);
    } catch (err) {
      setError('Hubo un error al obtener los usuarios');
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
    <DataContext.Provider value={{ productos, usuarios, loading, error }}>{children}</DataContext.Provider>
  );
};

export { DataContext, DataProvider };