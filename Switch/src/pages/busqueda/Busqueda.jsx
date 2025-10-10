import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../../api/axios';
import ProductoItem from '../../components/Productoitem/ProductoItem';
import './busqueda.css';

const Busqueda = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  const [resultados, setResultados] = useState([]);
  const [favoritos, setFavoritos] = useState(() => {
    const stored = localStorage.getItem("favoritos");
    return stored ? JSON.parse(stored) : [];
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const toggleFavorito = (id) => {
    setFavoritos((prev) => {
      let nuevos;
      if (prev.includes(id)) {
        nuevos = prev.filter(favId => favId !== id);
      } else {
        nuevos = [...prev, id];
      }
      localStorage.setItem("favoritos", JSON.stringify(nuevos));
      return nuevos;
    });
  };

  useEffect(() => {
    if (!query) return;

    setCargando(true);
    setError('');
    setResultados([]);

    axios
      .get(`/ropa/buscar?q=${encodeURIComponent(query)}`)
      .then((res) => {
        if (res.status === 200 && Array.isArray(res.data)) {
          setResultados(res.data);
        } else {
          setResultados([]);
        }
      })
      .catch((err) => {
        console.error('Error al buscar:', err.response?.data || err.message);

        // Manejo de errores del servidor
        if (err.response?.status === 500) {
          setError('No se encontraron resultados o el servidor tuvo un problema.');
        } else if (err.response?.status === 404) {
          setError('No se encontraron productos con ese nombre.');
        } else {
          setError('Ocurrió un error al realizar la búsqueda. Inténtalo de nuevo.');
        }
      })
      .finally(() => setCargando(false));
  }, [query]);

  return (
    <div className="busqueda-page">
      <h2 className="busqueda-page-title">
        Resultados para: "{query?.toUpperCase()}"
      </h2>

      {cargando && (
        <p className="busqueda-page-message">Buscando productos...</p>
      )}

      {error && (
        <p className="busqueda-page-message error">{error}</p>
      )}

      {!cargando && !error && resultados.length === 0 && (
        <p className="busqueda-page-message">No se encontraron productos.</p>
      )}

      <div className="busqueda-page-grid">
        {resultados.map((item) => {
          const imageUrl = item.ruta_imagen?.startsWith('http')
            ? item.ruta_imagen
            : `${axios.defaults.baseURL}/storage/${item.ruta_imagen}`;

          return (
            <ProductoItem
              key={item.id}
              id={item.id}
              img={imageUrl}
              nombre={item.titulo}
              precio={item.precio}
              tipo="ropa"
              esFavorito={favoritos.includes(item.id)}
              onToggleFavorito={() => toggleFavorito(item.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Busqueda;
