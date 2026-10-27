// ── CardForm ──────────────────────────────────────────────────────────────────
// Formulario completo de pago con tarjeta bancaria.
// Incluye:
//   - Selector de red (Visa, Mastercard, Amex, Discover)
//   - Previsualización 3D de la tarjeta (CardPreview)
//   - Campos de datos de tarjeta: número, titular, expiración, CVV
//   - Campos de facturación: nombre completo y email
//   - Resumen del total y botón de confirmación
//   - Badges de seguridad (SSL, PCI, 3D Secure)

import type { CardType } from "./payment.types";
import { CARD_TYPES, formatCardNumber, formatExpiry, isValidEmail } from "./payment.types";
import CardPreview from "./CardPreview";

// Badges informativos de seguridad mostrados bajo el botón de pago
const SECURITY_BADGES = ["🔒 SSL 256-bit", "✓ PCI Compliant", "🛡 3D Secure"];

interface CardFormProps {
    // Estado de la tarjeta
    cardType: CardType;
    cardNumber: string;
    cardHolder: string;
    expiry: string;
    cvv: string;
    // Estado de facturación
    billingName: string;
    email: string;
    // Errores de validación por campo
    errors: Record<string, string>;
    loading: boolean;
    planPrice: string;
    // Callbacks de cambio de campo
    onCardTypeChange: (ct: CardType) => void;
    onCardNumberChange: (v: string) => void;
    onCardHolderChange: (v: string) => void;
    onExpiryChange: (v: string) => void;
    onCvvChange: (v: string) => void;
    onBillingNameChange: (v: string) => void;
    onEmailChange: (v: string) => void;
    onSubmit: () => void;
    onClearError: (field: string) => void;
}

