// Calcula data de entrega considerando dias úteis

export const calculateDeliveryDate = (deadline) => {
  const today = new Date();
  let daysAdded = 0;
  let deliveryDate = new Date(today);
  
  while (daysAdded < deadline) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    
    // Verifica se é dia útil (segunda a sexta)
    if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
      daysAdded++;
    }
  }
  
  // Formata a data para exibição
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  return deliveryDate.toLocaleDateString('pt-BR', options);
};