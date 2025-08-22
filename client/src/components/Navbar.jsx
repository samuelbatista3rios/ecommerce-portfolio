// components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { count } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav
      className="navbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        borderBottom: '1px solid #eee',
      }}
    >
      {/* Logo */}
      <div
        className="logo"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <i className="fas fa-shopping-cart"></i>
        <span>Cartálogo</span>
      </div>

      {/* Links principais */}
      <div
        className="nav-links"
        style={{
          display: 'flex',
          gap: '16px',
          marginLeft: 'auto',
          alignItems: 'center',
        }}
      >
        <Link to="/" className="nav-link">
          <i className="fas fa-home"></i> Início
        </Link>
        <Link to="/" className="nav-link">
          <i className="fas fa-shopping-bag"></i> Produtos
        </Link>
        <Link to="/cart" className="nav-link">
          <i className="fas fa-shopping-cart"></i> Carrinho{' '}
          <span className="cart-count">{count}</span>
        </Link>

        {/* Se logado */}
        {isAuthenticated ? (
          <>
            <span>Olá, {user?.name}</span>
            <button
              onClick={logout}
              style={{
                background: 'none',
                border: '1px solid #ddd',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Sair
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-link">
            <i className="fas fa-user"></i> Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}
