// ── PlanSummary ───────────────────────────────────────────────────────────────
// Tarjeta compacta con el plan elegido, icono, nombre y precio.
// Usa clases CSS por plan-id en vez de inline styles.

import type { PaymentPlan } from "./payment.types";

interface PlanSummaryProps {
    plan: PaymentPlan;
}

export default function PlanSummary({ plan }: PlanSummaryProps) {
    return (
        <div className="plan-summary pgw-plan-summary">
            <div className="pgw-plan-info">
                <div className={`pgw-plan-icon-wrap pgw-plan-icon-wrap--${plan.id}`}>
                    <img
                        src={plan.image}
                        alt={plan.name}
                        className={`pgw-plan-icon-img pgw-plan-icon-img--${plan.id}`}
                    />
                </div>
                <div>
                    <p className="font-cinzel pgw-plan-name">{plan.name}</p>
                    <p className="font-cinzel pgw-plan-label">PLAN SELECCIONADO</p>
                </div>
            </div>

            <div className="pgw-plan-price-block">
                <p className={`font-cinzel pgw-plan-price pgw-plan-price--${plan.id}`}>
                    {plan.price}
                </p>
                <p className="font-cinzel pgw-plan-period">/ MES</p>
            </div>
        </div>
    );
}