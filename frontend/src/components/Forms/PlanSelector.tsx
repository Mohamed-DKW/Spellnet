// ── PlanSelector ──────────────────────────────────────────────────────────────
// Selector visual de plan en el formulario de registro.
// Usa clases CSS por plan en lugar de inline styles.

import { SIGNUP_PLANS } from "../payment/payment.types";
import "./Forms.css";

interface PlanSelectorProps {
    selectedPlan: string;
    onSelect: (id: string) => void;
}

export default function PlanSelector({ selectedPlan, onSelect }: PlanSelectorProps) {
    return (
        <div className="plan-selector">
            <label className="plan-selector__label">Plan:</label>
            <div className="plan-selector__grid">
                {SIGNUP_PLANS.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    return (
                        <button
                            key={plan.id}
                            type="button"
                            onClick={() => onSelect(plan.id)}
                            className={[
                                "plan-btn",
                                `plan-btn--${plan.id}`,
                                isSelected ? "plan-btn--selected" : "",
                            ].join(" ")}
                        >
                            <img
                                src={plan.image}
                                alt={plan.name}
                                className={["plan-btn__icon", isSelected ? "plan-btn__icon--active" : ""].join(" ")}
                            />
                            <span className="plan-btn__name">{plan.name}</span>
                            <span className="plan-btn__price">{plan.label}</span>
                            {isSelected && <span className="plan-btn__dot" />}
                        </button>
                    );
                })}
            </div>
            <input type="hidden" name="plan" value={selectedPlan} />
        </div>
    );
}