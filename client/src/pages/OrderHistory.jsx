/* eslint-disable no-unused-vars */
// pages/OrderHistory.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadOrders();
  }, [isAuthenticated, navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await Api.getOrders();
      setOrders(userOrders);
    } catch (err) {
      setError('Erro ao carregar histórico de pedidos');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return '#38a169';
      case 'SHIPPED': return '#3182ce';
      case 'DELIVERED': return '#805ad5';
      case 'CANCELLED': return '#e53e3e';
      default: return '#718096';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Meus Pedidos</h2>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: '#4299e1',
            color: 'white',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Continuar Comprando
        </button>
      </div>

      {error && (
        <div style={{
          color: '#e53e3e',
          background: '#fed7d7',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p>Carregando seus pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#718096' }}>
          <h3>Nenhum pedido encontrado</h3>
          <p>Você ainda não fez nenhum pedido em nossa loja.</p>
          <button 
            onClick={() => navigate('/')}
            style={{
              background: '#4299e1',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: 16
            }}
          >
            Fazer minha primeira compra
          </button>
        </div>
      ) : (
        <div>
          {orders.map((order) => (
            <div
              key={order.orderId}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '16px',
                background: 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: 0, color: '#2d3748' }}>Pedido #{order.orderId}</h3>
                  <p style={{ margin: '4px 0', color: '#718096', fontSize: '14px' }}>
                    Realizado em: {formatDate(order.createdAt)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      background: getStatusColor(order.status),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {order.status === 'PAID' ? 'PAGO' : 
                     order.status === 'SHIPPED' ? 'ENVIADO' :
                     order.status === 'DELIVERED' ? 'ENTREGUE' :
                     order.status === 'CANCELLED' ? 'CANCELADO' : order.status}
                  </span>
                  <p style={{ margin: '4px 0', fontWeight: 'bold', color: '#2d3748' }}>
                    R$ {order.total.toFixed(2)}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#4a5568' }}>Itens do Pedido</h4>
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #f7fafc'
                    }}
                  >
                    <img
                      src={item.image || item.product?.image}
                      alt={item.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '4px',
                        objectFit: 'cover',
                        marginRight: '12px'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: '500' }}>{item.name}</p>
                      <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>
                        Quantidade: {item.qty} × R$ {item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {order.shippingMethod && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#4a5568' }}>
                    <strong>Entrega:</strong> {order.shippingMethod}
                    {order.estimatedDelivery && ` - ${order.estimatedDelivery}`}
                  </p>
                </div>
              )}

              <button
                onClick={() => navigate(`/orders/${order.orderId}`)}
                style={{
                  background: 'transparent',
                  color: '#4299e1',
                  border: '1px solid #4299e1',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Ver detalhes do pedido
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}