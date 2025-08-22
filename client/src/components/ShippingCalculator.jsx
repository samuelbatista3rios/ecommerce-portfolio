// components/ShippingCalculator.jsx
import React, { useState } from 'react';
import { Api } from '../services/api';

const ShippingCalculator = ({ onSelectShipping, onLoadingChange }) => {
  const [cep, setCep] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleCalculateShipping = async () => {
    // Validação básica do CEP
    const rawCep = cep.replace(/\D/g, '');
    if (!rawCep || rawCep.length < 8) {
      setError('Por favor, digite um CEP válido com 8 dígitos.');
      return;
    }
    
    setLoading(true);
    setError('');
    if (onLoadingChange) onLoadingChange(true);
    
    try {
      // Chama a API para calcular o frete
      const options = await Api.calculateShipping(rawCep);
      setShippingOptions(options);
    } catch (err) {
      setError('Erro ao calcular frete. Tente novamente.');
      console.error('Shipping calculation error:', err);
    } finally {
      setLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    }
  };
  
  const handleSelectOption = (option) => {
    setSelectedOption(option);
    
    // Envia a opção selecionada para o componente pai
    if (onSelectShipping) {
      onSelectShipping(option);
    }
  };
  
  // Formata o CEP enquanto o usuário digita
  const handleCepChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      let formattedCep = value;
      if (value.length > 5) {
        formattedCep = value.replace(/^(\d{5})(\d)/, '$1-$2');
      }
      setCep(formattedCep);
    }
  };

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '20px',
      background: '#f7fafc',
      marginBottom: '20px'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px', color: 'black' }}>Calcular Frete</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="cep" style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: 'black' }}>
          Digite seu CEP:
        </label>
        <input
          type="text"
          id="cep"
          value={cep}
          onChange={handleCepChange}
          placeholder="Ex: 01001-000"
          maxLength="9"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #cbd5e0',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
      </div>
      
      {error && (
        <div style={{
          color: '#e53e3e',
          margin: '10px 0',
          padding: '8px',
          background: '#fed7d7',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
      
      <button 
        onClick={handleCalculateShipping}
        disabled={loading}
        style={{
          background: '#4299e1',
          color: 'white',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Calculando...' : 'Calcular Frete'}
      </button>
      
      {shippingOptions.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>Opções de Entrega</h4>
          {shippingOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelectOption(option)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '15px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                marginBottom: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: selectedOption === option ? '#ebf4ff' : 'white',
                borderColor: selectedOption === option ? '#4299e1' : '#e2e8f0'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: '#2d3748' }}>{option.name}</div>
                <div style={{ fontSize: '0.9rem', color: '#718096', margin: '5px 0' }}>
                  {option.description}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#38a169', fontWeight: '500' }}>
                  Previsão de entrega: {option.deliveryDate}
                </div>
              </div>
              <div style={{ fontWeight: '600', color: '#2d3748', display: 'flex', alignItems: 'center' }}>
                R$ {option.price.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShippingCalculator;