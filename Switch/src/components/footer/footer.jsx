import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { FaPhoneAlt, FaEnvelope, FaInstagram, FaRegSmileWink } from 'react-icons/fa';
import './footer.css';

const Footer = () => {
  const quienesSomosRef = useRef(null);
  const scrollToQuienesSomos = () => {
    quienesSomosRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer footer-center bg-base-200/60 rounded-sm p-4">
      <nav className="footer-nav">
        <FaRegSmileWink className="smile-icon" />
        <Link to="/quienessomos" onClick={scrollToQuienesSomos} className="quienes-link">
          ¿Querés conocernos?
        </Link>
      </nav>

      <nav>
        <div className="social-icons">
          <div className="icons-inline">
            <a
              href="https://www.instagram.com/switchstyle25/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <FaInstagram size={30} />
            </a>
          </div>
          <span className="social-text">Switch Style</span>
        </div>
      </nav>

      <nav className="contact-info">
        <div className="contact-item">
          <FaPhoneAlt className="contact-icon" />
          <span className="contact-text">0800-222-1254 | 1162657008</span>
        </div>
        <div className="contact-item">
          <FaEnvelope className="contact-icon" />
          <span className="contact-text">consultas@switchstyle.com</span>
        </div>
      </nav>

      <aside>
        <span color="white" className="footer-text">
          © 2024-2025 Switch Style | Todos los derechos reservados
        </span>
      </aside>
    </footer>
  );
};

export default Footer;
