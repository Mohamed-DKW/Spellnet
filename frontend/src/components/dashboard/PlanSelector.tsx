// ── PlanSelector ──────────────────────────────────────────────────────────────
// Permite al usuario seleccionar y cambiar su plan/clase.
//
// Flujos:
//   - Plan gratuito o downgrade: llama directamente a POST /api/plan/change-plain
//   - Plan de pago: abre el modal PaymentGateway para procesar el cobro primero
//
// Tras cualquier cambio exitoso se recarga la página para reflejar los nuevos
// límites en todas las secciones del dashboard.

import { useState } from "react";
import axios from "axios";
import { PLANS } from "./dashboard.constants";
import type { PlanDef } from "./dashboard.types";
import PaymentGateway from "../payment/PaymentGateway";
import API from "../../services/api";

interface PlanSelectorProps {
    currentPlanId: string;
    userId: number;
    userName: string;
}

export default function PlanSelector({ currentPlanId, userId, userName }: PlanSelectorProps) {
    const [selected, setSelected] = useState(currentPlanId);
    const [showPayment, setShowPayment] = useState(false);

    const selectedPlanDef = PLANS.find((p) => p.id === selected) ?? PLANS[0];
    const isSamePlan = selected === currentPlanId;

    // Cambia el plan directamente (planes gratuitos o downgrade sin pago)
    const handleChangeFree = async () => {
        try {
            await axios.post(`${API}/api/plan/change-plain`, {
                user_id: userId,
                name: selected,
            });
        } catch (error) {
            console.error("Error al actualizar la clase:", error);
            alert("Error al actualizar la clase");
            return;
        }
        window.location.reload();
    };

    const handleUpgradeClick = () => {
        if (isSamePlan) return;
        selectedPlanDef.priceNum === 0 ? handleChangeFree() : setShowPayment(true);
    };

    // Callback del modal: actualiza el plan en la BD y recarga la página
    const handlePaymentSuccess = async () => {
        try {
            await axios.post(`${API}/api/plan/change-plain`, {
                user_id: userId,
                name: selected,
            });
        } catch (err) {
            console.error("Error al actualizar plan tras pago:", err);
        }
        setShowPayment(false);
        window.location.reload();
    };

    return (
        <>
            <div className="panel db-4">
                <div className="panel-header">
                    <h3 className="panel-title">Seleccionar Clase (Plan)</h3>
                </div>

                <div className="p-6">
                    <p className="db-plan-hint">
                        Cada clase desbloquea nuevos poderes. Elige la que mejor se adapte a tu aventura.
                    </p>

                    {/* Grid de cards de planes */}
                    <div className="db-plan-grid">
                        {PLANS.map((plan) => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                selected={selected}
                                currentPlanId={currentPlanId}
                                onSelect={setSelected}
                            />
                        ))}
                    </div>

                    <div className="db-plan-actions">
                        {isSamePlan && (
                            <p className="font-cinzel db-plan-same-label">
                                Ya tienes esta clase activa
                            </p>
                        )}
                        <button
                            className="btn-primary"
                            onClick={handleUpgradeClick}
                            disabled={isSamePlan}
                            aria-disabled={isSamePlan}
                        >
                            {selectedPlanDef.priceNum > 0 && !isSamePlan
                                ? "💳 Pagar y Actualizar"
                                : "Actualizar Clase"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de pago — solo se monta cuando es necesario */}
            {showPayment && (
                <PaymentGateway
                    plan={selectedPlanDef}
                    userId={userId}
                    userName={userName}
                    onClose={() => setShowPayment(false)}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </>
    );
}

// ── PlanCard ──────────────────────────────────────────────────────────────────
// Card individual dentro del selector de planes.
// Los colores de fondo, borde y sombra son dinámicos (vienen de dashboard.constants),
// por lo que se aplican via inline style solo en esos puntos concretos.

interface PlanCardProps {
    plan: PlanDef;
    selected: string;
    currentPlanId: string;
    onSelect: (id: string) => void;
}

function PlanCard({ plan, selected, currentPlanId, onSelect }: PlanCardProps) {
    const isSelected = selected === plan.id;
    const isCurrent = plan.id === currentPlanId;

    return (
        <div
            onClick={() => onSelect(plan.id)}
            className={`plan-card cursor-pointer${isSelected ? " active" : ""}`}
            style={{
                background: isSelected ? plan.bg : "rgba(10,5,2,.6)",
                borderColor: isSelected ? plan.color : "rgba(251,191,36,.15)",
                boxShadow: isSelected ? `0 0 20px ${plan.glow}` : "none",
            }}
        >
            <div className="text-center">
                <img
                    src={plan.image}
                    alt={plan.name}
                    className="db-plan-img"
                    style={{ filter: `drop-shadow(0 0 8px ${plan.glow})` }}
                />

                <h4 className="font-cinzel db-plan-card-name" style={{ color: plan.color }}>
                    {plan.name}
                </h4>
                <p className="font-cinzel db-plan-card-price" style={{ color: plan.color }}>
                    {plan.price}
                </p>

                <div className="db-plan-benefits">
                    {plan.benefits.map((b) => (
                        <p key={b} className="db-plan-benefit" style={{ color: `${plan.color}cc` }}>
                            ✓ {b}
                        </p>
                    ))}
                </div>

                {/* Etiqueta de estado: plan activo o acción requerida */}
                {isCurrent && (
                    <div
                        className="plan-badge mt-3"
                        style={{ color: plan.color, background: plan.bg, border: `1px solid ${plan.color}` }}
                    >
                        CLASE ACTUAL
                    </div>
                )}
                {isSelected && !isCurrent && (
                    <div
                        className="plan-badge mt-3"
                        style={{ color: plan.color, background: plan.bg, border: `1px solid ${plan.color}` }}
                    >
                        {plan.priceNum > 0 ? "💳 REQUIERE PAGO" : "↓ DEGRADAR"}
                    </div>
                )}
            </div>
        </div>
    );
}