export default function CardForm({
    cardType, cardNumber, cardHolder, expiry, cvv,
    billingName, email, errors, loading, planPrice,
    onCardTypeChange, onCardNumberChange, onCardHolderChange,
    onExpiryChange, onCvvChange, onBillingNameChange, onEmailChange,
    onSubmit, onClearError,
}: CardFormProps) {
    // Amex usa CVV de 4 dígitos; el resto usa 3
    const cvvLen = cardType.id === "amex" ? 4 : 3;

    return (
        <>
            {/* ── Selector de red de tarjeta ── */}
            <label className="pgw-label">Tipo de Tarjeta</label>
            <div className="card-types">
                {CARD_TYPES.map((ct) => (
                    <button
                        key={ct.id}
                        onClick={() => onCardTypeChange(ct)}
                        className={`card-type-btn${cardType.id === ct.id ? " selected" : ""}`}
                    >
                        <span className="card-type-icon">{ct.icon}</span>
                        <span className="card-type-name">{ct.name}</span>
                    </button>
                ))}
            </div>

            {/* ── Tarjeta 3D animada ── */}
            <CardPreview
                cardType={cardType}
                cardNumber={cardNumber}
                cardHolder={cardHolder}
                expiry={expiry}
            />

            <div className="pgw-divider">
                <span className="pgw-divider-label">DATOS DE LA TARJETA</span>
            </div>

            {/* Número de tarjeta */}
            <div className="field-group">
                <label className="pgw-label">Número de Tarjeta</label>
                <div className="pgw-input-wrap">
                    <input
                        className={`pgw-input${errors.cardNumber ? " error" : cardNumber.replace(/\s/g, "").length >= 13 ? " valid" : ""}`}
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        inputMode="numeric"
                        onChange={(e) => {
                            onCardNumberChange(formatCardNumber(e.target.value));
                            onClearError("cardNumber");
                        }}
                    />
                    <span className="field-icon">💳</span>
                </div>
                {errors.cardNumber && <p className="field-hint">{errors.cardNumber}</p>}
            </div>

            {/* Titular */}
            <div className="field-group">
                <label className="pgw-label">Nombre del Titular</label>
                <input
                    className={`pgw-input pgw-input--upper${errors.cardHolder ? " error" : cardHolder.length > 3 ? " valid" : ""}`}
                    placeholder="NOMBRE APELLIDO"
                    value={cardHolder}
                    onChange={(e) => {
                        onCardHolderChange(e.target.value.toUpperCase());
                        onClearError("cardHolder");
                    }}
                />
                {errors.cardHolder && <p className="field-hint">{errors.cardHolder}</p>}
            </div>

            {/* Expiración y CVV en la misma fila */}
            <div className="pgw-row-2 field-group">
                <div>
                    <label className="pgw-label">Fecha de Expiración</label>
                    <input
                        className={`pgw-input${errors.expiry ? " error" : expiry.length === 5 ? " valid" : ""}`}
                        placeholder="MM/AA"
                        value={expiry}
                        maxLength={5}
                        inputMode="numeric"
                        onChange={(e) => {
                            onExpiryChange(formatExpiry(e.target.value));
                            onClearError("expiry");
                        }}
                    />
                    {errors.expiry && <p className="field-hint">{errors.expiry}</p>}
                </div>
                <div>
                    <label className="pgw-label">
                        CVV {cardType.id === "amex" ? "(4 díg.)" : "(3 díg.)"}
                    </label>
                    <div className="pgw-input-wrap">
                        <input
                            className={`pgw-input${errors.cvv ? " error" : cvv.length >= cvvLen ? " valid" : ""}`}
                            placeholder={cardType.id === "amex" ? "••••" : "•••"}
                            value={cvv}
                            type="password"
                            maxLength={cvvLen}
                            inputMode="numeric"
                            onChange={(e) => {
                                onCvvChange(e.target.value.replace(/\D/g, "").slice(0, cvvLen));
                                onClearError("cvv");
                            }}
                        />
                        <span className="field-icon">🔒</span>
                    </div>
                    {errors.cvv && <p className="field-hint">{errors.cvv}</p>}
                </div>
            </div>

            <div className="pgw-divider">
                <span className="pgw-divider-label">INFORMACIÓN DE FACTURACIÓN</span>
            </div>

            {/* Nombre de facturación */}
            <div className="field-group">
                <label className="pgw-label">Nombre Completo (Facturación)</label>
                <input
                    className={`pgw-input${errors.billingName ? " error" : billingName.length > 3 ? " valid" : ""}`}
                    placeholder="Nombre completo"
                    value={billingName}
                    onChange={(e) => {
                        onBillingNameChange(e.target.value);
                        onClearError("billingName");
                    }}
                />
                {errors.billingName && <p className="field-hint">{errors.billingName}</p>}
            </div>

            {/* Email de confirmación */}
            <div className="field-group">
                <label className="pgw-label">Email de Confirmación</label>
                <div className="pgw-input-wrap">
                    <input
                        className={`pgw-input${errors.email ? " error" : isValidEmail(email) ? " valid" : ""}`}
                        placeholder="aventurero@spellnet.com"
                        value={email}
                        type="email"
                        inputMode="email"
                        onChange={(e) => {
                            onEmailChange(e.target.value);
                            onClearError("email");
                        }}
                    />
                    <span className="field-icon">✉</span>
                </div>
                {errors.email && <p className="field-hint">{errors.email}</p>}
            </div>

            {/* Resumen del total */}
            <div className="pgw-total-row">
                <span className="font-cinzel pgw-total-label">TOTAL A COBRAR HOY</span>
                <span className="font-cinzel pgw-total-amount">{planPrice}</span>
            </div>

            {/* Botón de confirmación */}
            <button
                className={`pgw-submit${loading ? " loading" : ""}`}
                onClick={onSubmit}
                disabled={loading}
            >
                {loading
                    ? <><span className="spinner" />Procesando invocación…</>
                    : `⚔ Confirmar Pago · ${planPrice}`
                }
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