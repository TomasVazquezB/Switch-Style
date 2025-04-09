import React from 'react';
import Typography from '@mui/material/Typography';
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <Typography color="white" className="footer-text"> © Turismo POP </Typography>
      <div className="right-section">
        <Typography as="a" href="#" color="white" className="footer-link"> Facebook </Typography>
        <Typography as="a" href="#" color="white" className="footer-link"> Instagram </Typography>
      </div>
    </footer>
  );
}

export default Footer;
