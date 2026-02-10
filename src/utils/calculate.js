/**
 * Calcula cuotas mensuales usando interés simple
 * @param {Object} params
 * @param {number} params.price - Precio del vehículo (Bs)
 * @param {number} params.downPayment - Cuota inicial (Bs)
 * @param {number} params.rate - Tasa de interés anual (%)
 * @param {number} params.years - Plazo en años
 * @returns {Object} Resultado del cálculo
 */
export function calculateSimpleInterest({ price, downPayment, rate, years }) {
  const financedAmount = price - downPayment;
  const totalInterest = financedAmount * (rate / 100) * years;
  const totalPayment = financedAmount + totalInterest;
  const months = years * 12;
  const monthlyPayment = months > 0 ? totalPayment / months : 0;

  return {
    financedAmount: Math.round(financedAmount * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    months,
  };
}

/**
 * Formatea un número como moneda boliviana
 * @param {number} value
 * @returns {string}
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}
