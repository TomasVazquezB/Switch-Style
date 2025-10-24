import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../api/axios";
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
  factIgualEnvio: true,

  // Datos de facturación (si no es igual al envío)
  factNombre: "",
  factApellido: "",
  factCalle: "",
  factNumero: "",
  factPisoDepto: "",
  factCiudad: "",
  factProvincia: "",
  factCodigoPostal: "",
  aceptaTerminos: false,
};

export default function ConfPago() {
  const navigate = useNavigate();

  // ---- Carrito local ----
  const [carrito, setCarrito] = useState(() => {
    try {
      const saved = localStorage.getItem("carrito");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // ---- Catálogos para calcular totales ----
  const [productos, setProductos] = useState([]);
  const [accesorios, setAccesorios] = useState([]);
  const [moneda] = useState("$");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ropaRes, accesoriosRes] = await Promise.all([
          axios.get("/ropa"),
          axios.get("/accesorios"),
        ]);
        setProductos(ropaRes.data || []);
        setAccesorios(accesoriosRes.data || []);
      } catch (e) {
        console.error("Error trayendo catálogos:", e);
      }
    };
    fetchData();
  }, []);

  const buscarProducto = (item) => {
    const fuente = item.tipo === "accesorio" ? accesorios : productos;
    return fuente.find((p) => p.id === item.producto_id);
  };

  const subtotal = useMemo(() => {
    const total = carrito.reduce((acc, item) => {
      const prod = buscarProducto(item);
      const precio = parseFloat(prod?.precio || 0);
      return acc + precio * (item.cantidad || 1);
    }, 0);
    return total.toFixed(2);
  }, [carrito, productos, accesorios]);

  // ---- Formulario ----
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem("checkout_info");
      return saved ? { ...emptyForm, ...JSON.parse(saved) } : emptyForm;
    } catch {
      return emptyForm;
    }
  });

  // Autosave liviano
  useEffect(() => {
    localStorage.setItem("checkout_info", JSON.stringify(form));
  }, [form]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
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
    // Si facturación distinta
    if (!form.factIgualEnvio) {
      const reqFact = [
        "factNombre",
        "factApellido",
        "factCalle",
        "factNumero",
        "factCiudad",
        "factProvincia",
        "factCodigoPostal",
      ];
      for (const k of reqFact) {
        if (!String(form[k] || "").trim()) {
          toast.error(`Falta completar facturación: ${k}`);
          return false;
        }
      }
    }
    if (!form.aceptaTerminos) {
      toast.error("Debes aceptar los Términos y Condiciones.");
      return false;
    }
    if (!carrito?.length) {
      toast.error("Tu carrito está vacío.");
      return false;
    }
    return true;
  };

  const continuarAPago = () => {
    if (!validar()) return;

    // Guardar payload compacto para backend/pasarela
    const payload = {
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
      facturacion: form.factIgualEnvio
        ? "igual"
        : {
            nombre: form.factNombre,
            apellido: form.factApellido,
            direccion: {
              calle: form.factCalle,
              numero: form.factNumero,
              pisoDepto: form.factPisoDepto,
              ciudad: form.factCiudad,
              provincia: form.factProvincia,
              codigoPostal: form.factCodigoPostal,
            },
          },
      carrito,
      subtotal: Number(subtotal),
      moneda,
    };

    localStorage.setItem("checkout_payload", JSON.stringify(payload));
    // 💡 Cambiá "/pago" si tu ruta de pago real es otra (ej: /checkout/pago o /mercadopago)
    navigate("/pago");
  };

  const volverAlCarrito = () => navigate("/carrito");

  // Imágenes de línea de pedido
  const getImagen = (item, prod) => {
    if (item?.ruta_imagen) return item.ruta_imagen;
    if (!prod?.ruta_imagen) return "";
    return prod.ruta_imagen.startsWith("http")
      ? prod.ruta_imagen
      : `${axios.defaults.baseURL}/storage/${prod.ruta_imagen}`;
  };

  return (
    <div className="confpago-container">
      <div className="confpago-left">
        <h2>Datos de Envío</h2>

        <div className="grid-2">
          <label>
            Nombre *
            <input name="nombre" value={form.nombre} onChange={onChange} />
          </label>
          <label>
            Apellido *
            <input name="apellido" value={form.apellido} onChange={onChange} />
          </label>
        </div>

        <div className="grid-2">
          <label>
            Email *
            <input type="email" name="email" value={form.email} onChange={onChange} />
          </label>
          <label>
            Teléfono *
            <input name="telefono" value={form.telefono} onChange={onChange} />
          </label>
        </div>

        <div className="grid-3">
          <label>
            Calle *
            <input name="calle" value={form.calle} onChange={onChange} />
          </label>
          <label>
            Número *
            <input name="numero" value={form.numero} onChange={onChange} />
          </label>
          <label>
            Piso/Depto
            <input name="pisoDepto" value={form.pisoDepto} onChange={onChange} />
          </label>
        </div>

        <div className="grid-3">
          <label>
            Ciudad *
            <input name="ciudad" value={form.ciudad} onChange={onChange} />
          </label>
          <label>
            Provincia *
            <input name="provincia" value={form.provincia} onChange={onChange} />
          </label>
          <label>
            Código Postal *
            <input name="codigoPostal" value={form.codigoPostal} onChange={onChange} />
          </label>
        </div>

        <label>
          Referencias (opcional)
          <textarea
            name="referencias"
            rows={2}
            value={form.referencias}
            onChange={onChange}
          />
        </label>

        <h3>Entrega</h3>
        <div className="grid-2">
          <label>
            Fecha de entrega *
            <input
              type="date"
              name="entregaFecha"
              value={form.entregaFecha}
              onChange={onChange}
              min={new Date().toISOString().slice(0, 10)}
            />
          </label>
          <label>
            Franja horaria *
            <select
              name="entregaFranja"
              value={form.entregaFranja}
              onChange={onChange}
            >
              <option>09:00-12:00</option>
              <option>12:00-15:00</option>
              <option>15:00-18:00</option>
              <option>18:00-21:00</option>
            </select>
          </label>
        </div>

        <div className="separador" />

        <label className="checkbox-line">
          <input
            type="checkbox"
            name="factIgualEnvio"
            checked={form.factIgualEnvio}
            onChange={onChange}
          />
          Facturación igual a envío
        </label>

        {!form.factIgualEnvio && (
          <>
            <h3>Datos de Facturación</h3>
            <div className="grid-2">
              <label>
                Nombre *
                <input
                  name="factNombre"
                  value={form.factNombre}
                  onChange={onChange}
                />
              </label>
              <label>
                Apellido *
                <input
                  name="factApellido"
                  value={form.factApellido}
                  onChange={onChange}
                />
              </label>
            </div>

            <div className="grid-3">
              <label>
                Calle *
                <input
                  name="factCalle"
                  value={form.factCalle}
                  onChange={onChange}
                />
              </label>
              <label>
                Número *
                <input
                  name="factNumero"
                  value={form.factNumero}
                  onChange={onChange}
                />
              </label>
              <label>
                Piso/Depto
                <input
                  name="factPisoDepto"
                  value={form.factPisoDepto}
                  onChange={onChange}
                />
              </label>
            </div>

            <div className="grid-3">
              <label>
                Ciudad *
                <input
                  name="factCiudad"
                  value={form.factCiudad}
                  onChange={onChange}
                />
              </label>
              <label>
                Provincia *
                <input
                  name="factProvincia"
                  value={form.factProvincia}
                  onChange={onChange}
                />
              </label>
              <label>
                Código Postal *
                <input
                  name="factCodigoPostal"
                  value={form.factCodigoPostal}
                  onChange={onChange}
                />
              </label>
            </div>
          </>
        )}

        <label className="checkbox-line">
          <input
            type="checkbox"
            name="aceptaTerminos"
            checked={form.aceptaTerminos}
            onChange={onChange}
          />
          Acepto Términos y Condiciones
        </label>

        <div className="acciones">
          <button type="button" className="btn-sec" onClick={volverAlCarrito}>
            ← Volver al carrito
          </button>
          <button type="button" className="btn-prim" onClick={continuarAPago}>
            Continuar al pago
          </button>
        </div>
      </div>

      <div className="confpago-right">
        <h3>Resumen</h3>

        {(!carrito || carrito.length === 0) && (
          <p className="muted">Tu carrito está vacío.</p>
        )}

        {carrito?.map((item, idx) => {
          const p = buscarProducto(item);
          if (!p) return null;
          const img = getImagen(item, p);
          const talla = item.talla ? ` · Talle ${item.talla}` : "";
          const precioNum = parseFloat(p?.precio || 0);
          const line = (precioNum * (item.cantidad || 1)).toFixed(2);
          return (
            <div key={idx} className="resumen-item">
              {img ? <img src={img} alt={p.titulo} /> : <div className="ph" />}
              <div className="resumen-info">
                <div className="tit">{p.titulo}</div>
                <div className="sub">
                  {moneda}
                  {precioNum.toFixed(2)} · x{item.cantidad}
                  {talla}
                </div>
              </div>
              <div className="resumen-linea">
                {moneda}
                {line}
              </div>
            </div>
          );
        })}

        <div className="resumen-total">
          <div className="row">
            <span>Subtotal</span>
            <strong>
              {moneda}
              {subtotal}
            </strong>
          </div>
          <div className="row">
            <span>Envío</span>
            <span className="muted">Se calcula en el pago</span>
          </div>
          <div className="row total">
            <span>Total estimado</span>
            <strong>
              {moneda}
              {subtotal}
            </strong>
          </div>
        </div>

        <p className="ayuda">
          ¿Tenés cupón? Podrás aplicarlo en el siguiente paso.
        </p>
      </div>
    </div>
  );
}
