import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaRegSmileWink } from 'react-icons/fa';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer footer-center bg-base-200/60 rounded-sm p-4">
      <nav className="footer-nav">
        <FaRegSmileWink className="smile-icon" />
        <Link to="/quienessomos" className="quienes-link">¿Querés conocernos?</Link>
      </nav>

      <div className="app-download">
        <Typography color="white" className="app-title">Descarga la aplicación y únete a la experiencia Switch Style</Typography>
        <div className="app-store-icons">
          <a className="app-icon">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Google_Play_Logo.svg/1024px-Google_Play_Logo.svg.png" alt="Google Play Store" className="play-store-icon" />
          </a>
          <a className="app-icon">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/Apple_Logo.svg" alt="App Store" className="app-store-icon" />
          </a>
        </div>
      </div>

      <nav>
        <div className="social-icons">
          <a aria-label="Redes Link">
            <FaFacebookF className="social-icon" />
            <FaTwitter className="social-icon" />
            <FaInstagram className="social-icon" />
          </a>
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
        <Typography color="white" className="footer-text">© 2024-2025 Switch Style | Todos los derechos reservados</Typography>
      </aside>
    </footer>
  );
};

export default Footer;