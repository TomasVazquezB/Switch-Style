import React from 'react';
import './faq.css';

export function FAQPage() {
  const faqs = [
    {
      pregunta: "¿Cómo sé si una prenda está en buen estado?",
      respuesta: "Cada artículo pasa por un control de calidad y en la descripción indicamos el estado real de la prenda.",
      icono: "👕"
    },
    {
      pregunta: "¿Puedo devolver una prenda si no me queda bien?",
      respuesta: "Sí, aceptamos devoluciones dentro de los 7 días posteriores a la recepción del producto.",
      icono: "🔁"
    },
    {
      pregunta: "¿Switch Style vende ropa de marca?",
      respuesta: "Sí, contamos con prendas de segunda mano de marcas reconocidas y también opciones más accesibles.",
      icono: "💼"
    },
    {
      pregunta: "¿Cómo puedo vender mi ropa en Switch Style?",
      respuesta: "Crea una cuenta, subí tus prendas con buenas fotos y nosotros nos encargamos del resto.",
      icono: "📸"
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