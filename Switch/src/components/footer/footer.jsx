import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaRegSmileWink } from 'react-icons/fa';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-left-content">
            <Typography color="white" className="footer-text"> © 2024-2025 Switch Style | Todos los derechos reservados</Typography>
            <div className="quienes-wrapper">
              <FaRegSmileWink className="smile-icon" />
              <Link to="/quienessomos" className="quienes-link">¿Querés conocernos?
</Link>
            </div>
          </div>
        </div>

        <div className="footer-right">
          <div className="switch-style-and-social">
            <div className="social-icons">
              <div className="social-icon">
                <FaFacebookF />
                <FaTwitter />
                <FaInstagram />
                <Typography color="white" className="footer-link">Switch Style</Typography>
              </div>
            </div>

            <div className="contact-info-container">
              <Typography color="white" className="contact-info">
                <FaPhoneAlt /> 0800-222-1254 | 1162657008
              </Typography>
              <Typography color="white" className="contact-info">
                <FaEnvelope /> consultas@switchstyle.com
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;