import React from 'react';
import './faq.css';

export function FAQPage() {
  const faqs = [
    {
      pregunta: "¿Cómo sé si una prenda está en buen estado?",
      respuesta: "Cada artículo pasa por un control de calidad y en la descripción indicamos el estado real de la prenda",
      icono: "👕"
    },
    {
      pregunta: "¿Puedo devolver o cambiar una prenda si no me queda bien?",
      respuesta: "Sí, aceptamos devoluciones y cambios dentro de los 7 días posteriores a la recepción del producto, siempre que la prenda esté en el mismo estado en que la recibiste",
      icono: "🔁"
    },
    {
      pregunta: "¿Switch Style vende ropa de marca?",
      respuesta: "Sí, contamos con prendas de segunda mano de marcas reconocidas y también opciones más accesibles",
      icono: "💼"
    },
    {
      pregunta: "¿Cómo puedo vender mi ropa en Switch Style?",
      respuesta: "Crea una cuenta, subí tus prendas con buenas fotos y nosotros nos encargamos del resto",
      icono: "📸"
    },
    {
      pregunta: "¿Cómo funcionan los envíos?",
      respuesta: "Realizamos envíos a todo el país con empresas reconocidas como Correo Argentino y Andreani. El tiempo de entrega suele ser entre 48 a 72 horas hábiles. El costo de envío depende de la ubicación, se calcula automáticamente al momento de realizar la compra",
      icono: "🚚"
    },
    {
      pregunta: "¿Qué formas de pago aceptan?",
      respuesta: "Aceptamos todos los medios de pagos tarjeta de crédito, débito, transferencias bancarias y billeteras virtuales",
      icono: "💳"
    },
    {
      pregunta: "¿Es seguro comprar en Switch Style?",
      respuesta: "Sí, todas tus compras están protegidas y usamos métodos de pago seguros para garantizar tu tranquilidad",
      icono: "🔒"
    },
    {
      pregunta: "¿Qué pasa si el producto que recibo no es lo que esperaba?",
      respuesta: "Si la prenda no coincide con la descripción o tiene algún problema, podés solicitar un cambio o la devolución de tu dinero",
      icono: "❗"
    }

  ];

  return (
    <div className="pyr-page">
      <div className="pyr-container">
        <h1 className="pyr-faq">Preguntas Frecuentes</h1>
        <div className="pyr-list">
          {faqs.map((item, index) => (
            <div className="pyr-item" key={index}>
              <div className="pyr-icon">{item.icono}</div>
              <div>
                <p className="pyr-pregunta">{item.pregunta}</p>
                <p className="pyr-respuesta">{item.respuesta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}