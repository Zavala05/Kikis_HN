import React from 'react';

import './footer.css'; 


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp, faTiktok } from '@fortawesome/free-brands-svg-icons';


const INSTAGRAM_URL = "https://www.instagram.com/kikis_hn?igsh=MW85cWU4eGFmem10NA==o";
const WHATSAPP_URL = "https://wa.me/98989301"; 
const FACEBOOK_URL = "https://www.tiktok.com/@504kikis?_r=1&_t=ZM-91ciEM4sfs4";

const Footer = () => {
  return (
    // Se usa la clase 'footer' definida en Footer.css
    <footer className="footer">
      <div className="social-links">
        
        {/* Enlace de Instagram */}
        <a 
          href={INSTAGRAM_URL} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="icon-link"
          aria-label="Instagram"
        >
          <FontAwesomeIcon icon={faInstagram} className="social-icon" />
        </a>

        {/* Enlace de WhatsApp */}
        <a 
          href={WHATSAPP_URL} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="icon-link"
          aria-label="WhatsApp"
        >
          <FontAwesomeIcon icon={faWhatsapp} className="social-icon" />
        </a>

        {/* Enlace de Facebook */}
        <a 
          href={FACEBOOK_URL} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="icon-link"
          aria-label="Facebook"
        >
          <FontAwesomeIcon icon={faTiktok} className="social-icon" />
        </a>
      </div>
      
      <p className="copyright">
        &copy; {new Date().getFullYear()} KIKISHN. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;