import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaInstagram, FaRegSmileWink, FaQuestionCircle, FaApple, FaGooglePlay } from 'react-icons/fa';
import './footer.css';

const Footer = ({ darkMode }) => {
  const [showModal, setShowModal] = useState(false);
  const quienesSomosRef = useRef(null);

  const scrollToQuienesSomos = () => {
    quienesSomosRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAppDownload = () => {
    // Abrir modal
    setShowModal(true);

    // Descargar APK
    const link = document.createElement("a");
    link.href = "/Switch Style.apk"; // Debe estar en /public
    link.download = "Switch Style.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const closeModal = () => setShowModal(false);

  return (
    <footer className="footer footer-center bg-base-200/60 rounded-sm p-4">
      <nav className="footer-nav">
        <FaRegSmileWink className="smile-icon" size={21} />
        <Link to="/quienessomos" onClick={scrollToQuienesSomos} className="quienes-link">
          ¿Querés conocernos?
        </Link>
      </nav>

      <nav className="footer-faq">
        <FaQuestionCircle className="faq-icon" size={21} />
        <Link to="/FAQ" className="faq-link">Preguntas Frecuentes</Link>
      </nav>

      <nav className="contact-info">
        <div className="contact-item">
          <FaPhoneAlt className="contact-number" />
          <span className="contact-text">0800-222-1254 | 1162657008</span>
        </div>
        <div className="contact-item">
          <FaEnvelope className="contact-email" />
          <span className="contact-text">consultas@switchstyle.com</span>
        </div>
      </nav>

      <aside>
        <span className="footer-text">© 2024-2025 Switch Style | Todos los derechos reservados</span>
      </aside>

      <nav>
        <div className="social-icons">
          <div className="icons-inline">
            <a href="https://www.instagram.com/switch_style25/" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaInstagram size={30} />
            </a>
          </div>
          <span className="social-text">Switch Style</span>
        </div>

        <div className="download-row">
          <div className="download-text">
            <span className="line1">Descargar la aplicación</span>
          </div>

          <div className="download-icons">
            <FaApple size={30} className="store-icon" />
            <FaGooglePlay size={30} className="store-icon" />
            <button onClick={handleAppDownload} className="download-button">
              Descargar APP
            </button>
          </div>
        </div>
      </nav>

      {showModal && (
        <div className={`modal-overlay ${darkMode ? 'dark' : 'light'}`}>
          <div className={`modal-box ${darkMode ? 'dark' : 'light'}`}>
            <h3>¡Gracias por descargar nuestra app!</h3>
            <p>Si la descarga no se inicia automáticamente, vuelva a intentarlo</p>
            <button className="close-modal-btn" onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;