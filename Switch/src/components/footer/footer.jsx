import React from 'react';
import Typography from '@mui/material/Typography';
import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <Typography color="white" className="footer-text"> © 2024-2025 Switch Style | Todos los derechos reservados</Typography>
        </div>

        <div className="footer-right">
          <div className="switch-style-and-social">
            <div className="social-icons">
              <div className="social-icon">
                <FaFacebookF/>
                <FaTwitter/>
                <FaInstagram/>
                <Typography color="white" className="footer-link">Switch Style</Typography>
              </div>
            </div>
          </div>

          <div className="footer-contact">
            <Typography color="white" className="contact-info">
              <FaPhoneAlt/> 1162657008
            </Typography>
            <Typography color="white" className="contact-info">
              <FaPhoneAlt/> 0800-222-1254
            </Typography>
            <Typography color="white" className="contact-info">
              <FaEnvelope/> consultas@switchstyle.com
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;