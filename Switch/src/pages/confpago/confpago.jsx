import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

  useEffect(() => {
    localStorage.setItem("checkout_info", JSON.stringify(form));
  }, [form]);

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

  const continuarAPago = () => {
    if (!validar()) return;

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
      facturacion: "igual",
      carrito,
      subtotal: 0, 
      moneda: "$",
    };

    localStorage.setItem("checkout_payload", JSON.stringify(payload));
    navigate("/pago");
  };

  const volverAlCarrito = () => navigate("/carrito");

  return (
    <div className="confpago-page">
      <div className="confpago-container confpago-single">
        <div className="confpago-left">
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
            <button type="button" className="confpago-btn confpago-btn-prim" onClick={continuarAPago}>Continuar al pago</button>
          </div>
        </div>
      </div>
    </div>
  );
}