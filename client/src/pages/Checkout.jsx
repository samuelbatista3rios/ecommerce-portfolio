import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();

  const handleFinishPurchase = async () => {
    try {
      // Aqui você chamaria a API real para processar o pagamento
      await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      clear(); // limpa carrinho
      navigate("/checkout/success"); // redireciona para página de sucesso
    } catch (err) {
      console.error("Erro no checkout:", err);
    }
  };

  return (
    <div>
      <h1>Finalizar Compra</h1>
      {items.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                {item.name} - {item.qty} x R$ {item.price}
              </li>
            ))}
          </ul>
          <p>Total: R$ {total}</p>
          <button onClick={handleFinishPurchase}>Finalizar Compra</button>
        </>
      )}
    </div>
  );
}
