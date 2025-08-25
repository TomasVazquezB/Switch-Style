import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaInstagram, FaRegSmileWink, FaQuestionCircle } from 'react-icons/fa';
import './footer.css';

const Footer = () => {
  const quienesSomosRef = useRef(null);
  const scrollToQuienesSomos = () => {
    quienesSomosRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer footer-center bg-base-200/60 rounded-sm p-4">
      <nav className="footer-nav">
        <FaRegSmileWink className="smile-icon" size={21}/>
        <Link to="/quienessomos" onClick={scrollToQuienesSomos} className="quienes-link">¿Querés conocernos?</Link>
      </nav>

      <nav className="footer-faq">
        <FaQuestionCircle className="faq-icon" size={21}/>
        <Link to="/FAQ" className="faq-link">Preguntas Frecuentes</Link>
      </nav>
      <nav>
        <div className="social-icons">
          <div className="icons-inline">
            <a href="https://www.instagram.com/switch_style25/" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaInstagram size={30} />
            </a>
          </div>
          <span className="social-text">Switch Style</span>
        </div>
      </nav>

      <nav className="contact-info">
        <div className="contact-item">
          <FaPhoneAlt className="contact-number"/>
          <span className="contact-text">0800-222-1254 | 1162657008</span>
        </div>
        <div className="contact-item">
          <FaEnvelope className="contact-email"/>
          <span className="contact-text">consultas@switchstyle.com</span>
        </div>
      </nav>

      <aside>
        <span color="white" className="footer-text">© 2024-2025 Switch Style | Todos los derechos reservados</span>
      </aside>
    </footer>
  );
};

export default Footer;