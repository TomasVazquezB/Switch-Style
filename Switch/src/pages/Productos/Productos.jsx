import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { publicApi } from "../../api/axios";
import { toast } from "react-toastify";
import "./Productos.css";

const BUCKET_BASE = (import.meta.env.VITE_ASSETS_BASE || "").replace(/\/+$/, "");
const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
    <rect width="100%" height="100%" fill="#f3f4f6"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
      font-family="Arial" font-size="24" fill="#9ca3af">Sin imagen</text>
  </svg>`
  );

function toImageUrl(rawPath) {
  if (!rawPath) return PLACEHOLDER;
  if (/^https?:\/\//i.test(rawPath)) return rawPath;
  let key = String(rawPath)
    .replace(/^https?:\/\/[^/]+\/?/, "")
    .replace(/^\/+/, "")
    .replace(/^storage\//, "");
  return BUCKET_BASE ? `${BUCKET_BASE}/${encodeURI(key)}` : PLACEHOLDER;
}

const Productos = ({ darkMode }) => {
  const { tipo, productoId } = useParams();
  const navigate = useNavigate();

  const [productoData, setProductoData] = useState(null);
  const [talla, setTalla] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [stockDisponible, setStockDisponible] = useState(0);
  const [imgKey, setImgKey] = useState("");
  const [activeTab, setActiveTab] = useState("descripcion");

  const [usuario, setUsuario] = useState(() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const [favoritos, setFavoritos] = useState(() => {
    try {
      const stored = localStorage.getItem("favoritos");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const syncUser = () => {
      try {
        const u = localStorage.getItem("user");
        setUsuario(u ? JSON.parse(u) : null);
      } catch {
        setUsuario(null);
      }
    };
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const [reviewsBase] = useState([
    { id: 1, autor: "Juan Pérez", fecha: "2025-06-01", comentario: "Muy buen producto", puntuacion: 5 },
    { id: 2, autor: "Ana Fernández", fecha: "2025-06-05", comentario: "Podría ser mejor", puntuacion: 3 },
    { id: 3, autor: "Sofía de los Montes", fecha: "2025-08-12", comentario: "Excelente calidad y precio, muy recomendado", puntuacion: 4 },
    { id: 4, autor: "Pedro Campos", fecha: "2025-10-04", comentario: "Llegó en mal estado, no me gustó", puntuacion: 1 },
    { id: 5, autor: "Lucía Romero", fecha: "2025-09-15", comentario: "Perfecto, justo lo que buscaba", puntuacion: 5 },
    { id: 6, autor: "Matías López", fecha: "2025-09-27", comentario: "Buena relación precio-calidad", puntuacion: 4 },
    { id: 7, autor: "Carolina Varela", fecha: "2025-10-02", comentario: "El envío fue rápido y el producto excelente", puntuacion: 5 },
    { id: 8, autor: "Tomás Alvarez", fecha: "2025-10-10", comentario: "El color no era igual al de la foto", puntuacion: 2 },
    { id: 9, autor: "Valentina Torres", fecha: "2025-10-18", comentario: "Me encantó, lo volvería a comprar", puntuacion: 5 }
  ]);

  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const cantidadRandom = Math.floor(Math.random() * 4) + 2;
    const mezcladas = [...reviewsBase].sort(() => Math.random() - 0.5);
    setReviews(mezcladas.slice(0, cantidadRandom));
  }, [productoId, reviewsBase]);

  useEffect(() => {
    const endpoint = tipo.includes("accesorio") ? "accesorios" : "ropa";
    publicApi
      .get(`/${endpoint}/${productoId}`)
      .then((res) => {
        const data = res.data || {};
        setProductoData(data);
        const primeraRuta =
          data?.imagenes?.[0]?.ruta ||
          data?.ruta_imagen ||
          data?.imagen_url ||
          "";
        const key = String(primeraRuta).replace(/^https?:\/\/[^/]+\/?/, "");
        setImgKey(key);
        if (tipo.includes("accesorio")) setStockDisponible(Number(data.stock || 0));
      })
      .catch(() => toast.error("Producto no encontrado"));
  }, [productoId, tipo]);

  const handleSeleccionTalla = (nombreTalla) => {
    if (talla === nombreTalla) {
      setTalla("");
      setStockDisponible(0);
      setCantidad(1);
    } else {
      const tallaData = productoData?.tallas?.find((t) => t.nombre === nombreTalla);
      const stock = Number(tallaData?.pivot?.cantidad || 0);
      if (stock === 0) {
        toast.error("⚠️ No hay stock disponible para esta talla");
        return;
      }
      setTalla(nombreTalla);
      setStockDisponible(stock);
      setCantidad(1);
    }
  };

  const toggleFavorito = () => {
    const user = usuario || JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast.warning("Debes iniciar sesión para agregar a favoritos 🔐", { autoClose: 4000 });
      return;
    }

    if (!productoData) return;
    setFavoritos((prev) => {
      const existe = prev.includes(productoData.id);
      const nuevos = existe
        ? prev.filter((id) => id !== productoData.id)
        : [...prev, productoData.id];
      localStorage.setItem("favoritos", JSON.stringify(nuevos));
      toast.success(existe ? "Quitado de favoritos 🤍" : "Agregado a favoritos ❤️");
      return nuevos;
    });
  };

  const handleAgregarAlCarrito = () => {
    if (!productoData) return;
    if (!talla && tipo.includes("ropa")) {
      toast.error("Seleccione una talla");
      return;
    }
    if (cantidad < 1 || (tipo.includes("ropa") && cantidad > stockDisponible)) {
      toast.error("Cantidad inválida");
      return;
    }

    const key = productoData?.imagenes?.[0]?.ruta || imgKey || "";
    const imgUrl = toImageUrl(key);

    const nuevoItem = {
      producto_id: productoData.id,
      titulo: productoData.titulo,
      precio: productoData.precio,
      ruta_imagen: imgUrl,
      talla: tipo.includes("ropa") ? talla : null,
      cantidad
    };

    let carritoExistente = [];
    try {
      const guardado = JSON.parse(localStorage.getItem("carrito"));
      carritoExistente = Array.isArray(guardado) ? guardado : [];
    } catch {
      carritoExistente = [];
    }

    const index = carritoExistente.findIndex(
      (item) =>
        item.producto_id === nuevoItem.producto_id &&
        item.talla === nuevoItem.talla
    );

    if (index >= 0) {
      carritoExistente[index].cantidad += cantidad;
    } else {
      carritoExistente.push(nuevoItem);
    }

    localStorage.setItem("carrito", JSON.stringify(carritoExistente));
    toast.success("Producto agregado al carrito");
    setTimeout(() => navigate("/carrito"), 800);
  };

  const sinStock = Number(stockDisponible) === 0;

  if (!productoData) return <div className="content">Cargando producto...</div>;

  return (
    <div className={`content ${darkMode ? "dark" : ""}`}>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "120px auto 1.2fr",
          columnGap: "1rem",
          alignItems: "start"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {(productoData.imagenes || []).map((imgItem, index) => {
            const key = String(imgItem?.ruta || "").replace(
              /^https?:\/\/[^/]+\/?/,
              ""
            );
            const active = imgKey === key;
            return (
              <img
                key={index}
                src={toImageUrl(key)}
                alt={`Miniatura ${index + 1}`}
                onClick={() => setImgKey(key)}
                className={`thumbnail ${
                  active ? "active" : ""
                } h-24 w-20 object-cover rounded cursor-pointer`}
              />
            );
          })}
        </div>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "1rem",
            borderRadius: "0.75rem"
          }}
        >
          <img src={toImageUrl(imgKey)} alt="Producto" className="main-image" />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem"
          }}
        >
          <div className="producto-info">
            <h2>{productoData.titulo}</h2>
            <p className="precio">${Number(productoData.precio).toFixed(2)}</p>

            <div className="payment-info">
              💳 Visa, Mastercard, Mercado Pago <br />
              🔥 10% de descuento por transferencia o efectivo
            </div>

            <button
              onClick={toggleFavorito}
              style={{
                marginTop: "0.5rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "1.2rem",
                color: favoritos.includes(productoData.id) ? "red" : "#888"
              }}
            >
              {favoritos.includes(productoData.id)
                ? "❤️ Quitar de favoritos"
                : "🤍 Agregar a favoritos"}
            </button>

            {tipo.includes("accesorio") && (
              <p
                style={{
                  fontSize: "1rem",
                  marginTop: "0.5rem",
                  color: sinStock ? "red" : "#555"
                }}
              >
                {sinStock
                  ? "Sin stock disponible"
                  : `Stock disponible: ${stockDisponible}`}
              </p>
            )}
          </div>

          {tipo.includes("ropa") && productoData.tallas?.length > 0 && (
            <div>
              <p
                style={{
                  fontWeight: 500,
                  marginBottom: "0.5rem"
                }}
              >
                Tallas disponibles:
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem"
                }}
              >
                {productoData.tallas.map((t, index) => (
                  <button
                    key={index}
                    onClick={() => handleSeleccionTalla(t.nombre)}
                    className={`talla-btn ${
                      talla === t.nombre ? "active" : ""
                    }`}
                  >
                    {t.nombre}
                  </button>
                ))}
              </div>

              {talla && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad (Stock disponible: {stockDisponible})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={stockDisponible}
                    value={cantidad}
                    onChange={(e) =>
                      setCantidad(parseInt(e.target.value) || 1)
                    }
                    className="border px-3 py-1 w-24 rounded"
                  />
                </div>
              )}
            </div>
          )}

          {tipo.includes("accesorio") && !sinStock && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                max={stockDisponible}
                value={cantidad}
                onChange={(e) =>
                  setCantidad(parseInt(e.target.value) || 1)
                }
                className="border px-3 py-1 w-24 rounded"
              />
            </div>
          )}

          <button
            className="button carrito"
            onClick={handleAgregarAlCarrito}
            disabled={sinStock}
          >
            🛒 Agregar al carrito
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: "4rem",
          maxWidth: "1000px",
          margin: "4rem auto"
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            borderBottom: "1px solid #ddd",
            marginBottom: "1rem"
          }}
        >
          <button
            onClick={() => setActiveTab("descripcion")}
            className={`tab-button ${
              activeTab === "descripcion" ? "active" : ""
            }`}
          >
            Descripción
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`tab-button ${
              activeTab === "reviews" ? "active" : ""
            }`}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        {activeTab === "descripcion" ? (
          <p style={{ color: "#444", fontSize: "0.95rem" }}>
            {productoData.descripcion}
          </p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem"
            }}
          >
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.875rem"
                  }}
                >
                  <span className="review-author">{review.autor}</span>
                  <span className="review-date">{review.fecha}</span>
                </div>
                <p className="review-text">{review.comentario}</p>
                <p className="review-stars">⭐ {review.puntuacion}/5</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Productos;
