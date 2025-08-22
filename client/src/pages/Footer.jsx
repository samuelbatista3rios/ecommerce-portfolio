import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Sobre Nós</h3>
          <p>
            Cartálogo é uma loja especializada em produtos tech para
            desenvolvedores e entusiastas de tecnologia.
          </p>
        </div>

        <div className="footer-section">
          <h3>Links Rápidos</h3>
          <ul className="footer-links">
            <li>
              <a href="/">
                <i className="fas fa-home"></i> Início
              </a>
            </li>
            <li>
              <a href="/">
                <i className="fas fa-box-open"></i> Produtos
              </a>
            </li>
            <li>
              <a href="/cart">
                <i className="fas fa-shopping-cart"></i> Carrinho
              </a>
            </li>
            <li>
              <a href="/login">
                <i className="fas fa-user"></i> Conta
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contato</h3>
          <ul className="footer-links">
            <li>
              <a
                href="https://www.google.com/maps/place/Juiz+de+Fora,+MG"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-map-marker-alt"></i> Juiz de Fora, MG
              </a>
            </li>
            <li>
              <a href="tel:+5524992260913">
                <i className="fas fa-phone"></i> (24) 99226-0913
              </a>
            </li>
            <li>
              <a href="mailto:samuelbatista3rios@gmail.com">
                <i className="fas fa-envelope"></i> samuelbatista3rios@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/samuel-fonseca-0289a6121/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin"></i> LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="copyright">
        © 2025 Cartálogo - Todos os direitos reservados
      </div>
    </footer>
  );
};

export default Footer;
