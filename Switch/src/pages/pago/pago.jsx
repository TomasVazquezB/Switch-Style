import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backendApi as axios } from "../../api/axios";
import { toast } from "react-toastify";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { csrf } from "../../api/axios"; // al principio del archivo
import "./pago.css";

export default function Pago() {
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const [accesorios, setAccesorios] = useState([]);

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem("checkout_payload") || "null");
    if (!p || !p?.carrito?.length) {
      toast.error("Faltan datos del pedido. Volvé a Confirmar pago.");
      navigate("/confpago");
      return;
    }
    setPayload(p);

    // 👇 Usamos publicApi, no axios (para evitar CORS y Auth)
    import("../../api/axios").then(({ publicApi }) => {
      Promise.all([publicApi.get("/ropa"), publicApi.get("/accesorios")])
        .then(([r1, r2]) => {
          setProductos(r1.data || []);
          setAccesorios(r2.data || []);
        })
        .catch((err) => {
          console.error("Error al obtener productos:", err);
          setProductos([]);
          setAccesorios([]);
        });
    });
  }, [navigate]);


  const buscarProducto = (item) => {
    const fuente = item.tipoProducto === "accesorio" ? accesorios : productos;
    return fuente.find((p) => p.id === item.id || p.id === item.producto_id);
  };


  const getImagen = (item, prod) => {
    const raw = item?.ruta_imagen || prod?.ruta_imagen || "";
    if (!raw) return "";

    // Si ya es una URL completa (Cloudinary, Laravel, etc.), la devolvemos tal cual
    if (/^https?:\/\//i.test(raw)) return raw;

    // Si el path empieza con "storage", agregamos el dominio sin "/api"
    if (raw.startsWith("storage/") || raw.includes("/accesorios/") || raw.includes("/ropa/")) {
      return `https://switchstyle.laravel.cloud/${raw.replace(/^api\//, "")}`;
    }

    // Si el path es relativo (sin "storage/"), lo normalizamos
    return `https://switchstyle.laravel.cloud/storage/${raw.replace(/^api\//, "")}`;
  };

  const subtotal = useMemo(() => {
    if (!payload) return "0.00";
    const sum = payload.carrito.reduce((acc, item) => {
      const prod = buscarProducto(item);
      const unit = parseFloat(prod?.precio ?? 0) || parseFloat(item?.precio ?? 0) || 0;
      return acc + unit * (item.cantidad || 1);
    }, 0);
    const calc = Number.isFinite(sum) && sum > 0 ? sum : Number(payload.subtotal || 0);
    return Number(calc || 0).toFixed(2);
  }, [payload, productos, accesorios]);

  const total = subtotal;

  const finalizarPedido = async ({ metodo, external_id, extra = {} }) => {
    try {
      setLoading(true);
      console.log("➡️ Posteando pedido a:", axios.defaults.baseURL);

      await backendApi.post("/crear-pedido", {
        ...payload,
        subtotal: Number(subtotal),
        total: Number(total),
        metodo_pago: metodo,
        external_id,
        extra,
      });


      // 🔹 Limpiamos todo y redirigimos
      localStorage.removeItem("carrito");
      localStorage.removeItem("checkout_info");
      localStorage.removeItem("checkout_payload");
      setPayload(null);
      setProductos([]);
      setAccesorios([]);
      toast.success("¡Pedido completado!");
      navigate("/pedidos");
    } catch (e) {
      console.error(e);
      toast.error("No se pudo registrar el pedido. Contactanos.");
    } finally {
      setLoading(false);
    }
  };

  const createOrder = (_data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: { value: total },
          description: "Compra en Switch Style",
        },
      ],
    });
  };

  const onApprove = async (_data, actions) => {
    const details = await actions.order.capture();
    await finalizarPedido({
      metodo: "paypal",
      external_id: details?.id,
      extra: { payer: details?.payer },
    });
  };

  const onError = (err) => {
    console.error(err);
    toast.error("Error al procesar PayPal");
  };

  if (!payload) return null;

  const { envio, moneda } = payload;

  return (
    <div className="pago-uni-container">
      <h2 className="confirmarcion-pago">Confirmacion de Pago</h2>
      <section className="pago-card">
        <h3 className="direccion-envio">Dirección de envío</h3>
        <p className="pago-muted">{envio?.nombre} {envio?.apellido} · {envio?.telefono}</p>
        <p className="pago-muted">{envio?.direccion?.calle} {envio?.direccion?.numero} {envio?.direccion?.pisoDepto ? `, ${envio?.direccion?.pisoDepto}` : ""}</p>
        <p className="pago-muted">{envio?.direccion?.ciudad}, {envio?.direccion?.provincia} ({envio?.direccion?.codigoPostal})</p>
        <p className="pago-muted">Entrega: {envio?.entrega?.fecha} · {envio?.entrega?.franja}</p>
        <button className="pago-btn-link" onClick={() => navigate("/confpago")}>Cambiar datos de envío</button>
      </section>

      <section className="pago-card">
        <h3 className="tus-productos">Tus productos</h3>
        {payload.carrito.map((item, idx) => {
          const p = buscarProducto(item);
          const img = p || item ? getImagen(item, p) : "";
          const unit = parseFloat(p?.precio ?? 0) || parseFloat(item?.precio ?? 0) || 0;
          const line = (unit * (item.cantidad || 1)).toFixed(2);
          return (
            <div key={idx} className="pago-resumen-item">
              {img ? <img src={img} alt={p?.titulo || "Producto"} /> : <div className="pago-ph" />}
              <div className="pago-resumen-info">
                <div className="pago-tit">{p?.titulo || item?.titulo || "Producto"}</div>
                <div className="pago-sub"> {moneda}{unit.toFixed(2)} · x{item.cantidad} {item.talla ? ` · Talle ${item.talla}` : ""}</div>
              </div>
              <div className="pago-resumen-linea">{moneda}{line}</div>
            </div>
          );
        })}
      </section>

      <section className="pago-card pago-resumen-unificado">
        <div className="pago-row">
          <span className="sub-total">Subtotal</span>
          <strong>{moneda}{subtotal}</strong>
        </div>
        <div className="pago-row">
          <span className="envio-pago">Envío</span>
          <span className="pago-muted">Se calculará si aplica</span>
        </div>
        <div className="pago-row pago-total">
          <span className="total-pago">Total</span>
          <strong>{moneda}{total}</strong>
        </div>
      </section>

      <section className="pago-card">
        <div className="pago-pay-wrap">
          <PayPalButtons
            style={{ layout: "vertical", height: 48, shape: "rect", label: "paypal", tagline: false }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            disabled={loading}
            forceReRender={[total]}
          />
        </div>

        {/* 🧩 Botón de pago simulado */}
        <button
          type="button"
          className="pago-btn-falso"
          disabled={loading}
          onClick={() =>
            finalizarPedido({
              metodo: "simulado",
              external_id: "fake-" + Date.now(),
              extra: { nota: "Pago simulado para pruebas" },
            })
          }
        >
          Confirmar pago (simulado)
        </button>
      </section>

      <p className="nota-final">Al confirmar el pago, registraremos tu pedido y lo verás en <b>Mis Pedidos</b></p>
    </div>
  );
}