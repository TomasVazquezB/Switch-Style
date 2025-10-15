import React, { useContext, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import "./busqueda.css";

const ProductoItem = ({ id, img, nombre, precio, esFavorito, onToggleFavorito }) => {
  return (
    <Link to={`/producto/ropa/${id}`} className="busqueda-page-card-link">
      <div className="busqueda-page-card">
        <img src={img} alt={nombre} />
        <div className="busqueda-page-info">
          <h3 className="busqueda-page-title-producto">{nombre}</h3>
          <p className="busqueda-page-precio-producto">${precio}</p>
          <div className="busqueda-page-favorito" onClick={(e) => {e.preventDefault(); onToggleFavorito();}}>{esFavorito ? "❤️" : "🤍"}Favorito</div>
        </div>
      </div>
    </Link>
  );
};

const Busqueda = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q")?.toLowerCase() || "";

  const { productos, loading } = useContext(DataContext);
  const [resultados, setResultados] = useState([]);
  const [favoritos, setFavoritos] = useState(() => {
  const stored = localStorage.getItem("favoritos");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (!query || !productos || productos.length === 0) {setResultados([]);
      return;
    }

    const filtrados = productos.filter((p) => {
    const texto = `${p.Titulo || p.titulo || ""} ${p.Descripcion || p.descripcion || ""} ${p.Categoria || p.categoria || ""} ${p.Tipo || p.tipo || ""} ${p.Genero || p.genero || ""} `.toLowerCase();
    return texto.includes(query);
    });

    setResultados(filtrados);
  }, [query, productos]);

  const toggleFavorito = (id) => {
    setFavoritos((prev) => {
      const nuevos = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem("favoritos", JSON.stringify(nuevos));
      return nuevos;
    });
  };

  return (
    <div className="busqueda-page">
      <h2 className="busqueda-page-title">Resultados para: "{query.toUpperCase()}"</h2>

      {loading ? (
        <p className="busqueda-page-message">Cargando productos...</p>
      ) : !query ? (
        <p className="busqueda-page-message">Ingresa algo para buscar</p>
      ) : resultados.length === 0 ? (
        <p className="busqueda-page-message">No se encontraron productos que coincidan con "{query}"</p>
      ) : (
        <div className="busqueda-page-grid">
          {resultados.map((item) => (
            <ProductoItem
              key={item.id}
              id={item.id}
              img={item.imagen_url}
              nombre={item.Titulo || item.titulo}
              precio={item.Precio || item.precio}
              esFavorito={favoritos.includes(item.id)}
              onToggleFavorito={() => toggleFavorito(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Busqueda;