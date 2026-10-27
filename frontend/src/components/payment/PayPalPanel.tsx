// ── PayPalPanel ───────────────────────────────────────────────────────────────
// Panel de pago con PayPal, actualmente simulado.
// Al pulsar el botón se espera 1.8s (simula la redirección a PayPal) y luego
// activa la pantalla de éxito. Cuando se integre PayPal SDK real, solo hay que
// reemplazar el setTimeout por el flujo de PayPal JS SDK aquí.

interface PayPalPanelProps {
    planPrice: string;
    loading: boolean;
    onPayPal: () => void;
}

const SECURITY_BADGES = ["🔒 SSL 256-bit", "✓ PCI Compliant", "🛡 3D Secure"];

export default function PayPalPanel({ planPrice, loading, onPayPal }: PayPalPanelProps) {
    return (
        <>
            {/* Bloque informativo con logo y descripción */}
            <div className="pgw-paypal-info">
                <div className="pgw-paypal-logo">🅿</div>
                <p className="font-cinzel pgw-paypal-title">
                    Paga de forma segura con PayPal
                </p>
                <p className="font-cinzel pgw-paypal-desc">
                    Serás redirigido a PayPal para completar tu pago de{" "}
                    <strong>{planPrice}</strong>
                </p>
            </div>

            {/* Total */}
            <div className="pgw-total-row">
                <span className="font-cinzel pgw-total-label">TOTAL A COBRAR HOY</span>
                <span className="font-cinzel pgw-total-amount">{planPrice}</span>
            </div>

            {/* Botón de PayPal — azul corporativo definido en payment-gateway.css */}
            <button
                className={`pgw-paypal-btn${loading ? " loading" : ""}`}
                onClick={onPayPal}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <span className="spinner pgw-spinner--blue" />
                        Conectando con PayPal…
                    </>
                ) : (
                    <>
                        <span className="pgw-paypal-wordmark">
                            <span className="pgw-paypal-pay">Pay</span>
                            <span className="pgw-paypal-pal">Pal</span>
                        </span>
                        <span className="font-cinzel pgw-paypal-price">· {planPrice}</span>
                    </>
                )}
            </button>

            {/* Badges de seguridad */}
            <div className="pgw-security-row">
                {SECURITY_BADGES.map((b) => (
                    <div key={b} className="security-badge">{b}</div>
                ))}
            </div>
        </>
    );
}