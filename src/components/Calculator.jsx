import { formatCurrency } from '../utils/calculate';

const YEAR_OPTIONS = [1, 2, 3, 4, 5];

const MAX_PRICE = 500000;
const MAX_DOWN_PAYMENT_RATIO = 0.95;

function Calculator({
    price,
    downPayment,
    rate,
    years,
    onPriceChange,
    onDownPaymentChange,
    onRateChange,
    onYearsChange,
}) {
    const maxDownPayment = Math.floor(price * MAX_DOWN_PAYMENT_RATIO);

    const handlePriceInput = (e) => {
        const val = e.target.value.replace(/\D/g, '');
        onPriceChange(Number(val) || 0);
    };

    const handleDownPaymentInput = (e) => {
        const val = e.target.value.replace(/\D/g, '');
        onDownPaymentChange(Math.min(Number(val) || 0, maxDownPayment));
    };

    const handleRateInput = (e) => {
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val >= 0 && val <= 100) {
            onRateChange(val);
        } else if (e.target.value === '') {
            onRateChange(0);
        }
    };

    return (
        <div className="glass-card fade-in">
            {/* Precio del vehículo */}
            <div className="form-group">
                <label className="form-label">
                    <span>Precio del vehículo</span>
                    <span className="form-label__value">Bs {formatCurrency(price)}</span>
                </label>
                <input
                    type="range"
                    className="range-slider"
                    min="10000"
                    max={MAX_PRICE}
                    step="5000"
                    value={price}
                    onChange={(e) => onPriceChange(Number(e.target.value))}
                    id="price-slider"
                />
                <div className="input-wrapper" style={{ marginTop: '8px' }}>
                    <span className="input-prefix">Bs</span>
                    <input
                        type="text"
                        className="form-input form-input--with-prefix"
                        inputMode="numeric"
                        value={price || ''}
                        onChange={handlePriceInput}
                        placeholder="120000"
                        id="price-input"
                    />
                </div>
            </div>

            {/* Cuota inicial */}
            <div className="form-group">
                <label className="form-label">
                    <span>Cuota inicial</span>
                    <span className="form-label__value">Bs {formatCurrency(downPayment)}</span>
                </label>
                <input
                    type="range"
                    className="range-slider"
                    min="0"
                    max={maxDownPayment}
                    step="5000"
                    value={downPayment}
                    onChange={(e) => onDownPaymentChange(Number(e.target.value))}
                    id="downpayment-slider"
                />
                <div className="input-wrapper" style={{ marginTop: '8px' }}>
                    <span className="input-prefix">Bs</span>
                    <input
                        type="text"
                        className="form-input form-input--with-prefix"
                        inputMode="numeric"
                        value={downPayment || ''}
                        onChange={handleDownPaymentInput}
                        placeholder="60000"
                        id="downpayment-input"
                    />
                </div>
            </div>

            {/* Tasa de interés */}
            <div className="form-group">
                <label className="form-label">
                    <span>Interés anual</span>
                </label>
                <div className="input-wrapper">
                    <input
                        type="number"
                        className="form-input form-input--with-suffix"
                        value={rate}
                        onChange={handleRateInput}
                        min="0"
                        max="100"
                        step="0.5"
                        inputMode="decimal"
                        id="rate-input"
                    />
                    <span className="input-suffix">%</span>
                </div>
            </div>

            {/* Plazo en años */}
            <div className="form-group">
                <label className="form-label">
                    <span>Plazo</span>
                </label>
                <div className="year-selector">
                    {YEAR_OPTIONS.map((y) => (
                        <button
                            key={y}
                            className={`year-pill ${years === y ? 'year-pill--active' : ''}`}
                            onClick={() => onYearsChange(y)}
                            id={`year-btn-${y}`}
                        >
                            {y} {y === 1 ? 'año' : 'años'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Calculator;
