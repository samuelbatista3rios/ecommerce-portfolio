// Simula cálculo de frete baseado na região do CEP
export const calculateShipping = (cep) => {
  const region = parseInt(cep.charAt(0));
  
  const options = [
    {
      name: "Entrega Econômica",
      price: region <= 2 ? 15.90 : region <= 4 ? 18.90 : 21.90,
      deadline: region <= 2 ? 7 : region <= 4 ? 9 : 12,
      description: "Entrega em até 12 dias úteis"
    },
    {
      name: "Entrega Padrão",
      price: region <= 2 ? 22.90 : region <= 4 ? 25.90 : 28.90,
      deadline: region <= 2 ? 5 : region <= 4 ? 7 : 9,
      description: "Entrega em até 9 dias úteis"
    },
    {
      name: "Entrega Expressa",
      price: region <= 2 ? 34.90 : region <= 4 ? 39.90 : 44.90,
      deadline: region <= 2 ? 3 : region <= 4 ? 4 : 5,
      description: "Entrega em até 5 dias úteis"
    }
  ];
  
  return options;
};