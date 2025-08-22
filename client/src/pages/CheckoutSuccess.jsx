// client/src/pages/CheckoutSuccess.jsx
import { useLocation, Link } from 'react-router-dom';
import { useMemo } from 'react';

export default function CheckoutSuccess() {
  const { search } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const orderId = params.get('orderId');
  const total = params.get('total');

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <h2>Compra aprovada 🎉</h2>
      <p>Pedido <strong>{orderId}</strong> finalizado com sucesso!</p>
      <p>Valor total: <strong>R$ {Number(total || 0).toFixed(2)}</strong></p>
      <Link to="/" style={{ marginTop: 16, display: 'inline-block', textDecoration: 'underline', color: 'white' }}>
        Voltar ao catálogo
      </Link>
    </div>
  );
}
