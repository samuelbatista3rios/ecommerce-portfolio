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

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  console.log('Token recebido:', token); // Debug
  
  if (!token) {
    return res.status(401).json({ error: "Token de acesso necessário" });
  }
  
  // Verifica se o token é válido (em produção, use JWT ou sessões)
  const user = users.find(u => u.username === token);
  if (!user) {
    return res.status(403).json({ error: "Token inválido" });
  }
  
  req.user = user;
  next();
};

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

    // Adiciona a data de entrega estimada para cada opção
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

  // Em produção, gere um token JWT aqui
  res.json({
    message: "Login bem-sucedido",
    user: { id: user.id, username: user.username, name: user.name },
    token: user.username, // Simples demo - em produção use JWT
  });
});

// Rota de checkout protegida - CORRIGIDA
app.post("/api/checkout", authenticateToken, (req, res) => {
  try {
    const { items, customer, shipping } = req.body || {};
    const user = req.user; // Agora isso deve funcionar
    
    console.log('Checkout request from user:', user); // Debug
    
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Carrinho vazio" });
    }
    
    // Calcula total a partir dos IDs do carrinho
    const subtotal = items.reduce((sum, it) => {
      const prod = products.find((p) => p.id === it.id);
      if (!prod) return sum;
      const qty = Number(it.qty || 1);
      return sum + prod.price * qty;
    }, 0);

    // Adiciona o custo de frete se existir
    const shippingCost = shipping ? shipping.cost : 0;
    const total = subtotal + shippingCost;

    const orderId = "ORD-" + Date.now().toString(36).toUpperCase();
    
    // Resposta de sucesso
    return res.json({
      orderId,
      status: "PAID",
      subtotal: Number(subtotal.toFixed(2)),
      shipping: shippingCost,
      total: Number(total.toFixed(2)),
      customer: {
        ...customer,
        userId: user.id, // Agora user está definido
        username: user.username
      },
      shippingMethod: shipping ? shipping.method : null,
      estimatedDelivery: shipping ? shipping.estimatedDelivery : null
    });
    
  } catch (error) {
    console.error('Erro no checkout:', error);
    return res.status(500).json({ error: "Erro interno no servidor" });
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
