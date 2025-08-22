const API_BASE = import.meta.env.VITE_API_BASE || '';

export const ShippingApi = {
  calculate: (cep) => {
    return fetch(`${API_BASE}/api/shipping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cep }),
    })
    .then(response => {
      if (!response.ok) throw new Error('Erro ao calcular frete');
      return response.json();
    });
  }
};