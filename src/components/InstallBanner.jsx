import { useState, useEffect } from 'react';

function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [dismissed, setDismissed] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setIsInstalled(true);
        }
        setDeferredPrompt(null);
    };

    if (isInstalled || dismissed || !deferredPrompt) return null;

    return (
        <div className="install-banner">
            <div className="install-banner__text">
                <strong>📲 Instalar app</strong>
                Accede rápido desde tu pantalla de inicio
            </div>
            <button className="install-banner__btn" onClick={handleInstall}>
                Instalar
            </button>
            <button className="install-banner__close" onClick={() => setDismissed(true)} aria-label="Cerrar">
                ✕
            </button>
        </div>
    );
}

export default InstallBanner;
