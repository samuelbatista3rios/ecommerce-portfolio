// client/src/pages/ProductDetail.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Api } from '../services/api';
import { useCart } from '../context/CartContext';
import ShippingCalculator from '../components/ShippingCalculator'; // import do componente de frete

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [selectedShipping, setSelectedShipping] = useState(null); // estado do frete

  useEffect(() => {
    setLoading(true);
    Api.product(id)
      .then((data) => {
        setProduct(data);
        setError(null);
      })
      .catch(() => setError('Produto não encontrado'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ padding: 24 }}>Carregando...</p>;
  if (error) return <p style={{ padding: 24, color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: '100%', borderRadius: 12, objectFit: 'cover', aspectRatio: '1 / 1' }}
      />
      <div>
        <h2>{product.name}</h2>
        <p style={{ opacity: 0.8 }}>{product.description}</p>
        <p style={{ fontSize: 24, fontWeight: 600 }}>R$ {product.price.toFixed(2)}</p>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
          <label>Qtd:</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            style={{ width: 60 }}
          />
        </div>

        <button
          style={{ marginTop: 12, padding: '8px 16px', cursor: 'pointer' }}
          onClick={() => add(product, qty)}
        >
          Adicionar ao carrinho
        </button>

      </div>
    </div>
  );
}
