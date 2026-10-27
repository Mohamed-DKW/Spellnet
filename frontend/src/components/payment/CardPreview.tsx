// ── CardPreview ───────────────────────────────────────────────────────────────
// Previsualización 3D animada de la tarjeta bancaria.
// El gradiente de fondo se aplica via clase CSS por tipo de tarjeta.

import type { CardType } from "./payment.types";
import { maskCardNumber } from "./payment.types";

const CARD_LOGO: Record<CardType["id"], string> = {
    visa: "VISA", mastercard: "MC", amex: "AMEX", discover: "DISC",
};

interface CardPreviewProps {
    cardType: CardType;
    cardNumber: string;
    cardHolder: string;
    expiry: string;
}

export default function CardPreview({ cardType, cardNumber, cardHolder, expiry }: CardPreviewProps) {
    return (
        <div className="card-preview">
            <div className={`card-3d card-3d--${cardType.id}`}>
                <div className="card-shine" />
                <div className="card-logo font-cinzel">{CARD_LOGO[cardType.id]}</div>
                <div className="card-chip" />
                <div className="card-number">{maskCardNumber(cardNumber)}</div>
                <div className="card-bottom-row">
                    <div>
                        <p className="card-field-label">TITULAR</p>
                        <p className="card-holder">{cardHolder || "NOMBRE APELLIDO"}</p>
                    </div>
                    <div className="card-expiry-block">
                        <p className="card-field-label">VÁLIDO HASTA</p>
                        <p className="card-expiry">{expiry || "MM/AA"}</p>
                    </div>
                </div>
                {cardType.id === "mastercard" && (
                    <div className="card-network">
                        <div className="card-circle card-circle--red" />
                        <div className="card-circle card-circle--yellow" />
                    </div>
                )}
            </div>
        </div>
    );
}