// ── PaymentSuccess ────────────────────────────────────────────────────────────
// Pantalla de confirmación tras un pago exitoso.
// `redirectText` permite personalizar el mensaje de redirección según el contexto:
//   - Dashboard: "Redirigiendo al dashboard…"
//   - Registro:  "Comenzando tu aventura…" (o cualquier otro)

import type { PaymentPlan } from "./payment.types";

interface PaymentSuccessProps {
    plan: PaymentPlan;
    onClose: () => void;
    redirectText?: string;
}

export default function PaymentSuccess({
    plan,
    onClose,
    redirectText = "Redirigiendo al dashboard…",
}: PaymentSuccessProps) {
    return (
        <div className="pgw-overlay" onClick={onClose}>
            <div className="pgw-modal" onClick={(e) => e.stopPropagation()}>
                <div className="success-screen">
                    <div className="success-icon">✓</div>

                    <h2 className="font-cinzel pgw-success-title">¡Clase Actualizada!</h2>
                    <p className="font-cinzel pgw-success-subtitle">PAGO REGISTRADO EXITOSAMENTE</p>

                    <p className="font-crimson pgw-success-body">
                        Ahora eres un{" "}
                        <span className={`pgw-success-plan-name pgw-success-plan-name--${plan.id}`}>
                            {plan.name}
                        </span>.
                        Que tu aventura comience.
                    </p>

                    <div className="pgw-success-redirect">
                        <p className="font-cinzel pgw-success-redirect-text">
                            {redirectText}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}