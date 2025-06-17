import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/producto');
      setProductos(response.data);
    } catch (err) {
      setError('Hubo un error al obtener los productos');
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3001/usuario'); 
      setUsuarios(response.data);
    } catch (err) {
      setError('Hubo un error al obtener los usuarios');
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