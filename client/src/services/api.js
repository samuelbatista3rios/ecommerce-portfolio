// services/api.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000"; 
// no dev local, usa localhost; em produção, usa a URL do backend via VITE_API_BASE

async function http(path, options = {}) {
  const token = localStorage.getItem("authToken");
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`; // adiciona Bearer se estiver usando JWT
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    ...options,
  });

  if (res.status === 401 || res.status === 403) {
    // Token inválido ou expirado
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Não autorizado");
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }

  return res.json();
}

export const Api = {
  products: () => http("/api/products"),
  product: (id) => http(`/api/products/${id}`),
  calculateShipping: (cep) =>
    http("/api/shipping", {
      method: "POST",
      body: JSON.stringify({ cep }),
    }),
  login: (credentials) =>
    http("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  getOrders: () => http("/api/orders"),
  getOrder: (orderId) => http(`/api/orders/${orderId}`),
  getProfile: () => http("/api/me"),
  checkout: (payload) =>
    http("/api/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
