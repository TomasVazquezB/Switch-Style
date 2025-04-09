import React from 'react';
import Typography from '@mui/material/Typography';
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <Typography color="white" className="footer-text"> © 2024-2025 Switch Style Todos los derechos reservados</Typography>
      <div className="right-section">
        <Typography as="a" href="#" color="white" className="footer-link"> Facebook </Typography>
        <Typography as="a" href="#" color="white" className="footer-link"> Twitter </Typography>
        <Typography as="a" href="#" color="white" className="footer-link"> Instagram </Typography>
      </div>
    </footer>
  );
}

export default Footer;
