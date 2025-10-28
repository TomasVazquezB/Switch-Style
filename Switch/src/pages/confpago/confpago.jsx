import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { PayPalButtons } from "@paypal/react-paypal-js";
import "react-toastify/dist/ReactToastify.css";
import "./confpago.css";

const emptyForm = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  calle: "",
  numero: "",
  pisoDepto: "",
  ciudad: "",
  provincia: "",
  codigoPostal: "",
  referencias: "",
  entregaFecha: "",
  entregaFranja: "09:00-12:00",
};

export default function ConfPago() {
  const navigate = useNavigate();

  const [carrito] = useState(() => {
    try {
      const saved = localStorage.getItem("carrito");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem("checkout_info");
      return saved ? { ...emptyForm, ...JSON.parse(saved) } : emptyForm;
    } catch {
      return emptyForm;
    }
  });

  const [payload, setPayload] = useState(null);
  const [productos, setProductos] = useState([]);
  const [accesorios, setAccesorios] = useState([]);
  const [loading, setLoading] = useState(false);

  // 👇 Nuevo estado para el popup
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    localStorage.setItem("checkout_info", JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem("checkout_payload") || "null");
    if (p) setPayload(p);

    Promise.all([axios.get("/ropa"), axios.get("/accesorios")])
      .then(([r1, r2]) => {
        setProductos(r1.data || []);
        setAccesorios(r2.data || []);
      })
      .catch(() => {});
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validar = () => {
    const req = [
      "nombre",
      "apellido",
      "email",
      "telefono",
      "calle",
      "numero",
      "ciudad",
      "provincia",
      "codigoPostal",
      "entregaFecha",
    ];
    for (const k of req) {
      if (!String(form[k] || "").trim()) {
        toast.error(`Falta completar: ${k}`);
        return false;
      }
    }
    if (!carrito?.length) {
      toast.error("Tu carrito está vacío.");
      return false;
    }
    return true;
  };

  const guardarPayload = () => {
    if (!validar()) return;

    const payloadData = {
      envio: {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        telefono: form.telefono,
        direccion: {
          calle: form.calle,
          numero: form.numero,
          pisoDepto: form.pisoDepto,
          ciudad: form.ciudad,
          provincia: form.provincia,
          codigoPostal: form.codigoPostal,
          referencias: form.referencias,
        },
        entrega: {
          fecha: form.entregaFecha,
          franja: form.entregaFranja,
        },
      },
      facturacion: "igual",
      carrito,
      subtotal: 0,
      moneda: "$",
    };

    setPayload(payloadData);
    localStorage.setItem("checkout_payload", JSON.stringify(payloadData));
  };

  const volverAlCarrito = () => navigate("/carrito");

  const buscarProducto = (item) => {
    const fuente = item.tipo === "accesorio" ? accesorios : productos;
    return fuente.find((p) => p.id === item.producto_id);
  };

  const getImagen = (item, prod) => {
    if (item?.ruta_imagen) return item.ruta_imagen;
    const raw = prod?.ruta_imagen || "";
    if (!raw) return "";
    return /^https?:\/\//i.test(raw) ? raw : `${axios.defaults.baseURL}/storage/${raw}`;
  };

  const subtotal = useMemo(() => {
    if (!payload) return "0.00";
    const sum = payload.carrito.reduce((acc, item) => {
      const prod = buscarProducto(item);
      const unit = parseFloat(prod?.precio ?? 0) || parseFloat(item?.precio ?? 0) || 0;
      return acc + unit * (item.cantidad || 1);
    }, 0);
    return Number(sum).toFixed(2);
  }, [payload, productos, accesorios]);

  const total = subtotal;

  const finalizarPedido = async ({ metodo, external_id, extra = {} }) => {
    try {
      setLoading(true);
      await axios.post("/crear-pedido", {
        ...payload,
        subtotal: Number(subtotal),
        total: Number(total),
        metodo_pago: metodo,
        external_id,
        extra,
      });
      localStorage.removeItem("carrito");
      localStorage.removeItem("checkout_info");
      localStorage.removeItem("checkout_payload");

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/mispedidos");
      }, 5000);
    } catch (e) {
      console.error(e);
      toast.error("No se pudo registrar el pedido. Contactanos");
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

  return (
    <div className="confpago-page pago-uni-container">
      <h2 className="conf-pago1">CONFIRMACIÓN DE PAGO</h2>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>✅ Tu pedido se procesó con éxito</h3>
            <p>Gracias por comprar con <strong>Switch Style</strong>.</p>
            <p>Redirigiendo a <em>Mis pedidos...</em></p>
          </div>
        </div>
      )}

      <div className="confpago-datos-container">
        <h2 className="datos-envio">Datos de Envío</h2>
        <div className="confpago-grid-2">
          <label className="confpago-label">
            <span className="confpago-label-text">Nombre *</span>
            <input className="confpago-input" name="nombre" value={form.nombre} onChange={onChange} />
          </label>
          <label className="confpago-label">
            <span className="confpago-label-text">Apellido *</span>
            <input className="confpago-input" name="apellido" value={form.apellido} onChange={onChange} />
          </label>
        </div>

        <div className="confpago-grid-2">
          <label className="confpago-label">
            <span className="confpago-label-text">Email *</span>
            <input className="confpago-input" type="email" name="email" value={form.email} onChange={onChange} />
          </label>
          <label className="confpago-label">
            <span className="confpago-label-text">Teléfono *</span>
            <input className="confpago-input" name="telefono" value={form.telefono} onChange={onChange} />
          </label>
        </div>

        <div className="confpago-grid-3">
          <label className="confpago-label">
            <span className="confpago-label-text">Calle *</span>
            <input className="confpago-input" name="calle" value={form.calle} onChange={onChange} />
          </label>
          <label className="confpago-label">
            <span className="confpago-label-text">Número *</span>
            <input className="confpago-input" name="numero" value={form.numero} onChange={onChange} />
          </label>
          <label className="confpago-label">
            <span className="confpago-label-text">Piso/Depto</span>
            <input className="confpago-input" name="pisoDepto" value={form.pisoDepto} onChange={onChange} />
          </label>
        </div>

        <div className="confpago-grid-3">
          <label className="confpago-label">
            <span className="confpago-label-text">Ciudad *</span>
            <input className="confpago-input" name="ciudad" value={form.ciudad} onChange={onChange} />
          </label>
          <label className="confpago-label">
            <span className="confpago-label-text">Provincia *</span>
            <input className="confpago-input" name="provincia" value={form.provincia} onChange={onChange} />
          </label>
          <label className="confpago-label">
            <span className="confpago-label-text">Código Postal *</span>
            <input className="confpago-input" name="codigoPostal" value={form.codigoPostal} onChange={onChange} />
          </label>
        </div>

        <label className="confpago-label">
          <span className="confpago-label-text">Referencias (opcional)</span>
          <textarea className="confpago-textarea" name="referencias" rows={2} value={form.referencias} onChange={onChange}/>
        </label>
         <br/>
        <h3 className="confpago-h3">Entrega</h3>
        <div className="confpago-grid-2">
          <label className="confpago-label">
            <span className="confpago-label-text">Fecha de entrega *</span>
            <input className="confpago-input" type="date" name="entregaFecha" value={form.entregaFecha} onChange={onChange} min={new Date().toISOString().slice(0, 10)}/>
          </label>
          <label className="confpago-label">
            <span className="confpago-label-text">Franja horaria *</span>
            <select className="confpago-input" name="entregaFranja" value={form.entregaFranja} onChange={onChange}>
              <option>09:00-12:00</option>
              <option>12:00-15:00</option>
              <option>15:00-18:00</option>
              <option>18:00-21:00</option>
            </select>
          </label>
        </div>

        <div className="confpago-actions">
          <button type="button" className="confpago-btn confpago-btn-sec" onClick={volverAlCarrito}>← Volver al carrito</button>
          <button type="button" className="confpago-btn confpago-btn-prim" onClick={guardarPayload}>Actualizar resumen</button>
        </div>
      </div>

      {payload && (
        <div className="confpago-pago-container">
          <section className="pago-card">
            <h3 className="direccion-envio">Dirección de envío</h3>
            <p className="pagomuted">{payload.envio?.nombre} {payload.envio?.apellido} · {payload.envio?.telefono}</p>
            <p>{payload.envio?.direccion?.calle} {payload.envio?.direccion?.numero} {payload.envio?.direccion?.pisoDepto && `, ${payload.envio?.direccion?.pisoDepto}`}</p>
            <p>{payload.envio?.direccion?.ciudad}, {payload.envio?.direccion?.provincia} ({payload.envio?.direccion?.codigoPostal})</p>
            <p className="pagomuted">Entrega: {payload.envio?.entrega?.fecha} · {payload.envio?.entrega?.franja}</p>
          </section>

      <section className="pago-card pago-resumen-unificado">
      <h3 className="tus-envios">Tus productos</h3>
  {payload.carrito.map((item, idx) => {
    const p = buscarProducto(item);
    const img = getImagen(item, p);
    const unit = parseFloat(p?.precio ?? 0) || parseFloat(item?.precio ?? 0) || 0;
    const line = (unit * (item.cantidad || 1)).toFixed(2);
    return (
      <div key={idx} className="pago-resumen-item">
        {img ? (
          <img src={img} alt={p?.titulo || item?.titulo || "Producto"} />
        ) : (
          <div className="pago-ph" />
        )}
        <div className="pago-resumen-info">
          <div className="pago-tit">{p?.titulo || item?.titulo || "Producto"}</div>
          <div className="pago-sub">{payload.moneda}{unit.toFixed(2)} · x{item.cantidad}{" "} {item.talla ? `· Talle ${item.talla}` : ""}</div>      
        </div>
      </div>
    );
  })}
  
  <div className="pago-resumen-unificado-total">
    <div className="pago-row">
      <span className="subtotal">Subtotal</span>
      <strong>{payload.moneda}{subtotal}</strong>
    </div>
    <div className="pago-row">
      <span className="envio">Envío</span>
      <span className="pago-muted">Se calculará si aplica</span>
    </div>
    <div className="pago-row pago-total">
      <span className="total-pago">Total</span>
      <strong>{payload.moneda}{total}</strong>
    </div>
  </div>
  <br/>
  <div className="pago-pay-wrap">
    <PayPalButtons style={{layout: "vertical", height: 48, shape: "rect", label: "paypal", tagline: false,}} createOrder={createOrder} onApprove={onApprove} onError={onError} disabled={loading} forceReRender={[total]}/>
    <p className="nota-final">Al confirmar el pago, registraremos tu pedido y lo verás en Mis Pedidos</p>
  </div>
</section>
        </div>
      )} 
    </div>
  );
}