
import { useCart } from '../context/CartContext';
import { Api } from '../services/api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShippingCalculator from '../components/ShippingCalculator';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { items, setQty, remove, clear, total } = useCart();
  const [loading, setLoading] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const hasOutOfStock = items.some(i => i.stock !== undefined && i.stock <= 0);

  // Calcular total geral (produtos + frete)
  const grandTotal = total + (selectedShipping ? selectedShipping.price : 0);

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/cart');
    }
  }, [isAuthenticated, navigate]);

  // Se não estiver autenticado, mostrar carregando
  if (!isAuthenticated) {
    return <div style={{ padding: 24, textAlign: 'center' }}>Carregando...</div>;
  }

  const handleCheckout = async () => {
    if (items.length === 0 || hasOutOfStock) return;
    
    try {
      setLoading(true);
      const checkoutData = {
        items,
        shipping: selectedShipping ? {
          method: selectedShipping.name,
          cost: selectedShipping.price,
          estimatedDelivery: selectedShipping.deliveryDate
        } : null
      };
      
      const response = await Api.checkout(checkoutData);
      clear();
      navigate(`/success?orderId=${response.orderId}&total=${grandTotal.toFixed(2)}`);
    } catch (err) {
      alert('Erro no checkout. Tente novamente.');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Limpar frete se o carrinho ficar vazio
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (items.length === 0) {
      setSelectedShipping(null);
    }
  }, [items]);

  if (items.length === 0) return  <main className="main-content">
                    <h1 className="page-title">Carrinho</h1>
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Seu carrinho está vazio</h2>
                        <p>Parece que você ainda não adicionou nenhum produto ao seu carrinho. Explore nossos produtos tech e encontre itens incríveis para desenvolvedores!</p>
                        <a href="/" className="btn">Ver Produtos</a>
                    </div>
                </main>

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      {/* Cabeçalho com saudação */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>Carrinho de Compras</h2>
        <div style={{ color: '#4a5568' }}>
          Olá, <strong>{user.name}</strong>! | 
          <button 
            onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
              window.location.reload();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#4299e1',
              cursor: 'pointer',
              marginLeft: '8px'
            }}
          >
            Sair
          </button>
        </div>
      </div>

      {/* Lista de itens */}
      <div style={{ marginBottom: 24 }}>
        {items.map((i) => {
          const outOfStock = i.stock !== undefined && i.stock <= 0;
          return (
            <div
              key={i.id}
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                borderBottom: '1px solid #eee',
                padding: '16px 0',
                opacity: outOfStock ? 0.5 : 1
              }}
            >
              <img src={i.image} alt={i.name} width={80} style={{ borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{i.name}</div>
                <div>R$ {i.price.toFixed(2)}</div>
                {outOfStock && <div style={{ color: 'red', fontSize: 14 }}>Produto indisponível</div>}
              </div>
              {!outOfStock ? (
                <input
                  type="number"
                  min={1}
                  max={i.stock ?? 99}
                  value={i.qty}
                  style={{ width: 60, padding: '8px', border: '1px solid #ddd', borderRadius: 4 }}
                  onChange={(e) => setQty(i.id, Number(e.target.value))}
                />
              ) : (
                <span style={{ fontSize: 14 }}>—</span>
              )}
              <button 
                onClick={() => remove(i.id)}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Remover
              </button>
            </div>
          );
        })}
      </div>

      {/* Resumo */}
      <div style={{
        background: '#f8f9fa',
        padding: 20,
        borderRadius: 8,
        marginBottom: 24
      }}>
        <h3 style={{ marginTop: 0, color: 'black' }}>Resumo do Pedido</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: 'black' }}>
          <span>Subtotal:</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: 'black' }}>
          <span>Frete:</span>
          <span>
            {selectedShipping 
              ? `R$ ${selectedShipping.price.toFixed(2)} (${selectedShipping.name})` 
              : 'A calcular'}
          </span>
        </div>
        
        <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid #ddd' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1em', color: 'black' }}>
          <span>Total:</span>
          <span>R$ {grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Calculadora de frete */}
      <div style={{ marginBottom: 24 }}>
        <ShippingCalculator 
          onSelectShipping={setSelectedShipping}
          onLoadingChange={setShippingLoading}
        />
      </div>

      {/* Botão checkout */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleCheckout}
          disabled={loading || hasOutOfStock || shippingLoading || !selectedShipping}
          style={{
            background: hasOutOfStock || !selectedShipping ? '#ccc' : '#28a745',
            color: '#fff',
            padding: '12px 24px',
            border: 'none',
            borderRadius: 6,
            cursor: hasOutOfStock || !selectedShipping ? 'not-allowed' : 'pointer',
            fontSize: '1.1em',
            fontWeight: 'bold',
            minWidth: 180
          }}
        >
          {loading 
            ? 'Processando...' 
            : hasOutOfStock 
              ? 'Itens indisponíveis' 
              : !selectedShipping
                ? 'Selecione o frete'
                : `Finalizar Compra (R$ ${grandTotal.toFixed(2)})`
          }
        </button>
      </div>
    </div>
  );
}
