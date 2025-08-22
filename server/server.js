import express from "express";
import cors from "cors";
import products from "./data/products.js";

import { calculateShipping } from "./services/shippingService.js";
import { calculateDeliveryDate } from "./utils/dateUtils.js";

const app = express();
app.use(cors());
app.use(express.json());

// Dados de usuários (em produção, use um banco de dados)
const users = [
  { id: 1, username: "cliente", password: "senha123", name: "Cliente Teste" },
  { id: 2, username: "joao", password: "123456", name: "João Silva" },
  { id: 3, username: "maria", password: "abcdef", name: "Maria Santos" }
];

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ error: "Token de acesso necessário" });
  }
  
  const user = users.find(u => u.username === token);
  if (!user) {
    return res.status(403).json({ error: "Token inválido" });
  }
  
  req.user = user;
  next();
};

// Array para armazenar pedidos (em produção, use banco de dados)
let orders = [];

// Rota para obter pedidos do usuário
app.get("/api/orders", authenticateToken, (req, res) => {
  try {
    const userOrders = orders.filter(order => 
      order.customer && order.customer.userId === req.user.id
    );
    
    userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(userOrders);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: "Erro interno ao buscar pedidos" });
  }
});

// Rota para obter detalhes de um pedido específico
app.get("/api/orders/:orderId", authenticateToken, (req, res) => {
  try {
    const order = orders.find(order => 
      order.orderId === req.params.orderId && 
      order.customer && 
      order.customer.userId === req.user.id
    );
    
    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ error: "Erro interno ao buscar pedido" });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get("/api/products", (req, res) => {
  const q = (req.query.q || "").toString().toLowerCase();
  const result = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    : products;
  res.json(result);
});

app.get("/api/products/:id", (req, res) => {
  const item = products.find((p) => p.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(item);
});

app.post("/api/shipping", (req, res) => {
  const { cep } = req.body;

  if (!cep || cep.length < 8) {
    return res.status(400).json({ error: "CEP inválido" });
  }

  try {
    const options = calculateShipping(cep);
    const optionsWithDeliveryDate = options.map((option) => ({
      ...option,
      deliveryDate: calculateDeliveryDate(option.deadline),
    }));

    res.json(optionsWithDeliveryDate);
  } catch (error) {
    res.status(500).json({ error: "Erro ao calcular frete" });
  }
});

// Rota de login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username e password são obrigatórios" });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  res.json({
    message: "Login bem-sucedido",
    user: { id: user.id, username: user.username, name: user.name },
    token: user.username, // Em produção use JWT
  });
});

// Rota de checkout que salva pedidos
app.post("/api/checkout", authenticateToken, (req, res) => {
  try {
    const { items, customer, shipping } = req.body || {};
    
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Carrinho vazio" });
    }
    
    const subtotal = items.reduce((sum, it) => {
      const prod = products.find((p) => p.id === it.id);
      if (!prod) return sum;
      const qty = Number(it.qty || 1);
      return sum + prod.price * qty;
    }, 0);

    const shippingCost = shipping ? shipping.cost : 0;
    const total = subtotal + shippingCost;

    const orderId = "ORD-" + Date.now().toString(36).toUpperCase();
    
    const order = {
      orderId,
      status: "PAID",
      subtotal: Number(subtotal.toFixed(2)),
      shipping: shippingCost,
      total: Number(total.toFixed(2)),
      customer: {
        ...customer,
        userId: req.user.id,
        username: req.user.username,
        name: req.user.name
      },
      items: items.map(item => ({
        ...item,
        product: products.find(p => p.id === item.id) || {}
      })),
      shippingMethod: shipping ? shipping.method : null,
      estimatedDelivery: shipping ? shipping.estimatedDelivery : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    orders.push(order);

    if (orders.length > 100) {
      orders = orders.slice(-100);
    }
    
    res.json(order);
    
  } catch (error) {
    console.error('Erro no checkout:', error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Rota para verificar se o usuário está logado
app.get("/api/me", authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      name: req.user.name,
    },
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API rodando em http://localhost:${PORT}`));
