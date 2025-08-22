import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Sobre Nós</h3>
          <p>Catálogo é uma loja de teste especializada em produtos tech para desenvolvedores e entusiastas de tecnologia.</p>
        </div>
        
        <div className="footer-section">
          <h3>Links Rápidos</h3>
          <ul className="footer-links">
            <li><a href="/"><i className="fas fa-chevron-right"></i> Início</a></li>
            <li><a href="/products"><i className="fas fa-chevron-right"></i> Produtos</a></li>
            <li><a href="/cart"><i className="fas fa-chevron-right"></i> Carrinho</a></li>
            <li><a href="/account"><i className="fas fa-chevron-right"></i> Conta</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contato</h3>
          <ul className="footer-links">
            <li><a href="#"><i className="fas fa-map-marker-alt"></i> Juiz de Fora, Mg</a></li>
            <li><a href="#"><i className="fas fa-phone"></i> (24) 99226-0913</a></li>
            <li><a href="#"><i className="fas fa-envelope"></i> samuelbatista3rops@gmail.com</a></li>
          </ul>
        </div>
      </div>
      
      <div className="copyright">
        <p>&copy; 2025 Catálogo - Todos os direitos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;