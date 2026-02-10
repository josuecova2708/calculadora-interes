import { formatCurrency } from '../utils/calculate';

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-BO', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function History({ items, onDelete, onClear }) {
    return (
        <div className="fade-in">
            <div className="history-header">
                <div className="history-header__title">
                    📋 Guardados
                    <span className="history-header__count">{items.length}</span>
                </div>
                <button className="btn btn--danger" onClick={onClear} id="clear-history-btn">
                    🗑 Limpiar todo
                </button>
            </div>

            <div className="history-list">
                {items.map((item) => (
                    <div key={item.id} className="history-item">
                        <div className="history-item__info">
                            <div className="history-item__date">{formatDate(item.timestamp)}</div>
                            <div className="history-item__amount">
                                Bs {formatCurrency(item.monthlyPayment)}/mes
                            </div>
                            <div className="history-item__details">
                                Precio: Bs {formatCurrency(item.price)} · Inicial: Bs{' '}
                                {formatCurrency(item.downPayment)} · {item.rate}% · {item.years}{' '}
                                {item.years === 1 ? 'año' : 'años'}
                            </div>
                        </div>
                        <button
                            className="history-item__delete"
                            onClick={() => onDelete(item.id)}
                            aria-label="Eliminar"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default History;
