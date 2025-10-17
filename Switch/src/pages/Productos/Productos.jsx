import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { PayPalButtons } from "@paypal/react-paypal-js";
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

function toBucketUrl(rawPath) {
  if (!rawPath) return PLACEHOLDER;
  if (/^https?:\/\//i.test(rawPath)) return rawPath;
  const key = String(rawPath)
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
  const [preferenceId, setPreferenceId] = useState(null);
  const [mostrarPagos, setMostrarPagos] = useState(false);
  const [sortReviews, setSortReviews] = useState("recientes");

  const [favoritos, setFavoritos] = useState(() => {
    try {
      const stored = localStorage.getItem("favoritos");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [reviews] = useState([
    { id: 1, autor: "Juan Perez", fecha: "2025-06-01", comentario: "Muy buen producto.", puntuacion: 5 },
    { id: 2, autor: "Ana Fernandez", fecha: "2025-06-05", comentario: "Podría ser mejor.", puntuacion: 3 },
    { id: 3, autor: "Sofia De los montes", fecha: "2025-08-12", comentario: "Excelente calidad y precio muy recomendado.", puntuacion: 4 },
    { id: 4, autor: "Pedro Manuel Campos", fecha: "2025-10-04", comentario: "Me llegó en mal estado el producto.", puntuacion: 1 },
  ]);

  useEffect(() => {
    const endpoint = tipo.includes("accesorio") ? "accesorios" : "ropa";
    axios
      .get(`/${endpoint}/${productoId}`)
      .then((res) => {
        const data = res.data || {};
        setProductoData(data);
        const primeraRuta = data?.imagenes?.[0]?.ruta || data?.ruta_imagen || data?.imagen_url || "";
        const key = String(primeraRuta).replace(/^https?:\/\/[^/]+\/?/, "");
        setImgKey(key);
        if (tipo.includes("accesorio")) setStockDisponible(Number(data.stock || 0));
      })
      .catch(() => toast.error("Producto no encontrado"));
  }, [productoId, tipo]);

  const handleSeleccionTalla = (nombreTalla) => {
    setTalla(nombreTalla);
    const tallaData = productoData?.tallas?.find((t) => t.nombre === nombreTalla);
    setStockDisponible(Number(tallaData?.pivot?.cantidad || 0));
    setCantidad(1);
  };

  const toggleFavorito = () => {
    if (!productoData) return;
    setFavoritos((prev) => {
      const existe = prev.includes(productoData.id);
      const nuevos = existe ? prev.filter((id) => id !== productoData.id) : [...prev, productoData.id];
      localStorage.setItem("favoritos", JSON.stringify(nuevos));
      return nuevos;
    });
  };

  const handleAgregarAlCarrito = () => {
    if (!productoData) return;
    if (!talla && tipo.includes("ropa")) return toast.error("Seleccione una talla");
    if (cantidad < 1 || (tipo.includes("ropa") && cantidad > stockDisponible)) return toast.error("Cantidad inválida");

    const key = productoData?.imagenes?.[0]?.ruta || imgKey || "";
    const imgUrl = toBucketUrl(key);

    const nuevoItem = {
      producto_id: productoData.id,
      titulo: productoData.titulo,
      precio: productoData.precio,
      ruta_imagen: imgUrl,
      talla: tipo.includes("ropa") ? talla : null,
      cantidad,
    };

    let carritoExistente = [];
    try {
      const guardado = JSON.parse(localStorage.getItem("carrito"));
      carritoExistente = Array.isArray(guardado) ? guardado : [];
    } catch {
      carritoExistente = [];
    }

    const index = carritoExistente.findIndex(
      (item) => item.producto_id === nuevoItem.producto_id && item.talla === nuevoItem.talla
    );

    if (index >= 0) carritoExistente[index].cantidad += cantidad;
    else carritoExistente.push(nuevoItem);

    localStorage.setItem("carrito", JSON.stringify(carritoExistente));
    toast.success("Producto agregado al carrito");
    setTimeout(() => navigate("/carrito"), 800);
  };

  const generarPreferencia = () => {
    if (!productoData) return;
    if (!talla && tipo.includes("ropa")) return toast.error("Seleccione una talla.");

    const producto = {
      title: productoData.titulo,
      quantity: cantidad,
      currency_id: "ARS",
      unit_price: Number(productoData.precio),
    };

    fetch(`${import.meta.env.VITE_API_URL}/create_preference`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [producto] }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPreferenceId(data.preferenceId);
        setMostrarPagos(true);
      })
      .catch(() => toast.error("No se pudo iniciar el pago"));
  };

  const sinStock = useMemo(() => Number(stockDisponible) === 0, [stockDisponible]);

  if (!productoData) return <div className="content">Cargando producto...</div>;

  return (
    <div className={`content ${darkMode ? "dark" : ""}`}>
      <div className="content">
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "120px auto 1.2fr",
            columnGap: "1rem",
            alignItems: "start",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {(productoData.imagenes || []).map((imgItem, index) => {
              const key = String(imgItem?.ruta || "").replace(/^https?:\/\/[^/]+\/?/, "");
              const active = imgKey === key;
              return (
                <img
                  key={index}
                  src={toBucketUrl(key)}
                  alt={`Miniatura ${index + 1}`}
                  onClick={() => setImgKey(key)}
                  className={`thumbnail ${active ? "active" : ""} h-24 w-20 object-cover rounded cursor-pointer`}
                />
              );
            })}
          </div>

          <div style={{ backgroundColor: "#ffffffff", padding: "1rem", borderRadius: "0.75rem" }}>
            <img src={toBucketUrl(imgKey)} alt="Producto" className="main-image" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontSize: "2rem", fontWeight: "bold" }}>{productoData.titulo}</h2>
              <p style={{ fontSize: "1.5rem", fontWeight: "bold", marginTop: "1rem" }}>
                ${Number(productoData.precio).toFixed(2)}
              </p>
              <button
                onClick={toggleFavorito}
                style={{
                  marginTop: "0.5rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  color: favoritos.includes(productoData.id) ? "red" : "#888",
                }}
              >
                {favoritos.includes(productoData.id) ? "❤️ Quitar de favoritos" : "🤍 Agregar a favoritos"}
              </button>
              {tipo.includes("accesorio") && (
                <p style={{ fontSize: "1rem", marginTop: "0.5rem", color: sinStock ? "red" : "#555" }}>
                  {sinStock ? "Sin stock disponible" : `Stock disponible: ${stockDisponible}`}
                </p>
              )}
            </div>

            {tipo.includes("ropa") && productoData.tallas?.length > 0 && (
              <div>
                <p style={{ fontWeight: 500, marginBottom: "0.5rem" }}>Tallas disponibles:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {productoData.tallas.map((t, index) => (
                    <button
                      key={index}
                      onClick={() => handleSeleccionTalla(t.nombre)}
                      className={`talla-btn ${talla === t.nombre ? "active" : ""}`}
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
                      onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                      className="border px-3 py-1 w-24 rounded"
                    />
                  </div>
                )}
              </div>
            )}

            {tipo.includes("accesorio") && !sinStock && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  max={stockDisponible}
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                  className="border px-3 py-1 w-24 rounded"
                />
              </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <button
                className="button carrito"
                onClick={handleAgregarAlCarrito}
                disabled={sinStock}
                style={sinStock ? { backgroundColor: "#ccc", cursor: "not-allowed" } : {}}
              >
                Agregar al carrito
              </button>
              <button
                className="button comprar"
                onClick={generarPreferencia}
                disabled={sinStock}
                style={sinStock ? { backgroundColor: "#ccc", cursor: "not-allowed" } : {}}
              >
                Comprar ahora
              </button>
            </div>

            {mostrarPagos && (
              <div style={{ marginTop: "2rem" }}>
                <PayPalButtons
                  style={{ layout: "horizontal" }}
                  createOrder={(data, actions) =>
                    actions.order.create({
                      purchase_units: [{ amount: { value: Number(productoData.precio).toFixed(2) } }],
                    })
                  }
                  onApprove={(data, actions) =>
                    actions.order.capture().then((details) => {
                      toast.success(`Pago aprobado por ${details.payer.name.given_name}`);
                      navigate("/carrito");
                    })
                  }
                />
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: "4rem", maxWidth: "1000px", marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid #ddd", marginBottom: "1rem" }}>
            <button onClick={() => setActiveTab("descripcion")} className={`tab-button ${activeTab === "descripcion" ? "active" : ""}`}>
              Descripción
            </button>
            <button onClick={() => setActiveTab("reviews")} className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}>
              Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === "descripcion" ? (
            <p style={{ color: "#444", fontSize: "0.95rem" }}>{productoData.descripcion}</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <select
                value={sortReviews}
                onChange={(e) => setSortReviews(e.target.value)}
                style={{ padding: "0.5rem", fontSize: "0.875rem", borderRadius: "0.375rem", border: "1px solid #ccc", width: "fit-content" }}
              >
                <option value="recientes">Más recientes</option>
                <option value="mejor">Mejor puntuados</option>
                <option value="peor">Peor puntuados</option>
              </select>

              {reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
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
    </div>
  );
};

export default Productos;
