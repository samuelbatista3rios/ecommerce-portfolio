// pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Erro ao fazer login');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '30px',
        border: '1px solid #141414',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        background: 'white'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color:'#141414' }}>
          Entrar na Minha Conta
        </h2>
        
        {error && (
          <div style={{
            color: '#e53e3e',
            background: '#fed7d7',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color:'#141414' }}>
              Nome de usuário:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #141414',  
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontWeight: '500',color:'#141414' }}>
              Senha:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #cbd5e0',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: '#4299e1',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center', color: '#718096' }}>
          <p>Não tem uma conta? Use estas credenciais de teste:</p>
          <div style={{ background: '#f7fafc', padding: '12px', borderRadius: '6px', marginTop: '8px' }}>
            <p><strong>Usuário:</strong> cliente</p>
            <p><strong>Senha:</strong> senha123</p>
          </div>
        </div>
      </div>
    </div>
  );
}