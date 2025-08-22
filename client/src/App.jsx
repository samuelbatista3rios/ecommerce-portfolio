import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import Footer from "./pages/Footer";
import LoginPage from "./pages/LoginPage";
import OrderHistory from "./pages/OrderHistory";
import OrderDetail from "./pages/OrderDetail";
import ParallaxBackground from "./pages/ParallaxBackground";


// Componente protegido
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>Carregando...</div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Componente para redirecionar se já estiver autenticado
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>Carregando...</div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <ParallaxBackground /> 
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/success" element={<CheckoutSuccess />} />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrderHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:orderId"
                element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
