import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">⚡</span>
          <span className="footer-text">Sạc Vui được tạo ra bởi</span>
          <span className="footer-author">Lê Phúc Hải</span>
        </div>
        <div className="footer-links">
          <span className="footer-year">© 2025</span>
          <span className="footer-separator">•</span>
          <span className="footer-version">v1.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;