import { useState, useMemo, useCallback } from 'react';
import { calculateSimpleInterest, formatCurrency } from './utils/calculate';
import { getHistory, saveCalculation, deleteCalculation, clearHistory } from './utils/storage';
import Calculator from './components/Calculator';
import ResultCard from './components/ResultCard';
import History from './components/History';
import InstallBanner from './components/InstallBanner';
import './App.css';

const DEFAULT_VALUES = {
  price: 120000,
  downPayment: 60000,
  rate: 17,
  years: 4,
};

function App() {
  const [price, setPrice] = useState(DEFAULT_VALUES.price);
  const [downPayment, setDownPayment] = useState(DEFAULT_VALUES.downPayment);
  const [rate, setRate] = useState(DEFAULT_VALUES.rate);
  const [years, setYears] = useState(DEFAULT_VALUES.years);
  const [history, setHistory] = useState(() => getHistory());
  const [showToast, setShowToast] = useState(false);

  // Asegurar que la cuota inicial no supere el precio
  const safeDownPayment = Math.min(downPayment, price);

  const result = useMemo(
    () =>
      calculateSimpleInterest({
        price,
        downPayment: safeDownPayment,
        rate,
        years,
      }),
    [price, safeDownPayment, rate, years]
  );

  const handleSave = useCallback(() => {
    const updated = saveCalculation({
      price,
      downPayment: safeDownPayment,
      rate,
      years,
      ...result,
    });
    setHistory(updated);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }, [price, safeDownPayment, rate, years, result]);

  const handleDelete = useCallback((id) => {
    const updated = deleteCalculation(id);
    setHistory(updated);
  }, []);

  const handleClear = useCallback(() => {
    const updated = clearHistory();
    setHistory(updated);
  }, []);

  return (
    <div className="app">
      <header className="app-header fade-in">
        <span className="app-header__icon">🚗</span>
        <h1 className="app-header__title">Calculadora de Financiamiento</h1>
        <p className="app-header__subtitle">Calcula tu cuota mensual al instante</p>
      </header>

      <InstallBanner />

      <Calculator
        price={price}
        downPayment={safeDownPayment}
        rate={rate}
        years={years}
        onPriceChange={setPrice}
        onDownPaymentChange={setDownPayment}
        onRateChange={setRate}
        onYearsChange={setYears}
      />

      <ResultCard result={result} onSave={handleSave} />

      {history.length > 0 && (
        <>
          <div className="section-divider">
            <span className="section-divider__text">Historial</span>
          </div>
          <History
            items={history}
            onDelete={handleDelete}
            onClear={handleClear}
          />
        </>
      )}

      <div className={`toast ${showToast ? 'toast--visible' : ''}`}>
        ✅ Cálculo guardado
      </div>
    </div>
  );
}

export default App;
