import React from 'react';
import './faq.css';

export function FAQPage() {
  return (
    <div className="faq-page">
      <h1 className="titulo-faq">FAQ - Sección de Preguntas Frecuentes</h1>
      <br/>
      <br />
      <div className="rectangle-faqitem">
        <p><strong>¿?</strong><br/>
          Sí, puedes cambiar o cancelar tu vuelo, pero se pueden aplicar cargos.
        </p>
      </div>
      <br/>
      <div className="rectangle-faqitem">
        <p><strong>¿?</strong><br/>
          Si tu vuelo se cancela, te reubicaremos en el siguiente vuelo disponible o te daremos un reembolso completo.
        </p>
      </div>
      <br/>
      <div className="rectangle-faqitem">
        <p><strong>¿?</strong><br/>
          Los paquetes turísticos incluyen generalmente vuelo y algunas actividades.
        </p>
      </div>
      <br/>
      <div className="rectangle-faqitem">
        <p><strong>¿?</strong><br/>
          Si tienes un problema con un paquete turístico de Turismo POP, ponte en contacto con nuestro centro de atención al cliente.
        </p>
      </div>
    </div>
  );
}
