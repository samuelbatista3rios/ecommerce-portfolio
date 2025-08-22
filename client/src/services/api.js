// services/api.js
const API_BASE = import.meta.env.VITE_API_BASE || "";

async function http(path, options) {
  const token = localStorage.getItem("authToken");
  const headers = { "Content-Type": "application/json" };
  
  if (token) {
    headers["Authorization"] = token;
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
  
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
  getProfile: () => http("/api/me"),
  checkout: (payload) =>
    http("/api/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};