import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false); // coração marcado

  const handleAddToCart = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 15000);
  };

  const toggleWishlist = () => {
    setLiked(!liked); // apenas marca/desmarca visualmente
    // futuramente você vai adicionar no state global ou context
  };

  const getStockLevelClass = () => {
    if (product.stock > 10) return "stock-high";
    if (product.stock > 5) return "stock-medium";
    return "stock-low";
  };

  const getStockPercentage = () => {
    const maxStock = 50;
    return Math.min(100, (product.stock / maxStock) * 100);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <img src={product.image} alt={product.name} className="product-image" />
      </Link>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">R$ {product.price.toFixed(2)}</div>

        <div className={`product-stock ${getStockLevelClass()}`}>
          <i className="fas fa-box-open"></i> {product.stock} {product.stock === 1 ? 'unidade' : 'unidades'} em estoque
        </div>

        <div className="stock-bar">
          <div className="stock-level" style={{ width: `${getStockPercentage()}%` }}></div>
        </div>

        <div className="product-actions">
          <button
            className={`btn ${added ? "added" : ""}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <i className={added ? "fas fa-check" : "fas fa-cart-plus"}></i>{" "}
            {added ? "Adicionado!" : "Adicionar"}
          </button>

          <button
            className={`btn btn-outline ${liked ? "wishlist-active" : ""}`}
            onClick={toggleWishlist}
          >
            <i className={liked ? "fas fa-heart" : "far fa-heart"}></i>
          </button>
        </div>
      </div>

       
                    
    </div>
  );
}
