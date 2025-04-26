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
        <Link
          to="/quienessomos"
          className="quienes-link"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          ¿Querés conocernos?
        </Link>
      </nav>
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