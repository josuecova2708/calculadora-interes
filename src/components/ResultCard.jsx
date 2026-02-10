import { useState } from 'react';
import { formatCurrency } from '../utils/calculate';

function ResultCard({ result, onSave, onShare }) {
    const { financedAmount, totalInterest, totalPayment, monthlyPayment, months } = result;
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="glass-card result-card fade-in">
            <div className="result-main">
                <div className="result-main__label">Cuota mensual</div>
                <div className="result-main__amount">
                    Bs {formatCurrency(monthlyPayment)}
                </div>
                <div className="result-main__period">
                    durante {months} meses
                </div>
            </div>

            <button
                className="btn btn--ghost details-toggle"
                onClick={() => setShowDetails(!showDetails)}
                id="toggle-details-btn"
            >
                {showDetails ? '▲ Ocultar detalles' : '▼ Ver más detalles'}
            </button>

            {showDetails && (
                <div className="result-details result-details--animated">
                    <div className="result-detail">
                        <div className="result-detail__label">Financiado</div>
                        <div className="result-detail__value">Bs {formatCurrency(financedAmount)}</div>
                    </div>
                    <div className="result-detail">
                        <div className="result-detail__label">Interés total</div>
                        <div className="result-detail__value">Bs {formatCurrency(totalInterest)}</div>
                    </div>
                    <div className="result-detail">
                        <div className="result-detail__label">Total a pagar</div>
                        <div className="result-detail__value">Bs {formatCurrency(totalPayment)}</div>
                    </div>
                    <div className="result-detail">
                        <div className="result-detail__label">N° de cuotas</div>
                        <div className="result-detail__value">{months}</div>
                    </div>
                </div>
            )}

            <div className="result-actions">
                <button className="btn btn--primary" onClick={onSave} id="save-btn">
                    💾 Guardar
                </button>
                <button className="btn btn--primary btn--share" onClick={onShare} id="share-btn">
                    📤 Compartir
                </button>
            </div>
        </div>
    );
}

export default ResultCard;
