import React, { useContext, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./busqueda.css";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="Arial" font-size="24" fill="#9ca3af">Sin imagen</text></svg>`
  );

function toBucketUrl(rawPath) {
  if (!rawPath) return PLACEHOLDER;
  if (/^https?:\/\//i.test(rawPath)) return rawPath;
  let key = rawPath.replace(/^\/?(public|storage)\//i, "");
  key = `storage/${key}`;
  const BASE = import.meta.env.VITE_API_URL || "https://switchstyle.laravel.cloud";
  return `${BASE}/${encodeURI(key)}`;
}

const ProductoItem = ({ id, img, nombre, precio, esFavorito, onToggleFavorito }) => (
  <Link to={`/producto/ropa/${id}`} className="busqueda-page-card-link">
    <div className="busqueda-page-card">
      <img src={img} alt={nombre} onError={(e) => (e.target.src = PLACEHOLDER)} />
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

const Busqueda = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q")?.toLowerCase() || "";
  const { productos, loading, darkMode, usuario } = useContext(DataContext);

  const [resultados, setResultados] = useState([]);
  const [favoritos, setFavoritos] = useState(() => {
    const stored = localStorage.getItem("favoritos");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (!query || !productos?.length) {
      setResultados([]);
      return;
    }

    const filtrados = productos.filter((p) => {
      const texto = `${(p.Titulo || p.titulo || "").toLowerCase()} ${(p.Descripcion || p.descripcion || "").toLowerCase()} ${(p.categoria?.nombre || p.Categoria || "").toLowerCase()} ${(p.tipo?.nombre || p.Tipo || "").toLowerCase()} ${(p.genero?.nombre || p.Genero || "").toLowerCase()}`;
      return texto.includes(query);
    });

    setResultados(filtrados);
  }, [query, productos]);

  const toggleFavorito = (id) => {
    if (!usuario) {
      toast.warning("Debes iniciar sesión para agregar a favoritos 🔐", {
        position: "top-right", 
        autoClose: 4000,
        theme: darkMode ? "dark" : "light",
      });
      return;
    }

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
      <h2 className="busqueda-page-title">Resultados para: "{query.toUpperCase()}"</h2>

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
            const raw = item.imagen_url || item.ruta_imagen || item?.imagenes?.[0]?.ruta || "";
            const imageUrl = toBucketUrl(raw);

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

      <ToastContainer
        position="top-right" 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Busqueda;