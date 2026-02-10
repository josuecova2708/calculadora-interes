import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { formatCurrency } from '../utils/calculate';

function ShareModal({ result, inputs, onClose }) {
    const [vehicleName, setVehicleName] = useState('');
    const [step, setStep] = useState('name'); // 'name' | 'preview' | 'generating'
    const quoteRef = useRef(null);

    const { financedAmount, totalInterest, totalPayment, monthlyPayment, months } = result;
    const { price, downPayment, rate, years } = inputs;

    const today = new Date().toLocaleDateString('es-BO', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    const handleContinue = () => {
        if (vehicleName.trim()) {
            setStep('preview');
        }
    };

    const captureQuote = async () => {
        if (!quoteRef.current) return null;
        const canvas = await html2canvas(quoteRef.current, {
            backgroundColor: '#0f0f2a',
            scale: 2,
            useCORS: true,
            logging: false,
        });
        return canvas;
    };

    const handleShareImage = async () => {
        setStep('generating');
        try {
            const canvas = await captureQuote();
            if (!canvas) return;

            canvas.toBlob(async (blob) => {
                const file = new File([blob], `cotizacion-${vehicleName.replace(/\s+/g, '-').toLowerCase()}.png`, {
                    type: 'image/png',
                });

                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            title: `Cotización - ${vehicleName}`,
                            text: `Cotización de financiamiento para ${vehicleName}`,
                            files: [file],
                        });
                    } catch (err) {
                        if (err.name !== 'AbortError') {
                            // Fallback: download
                            downloadBlob(blob, file.name);
                        }
                    }
                } else {
                    // Fallback: download
                    downloadBlob(blob, file.name);
                }
                setStep('preview');
            }, 'image/png');
        } catch {
            setStep('preview');
        }
    };

    const handleDownloadPDF = async () => {
        setStep('generating');
        try {
            const canvas = await captureQuote();
            if (!canvas) return;

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // A4-ish proportions, but sized to content
            const pdfWidth = 210; // mm (A4)
            const pdfImgWidth = pdfWidth - 30; // margins
            const pdfImgHeight = (imgHeight / imgWidth) * pdfImgWidth;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            // Center the image
            const xOffset = (pdfWidth - pdfImgWidth) / 2;
            const yOffset = 15;

            pdf.addImage(imgData, 'PNG', xOffset, yOffset, pdfImgWidth, pdfImgHeight);
            pdf.save(`cotizacion-${vehicleName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
        } catch (err) {
            console.error('Error generating PDF:', err);
        }
        setStep('preview');
    };

    const downloadBlob = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal__close" onClick={onClose} aria-label="Cerrar">✕</button>

                {step === 'name' && (
                    <div className="modal__step fade-in">
                        <div className="modal__icon">🚗</div>
                        <h2 className="modal__title">Compartir cotización</h2>
                        <p className="modal__subtitle">Ingresa el nombre del vehículo</p>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Ej: Toyota Corolla 2024"
                            value={vehicleName}
                            onChange={(e) => setVehicleName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                            autoFocus
                            id="vehicle-name-input"
                        />
                        <button
                            className="btn btn--primary"
                            onClick={handleContinue}
                            disabled={!vehicleName.trim()}
                            id="continue-share-btn"
                        >
                            Continuar →
                        </button>
                    </div>
                )}

                {(step === 'preview' || step === 'generating') && (
                    <div className="modal__step fade-in">
                        {/* Renderable quote card */}
                        <div className="quote-card-wrapper">
                            <div className="quote-card" ref={quoteRef}>
                                <div className="quote-card__header">
                                    <div className="quote-card__logo">🚗</div>
                                    <div className="quote-card__header-text">
                                        <div className="quote-card__title">Cotización de Financiamiento</div>
                                        <div className="quote-card__date">{today}</div>
                                    </div>
                                </div>

                                <div className="quote-card__vehicle">
                                    {vehicleName}
                                </div>

                                <div className="quote-card__highlight">
                                    <div className="quote-card__highlight-label">Cuota mensual</div>
                                    <div className="quote-card__highlight-amount">Bs {formatCurrency(monthlyPayment)}</div>
                                    <div className="quote-card__highlight-period">durante {months} meses ({years} {years === 1 ? 'año' : 'años'})</div>
                                </div>

                                <div className="quote-card__details">
                                    <div className="quote-card__row">
                                        <span>Precio del vehículo</span>
                                        <span>Bs {formatCurrency(price)}</span>
                                    </div>
                                    <div className="quote-card__row">
                                        <span>Cuota inicial</span>
                                        <span>Bs {formatCurrency(downPayment)}</span>
                                    </div>
                                    <div className="quote-card__row">
                                        <span>Monto financiado</span>
                                        <span>Bs {formatCurrency(financedAmount)}</span>
                                    </div>
                                    <div className="quote-card__row">
                                        <span>Tasa de interés anual</span>
                                        <span>{rate}%</span>
                                    </div>
                                </div>

                                <div className="quote-card__footer">
                                    * Cotización referencial con interés simple
                                </div>
                            </div>
                        </div>

                        {/* Share actions */}
                        <div className="share-actions">
                            <button
                                className="btn btn--primary share-btn"
                                onClick={handleShareImage}
                                disabled={step === 'generating'}
                                id="share-image-btn"
                            >
                                {step === 'generating' ? '⏳ Generando...' : '📤 Compartir imagen'}
                            </button>
                            <button
                                className="btn btn--ghost share-btn"
                                onClick={handleDownloadPDF}
                                disabled={step === 'generating'}
                                id="download-pdf-btn"
                            >
                                📄 Descargar PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ShareModal;
