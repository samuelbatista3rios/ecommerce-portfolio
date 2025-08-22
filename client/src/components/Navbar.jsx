// components/Navbar.jsx
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { count } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <div className="logo">
          
          <Link to="/">
          <i className="fas fa-laptop-code"></i>Cartálogo
          </Link>
          
        </div>

        {/* Navegação */}
        <nav className="nav">
          <ul>
            <li>
              <Link to="/">
                <i className="fas fa-home"></i> Início
              </Link>
            </li>
            <li>
              <Link to="/">
                <i className="fas fa-box-open"></i> Produtos
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/cart" className="cart-icon">
                    <i className="fas fa-shopping-cart"></i> Carrinho{" "}
                    <span className="cart-count">{count}</span>
                  </Link>
                </li>
                <li>
                  <span>
                    <i className="fas fa-user"></i> Olá, {user?.name}
                  </span>
                </li>
                <li>
                  <button onClick={logout} className="logout-btn">
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">
                  <i className="fas fa-user"></i> Entrar
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
