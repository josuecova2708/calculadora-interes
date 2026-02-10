const STORAGE_KEY = 'calculadora-financiamiento-historial';

/**
 * Obtiene el historial de cálculos guardados
 * @returns {Array} Lista de cálculos
 */
export function getHistory() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

/**
 * Guarda un cálculo en el historial
 * @param {Object} calculation - Datos del cálculo
 * @returns {Array} Historial actualizado
 */
export function saveCalculation(calculation) {
    const history = getHistory();
    const entry = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        timestamp: new Date().toISOString(),
        ...calculation,
    };
    history.unshift(entry);
    // Mantener máximo 50 entradas
    if (history.length > 50) history.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return history;
}

/**
 * Elimina un cálculo del historial por ID
 * @param {string} id
 * @returns {Array} Historial actualizado
 */
export function deleteCalculation(id) {
    const history = getHistory().filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    return history;
}

/**
 * Limpia todo el historial
 * @returns {Array} Array vacío
 */
export function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    return [];
}
