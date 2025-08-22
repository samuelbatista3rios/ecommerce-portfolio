import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { add } = useCart(); // função do contexto
  const [added, setAdded] = useState(false); // controle do efeito de adicionado

  const handleAddToCart = () => {
    add(product); // adiciona no carrinho
    setAdded(true); // dispara animação
    setTimeout(() => setAdded(false), 15000); // volta ao normal depois de 15s
  };

  // Determina a classe CSS com base no nível de estoque
  const getStockLevelClass = () => {
    if (product.stock > 10) return "stock-high";
    if (product.stock > 5) return "stock-medium";
    return "stock-low";
  };

  // Calcula a porcentagem para a barra de estoque
  const getStockPercentage = () => {
    const maxStock = 50; // Defina o estoque máximo esperado
    return Math.min(100, (product.stock / maxStock) * 100);
  };

  return (
    <div
      className="product-card"
      style={{
        border: "1px solid #eee",
        borderRadius: 12,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <Link
        to={`/product/${product.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            borderRadius: 8,
            objectFit: "cover",
            aspectRatio: "1 / 1",
          }}
        />
        <h3>{product.name}</h3>
      </Link>
      <p>R$ {product.price.toFixed(2)}</p>

         {/* Informação de estoque */}
      <div className={`stock-info ${getStockLevelClass()}`}>
        <i className="fas fa-box-open"></i>
        <span>{product.stock} {product.stock === 1 ? 'unidade' : 'unidades'} em estoque</span>
      </div>
      <div className="stock-bar">
        <div 
          className="stock-level" 
          style={{ width: `${getStockPercentage()}%` }}
        ></div>
      </div>

      <button
        onClick={handleAddToCart}
        className={`add-to-cart-btn ${added ? "added" : ""}`}
        style={{
          padding: "8px 12px",
          borderRadius: 6,
          border: "none",
          backgroundColor: added ? "#4caf50" : "#007bff",
          color: "#fff",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}

             disabled={product.stock === 0} // Desabilita o botão se não houver estoque
      >
        <i className={added ? "fas fa-check" : "fas fa-cart-plus"}></i>{" "}
        {added ? "Adicionado!" : "Adicionar ao carrinho"}
      </button>
    </div>
  );
}
