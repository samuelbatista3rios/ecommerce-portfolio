/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Api } from '../services/api';

export default function OrderDetail() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { orderId } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadOrder();
  }, [orderId, isAuthenticated, navigate]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const orderData = await Api.getOrder(orderId);
      setOrder(orderData);
    } catch (err) {
      setError('Erro ao carregar detalhes do pedido');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) return null;

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/orders')}
        style={{
          background: 'none',
          border: 'none',
          color: '#4299e1',
          cursor: 'pointer',
          marginBottom: 20,
          fontSize: '16px'
        }}
      >
        ← Voltar para meus pedidos
      </button>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p>Carregando detalhes do pedido...</p>
        </div>
      ) : error ? (
        <div style={{
          color: '#e53e3e',
          background: '#fed7d7',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      ) : order ? (
        <div>
          <h2>Detalhes do Pedido #{order.orderId}</h2>
          
          <div style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '24px'
          }}>
          </div>
        </div>
      ) : null}
    </div>
  );
}