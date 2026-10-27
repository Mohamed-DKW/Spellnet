// ── PlanSwitcher ──────────────────────────────────────────────────────────────
// Selector de plan dentro de la pasarela de pago.
// Permite cambiar entre los planes de pago (Wizard y Elder Dragon) sin salir del modal.

import type { PaymentPlan } from "./payment.types";

const PAID_PLANS: PaymentPlan[] = [
    {
        id: "wizard", dbName: "Wizard", name: "Wizard",
        price: "$20/mes", priceNum: 20,
        color: "#8b5cf6", image: "/img/icono-wizard.png",
    },
    {
        id: "elder-dragon", dbName: "Elder_dragon", name: "Elder Dragon",
        price: "$50/mes", priceNum: 50,
        color: "#ef4444", image: "/img/icono-dragon.png",
    },
];

interface PlanSwitcherProps {
    currentPlan: PaymentPlan;
    onPlanChange: (plan: PaymentPlan) => void;
}

export default function PlanSwitcher({ currentPlan, onPlanChange }: PlanSwitcherProps) {
    return (
        <div className="pgw-plan-switcher">
            <p className="pgw-plan-switcher-label">CAMBIAR PLAN</p>
            <div className="pgw-plan-switcher-grid">
                {PAID_PLANS.map((plan) => {
                    const isActive = plan.id === currentPlan.id;
                    return (
                        <button
                            key={plan.id}
                            onClick={() => onPlanChange(plan)}
                            className={[
                                "pgw-plan-switch-btn",
                                `pgw-plan-switch-btn--${plan.id}`,
                                isActive ? "pgw-plan-switch-btn--active" : "",
                            ].join(" ")}
                        >
                            <div className="pgw-plan-switch-icon-wrap">
                                <img
                                    src={plan.image}
                                    alt={plan.name}
                                    className={[
                                        "pgw-plan-switch-icon",
                                        isActive ? "pgw-plan-switch-icon--active" : "",
                                    ].join(" ")}
                                />
                            </div>
                            <div className="pgw-plan-switch-info">
                                <span className="pgw-plan-switch-name font-cinzel">{plan.name}</span>
                                <span className="pgw-plan-switch-price font-cinzel">{plan.price}</span>
                            </div>
                            {isActive && <div className="pgw-plan-switch-check">✓</div>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}