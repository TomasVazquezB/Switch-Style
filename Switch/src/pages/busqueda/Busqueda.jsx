import React, { useContext, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import "./busqueda.css";

const BASE_STORAGE = "https://switchstyle.laravel.cloud/storage";

const ProductoItem = ({ id, img, nombre, precio, esFavorito, onToggleFavorito }) => {
  return (
    <Link to={`/producto/ropa/${id}`} className="busqueda-page-card-link">
      <div className="busqueda-page-card">
        <img src={img} alt={nombre} />
        <div className="busqueda-page-info">
          <h3 className="busqueda-page-title-producto">{nombre}</h3>
          <p className="busqueda-page-precio-producto">${precio}</p>
          <div
            className="busqueda-page-favorito"
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorito();
            }}
          >
            {esFavorito ? "❤️" : "🤍"} Favorito
          </div>
        </div>
      </div>
    </Link>
  );
};

const Busqueda = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q")?.toLowerCase() || "";

  const { productos, loading, darkMode } = useContext(DataContext);
  const [resultados, setResultados] = useState([]);
  const [favoritos, setFavoritos] = useState(() => {
    const stored = localStorage.getItem("favoritos");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (!query || !productos || productos.length === 0) {
      setResultados([]);
      return;
    }

    const filtrados = productos.filter((p) => {
      // Campos seguros
      const titulo = (p.Titulo || p.titulo || "").toString().toLowerCase();
      const descripcion = (p.Descripcion || p.descripcion || "").toString().toLowerCase();

      const categoria = typeof p.categoria === "object"
        ? (p.categoria?.nombre || "").toLowerCase()
        : (p.Categoria || p.categoria || "").toString().toLowerCase();

      const tipo = typeof p.tipo === "object"
        ? (p.tipo?.nombre || "").toLowerCase()
        : (p.Tipo || p.tipo || "").toString().toLowerCase();

      const genero = typeof p.genero === "object"
        ? (p.genero?.nombre || "").toLowerCase()
        : (p.Genero || p.genero || "").toString().toLowerCase();

      // 🔍 Casos especiales de búsqueda:
      if (["man", "men", "hombre", "hombres"].includes(query)) {
        return genero.includes("hombre") || genero.includes("man");
      }

      if (["woman", "women", "mujer", "mujeres"].includes(query)) {
        return genero.includes("mujer") || genero.includes("woman");
      }

      if (["kids", "kid", "niño", "niños", "niña", "niñas"].includes(query)) {
        return genero.includes("kids") || genero.includes("niños") || genero.includes("niñas");
      }

      // ✅ Casos especiales para ACCESORIOS
      if (["accesorio", "accesorios", "accessory", "accessories"].includes(query)) {
        return (
          tipo.includes("accesorio") ||
          categoria.includes("accesorio") ||
          titulo.includes("accesorio") ||
          descripcion.includes("accesorio") ||
          // Si el producto proviene de /accesorios en la API, su ruta_imagen lo indica:
          (p.ruta_imagen && p.ruta_imagen.toLowerCase().includes("accesorios"))
        );
      }

      // --- Filtro general (coincidencia libre) ---
      const texto = `${titulo} ${descripcion} ${categoria} ${tipo} ${genero}`;
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
    <div className={`busqueda-page ${darkMode ? "dark-mode" : "light-mode"}`}>
      <h2 className="busqueda-page-title">
        Resultados para: "{query.toUpperCase()}"
      </h2>

      {loading ? (
        <p className="busqueda-page-message">Cargando productos...</p>
      ) : !query ? (
        <p className="busqueda-page-message">Ingresa algo para buscar</p>
      ) : resultados.length === 0 ? (
        <p className="busqueda-page-message">
          No se encontraron productos que coincidan con "{query}"
        </p>
      ) : (
        <div className="busqueda-page-grid">
          {resultados.map((item) => {
            const imageUrl =
              item.imagen_url?.startsWith("http")
                ? item.imagen_url
                : `${BASE_STORAGE}/${item.ruta_imagen}`;

            return (
              <ProductoItem
                key={item.id}
                id={item.id}
                img={imageUrl}
                nombre={item.titulo || item.Titulo}
                precio={item.precio || item.Precio}
                esFavorito={favoritos.includes(item.id)}
                onToggleFavorito={() => toggleFavorito(item.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Busqueda;