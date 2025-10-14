import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import ProductoItem from "../../components/Productoitem/ProductoItem";
import "./busqueda.css";

const Busqueda = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q")?.toLowerCase() || "";

  const { productos, darkMode } = useContext(DataContext);
  const [resultados, setResultados] = useState([]);
  const [favoritos, setFavoritos] = useState(() => {
    const stored = localStorage.getItem("favoritos");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (!query || !productos.length) {
      setResultados([]);
      return;
    }

    // 🔍 Filtrar productos localmente (por título, tipo o descripción)
    const filtrados = productos.filter((p) => {
      const texto = `${p.Titulo || ""} ${p.Tipo || ""} ${p.Descripcion || ""}`.toLowerCase();
      return texto.includes(query);
    });

    setResultados(filtrados);
  }, [query, productos]);

  const toggleFavorito = (id) => {
    setFavoritos((prev) => {
      const nuevos = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem("favoritos", JSON.stringify(nuevos));
      return nuevos;
    });
  };

  return (
    <div className={`busqueda-page ${darkMode ? "dark" : ""}`}>
      <h2 className="busqueda-page-title">
        Resultados para: "{query.toUpperCase()}"
      </h2>

      {!productos.length ? (
        <p className="busqueda-page-message">Cargando productos...</p>
      ) : resultados.length === 0 ? (
        <p className="busqueda-page-message">No se encontraron productos.</p>
      ) : (
        <div className="busqueda-page-grid">
          {resultados.map((item) => (
            <ProductoItem
              key={item.id}
              id={item.id}
              img={item.imagen_url}
              nombre={item.Titulo}
              precio={item.Precio}
              tipo={item.Tipo}
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