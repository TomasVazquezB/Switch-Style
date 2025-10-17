import React, { useContext, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { DataContext } from "../../context/DataContext";
import "./busqueda.css";

// === 🖼️ Configuración de imágenes ===
const BUCKET_BASE = (import.meta.env.VITE_ASSETS_BASE || "").replace(/\/+$/, "");
const BACKEND_BASE = import.meta.env.VITE_API_URL || "https://switchstyle.laravel.cloud";
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

  // Si ya es una URL completa
  if (/^https?:\/\//i.test(rawPath)) return rawPath;

  let key = String(rawPath)
    .replace(/^https?:\/\/[^/]+\/?/, "")
    .replace(/^\/+/, "")
    .replace(/^public\//, "")
    .replace(/^storage\//, "");

  // Normalizar rutas posibles
  if (!key.startsWith("imagenes/")) {
    if (/^ropa\//i.test(key)) key = key.replace(/^ropa\//i, "imagenes/ropa/");
    if (/^accesorios\//i.test(key))
      key = key.replace(/^accesorios\//i, "imagenes/accesorios/");
  }

  // 🔹 Generar URL final confiable
  const BASE = import.meta.env.VITE_API_URL || "https://switchstyle.laravel.cloud";

  // Siempre apunta al storage del backend
  return `${BASE}/storage/${encodeURI(key)}`;
}

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
      const titulo = (p.Titulo || p.titulo || "").toLowerCase();
      const descripcion = (p.Descripcion || p.descripcion || "").toLowerCase();
      const categoria = (p.categoria?.nombre || p.Categoria || "").toLowerCase();
      const tipo = (p.tipo?.nombre || p.Tipo || "").toLowerCase();
      const genero = (p.genero?.nombre || p.Genero || "").toLowerCase();

      if (["accesorio", "accesorios", "accessory", "accessories"].includes(query)) {
        return (
          tipo.includes("accesorio") ||
          categoria.includes("accesorio") ||
          titulo.includes("accesorio") ||
          descripcion.includes("accesorio") ||
          (p.ruta_imagen && p.ruta_imagen.toLowerCase().includes("accesorios"))
        );
      }

      const texto = `${titulo} ${descripcion} ${categoria} ${tipo} ${genero}`;
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

            // 🧠 Debug visual (quítalo si no lo necesitás)
            console.log("🖼️ RAW:", raw);
            console.log("✅ FINAL URL:", imageUrl);

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