// ── PaymentHeader ─────────────────────────────────────────────────────────────
// Cabecera fija del modal de pago.
// Muestra el título, subtítulo de seguridad y el botón de cerrar.

interface PaymentHeaderProps {
    onClose: () => void;
}

export default function PaymentHeader({ onClose }: PaymentHeaderProps) {
    return (
        <div className="pgw-header">
            <button
                className="pgw-close"
                onClick={onClose}
                aria-label="Cerrar modal de pago"
            >
                ✕
            </button>

            <div className="pgw-header-content">
                <span className="pgw-header-icon">🔮</span>
                <div>
                    <h2 className="pgw-header-title">Pasarela del Grimorio</h2>
                    <p className="pgw-header-subtitle">PAGO SEGURO · ENCRIPTADO</p>
                </div>
            </div>
        </div>
    );
}