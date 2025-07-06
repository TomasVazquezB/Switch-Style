import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Busqueda = () => {
  const [productos, setProductos] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    if (query) {
      axios.get(`http://127.0.0.1:8000/api/producto/buscar?q=${query}`)
        .then(response => setProductos(response.data))
        .catch(error => console.error('Error al buscar:', error));
    }
  }, [query]);

  return (
    <div className="container mt-4">
      <h2>Resultados para: "{query}"</h2>
      <ul>
        {productos.map(prod => (
          <li key={prod.id}>{prod.titulo}</li>
        ))}
      </ul>
    </div>
  );
};

export default Busqueda;
