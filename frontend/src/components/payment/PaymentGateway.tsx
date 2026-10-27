// ── PaymentGateway ────────────────────────────────────────────────────────────
// Modal de pago montado via createPortal en document.body.
//
// FLUJO SIGNUP + PAGO (registrationData presente):
//   Al confirmar el pago se hace primero POST /api/auth/register para crear
//   el usuario, y luego POST /api/payment/checkout para registrar el cobro.
//   Si el registro falla, no se cobra. Si el cobro falla, el usuario queda
//   creado con plan gratuito (puede reintentar desde el dashboard).
//
// FLUJO PAGO NORMAL (userId presente):
//   Solo se llama a POST /api/payment/checkout.

import { useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";

import "./payment-gateway.css";

import type { CardType, PaymentGatewayProps, PaymentPlan } from "./payment.types";
import { CARD_TYPES, isValidEmail } from "./payment.types";

import PaymentHeader from "./PaymentHeader";
import PaymentSuccess from "./PaymentSuccess";
import PlanSummary from "./PlanSummary";
import CardForm from "./CardForm";
import PayPalPanel from "./PayPalPanel";
import PlanSwitcher from "./PlanSwitcher";
import API from "../../services/api";
type PaymentMethod = "card" | "paypal";

export default function PaymentGateway({
    plan: initialPlan,
    registrationData,
    userId,
    userName,
    onClose,
    onSuccess,
}: PaymentGatewayProps) {

    const [activePlan, setActivePlan] = useState<PaymentPlan>(initialPlan);

    const [cardType, setCardType] = useState<CardType>(CARD_TYPES[0]);
    const [cardNumber, setCardNumber] = useState("");
    const [cardHolder, setCardHolder] = useState(userName.toUpperCase());
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [email, setEmail] = useState(registrationData?.email ?? "");
    const [billingName, setBillingName] = useState(registrationData?.nameUser ?? "");

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

    // ── Validación ────────────────────────────────────────────────────────────
    const validate = (): Record<string, string> => {
        const e: Record<string, string> = {};
        const cvvLen = cardType.id === "amex" ? 4 : 3;

        if (cardNumber.replace(/\s/g, "").length < 13)
            e.cardNumber = "Número de tarjeta inválido";
        if (!cardHolder.trim())
            e.cardHolder = "Introduce el nombre del titular";

        const [mm, yy] = expiry.split("/");
        if (!mm || !yy || new Date(2000 + Number(yy), Number(mm) - 1) < new Date())
            e.expiry = "Fecha de expiración inválida";

        if (cvv.replace(/\D/g, "").length < cvvLen)
            e.cvv = `CVV debe tener ${cvvLen} dígitos`;
        if (!isValidEmail(email))
            e.email = "Email inválido";
        if (!billingName.trim())
            e.billingName = "Introduce el nombre de facturación";

        return e;
    };

    const clearError = (field: string) =>
        setErrors((prev) => ({ ...prev, [field]: "" }));

    // ── Pago con tarjeta ──────────────────────────────────────────────────────
    const handleCardSubmit = async () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setApiError("");
        setLoading(true);

        try {
            let resolvedUserId = userId;

            // Si venimos del flujo de registro, primero creamos el usuario.
            // Usamos activePlan.id (no registrationData.plan) porque el usuario
            // puede haber cambiado el plan con el PlanSwitcher dentro de la pasarela.
            if (registrationData) {
                const regResponse = await axios.post(
                    `${API}/api/auth/register`,
                    {
                        nameUser: registrationData.nameUser,
                        email: registrationData.email,
                        password: registrationData.password,
                        returnPassword: registrationData.returnPassword,
                        plan: activePlan.id,
                    }
                );

                const { token } = regResponse.data;
                localStorage.setItem("token", token);
                const responseData = await axios.get(
                    `${API}/api/user/location`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                if (!localStorage.getItem("firstLogin")) {
                    localStorage.setItem("firstLogin", new Date().toLocaleDateString("es-ES", {
                        day: "numeric", month: "long", year: "numeric",
                    }));
                }

                resolvedUserId = (
                    regResponse.data.user?.user_id ??
                    regResponse.data.userId ??
                    regResponse.data.id ??
                    responseData.data.user_id
                );
            }

            // Procesamos el cobro
            await axios.post(`${API}/api/payment/checkout`, {
                user_id: resolvedUserId,
                plan_name: activePlan.dbName,
                billing_name: billingName,
                billing_email: email,
                card_type: cardType.id,
                card_last4: cardNumber.replace(/\s/g, "").slice(-4),
                card_holder: cardHolder,
                card_expiry: expiry,
            });

            setSuccess(true);
            setTimeout(onSuccess, 2500);
        } catch (err: any) {
            setApiError(err?.response?.data?.error ?? "Error al procesar el pago. Inténtalo de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    // ── Pago con PayPal (simulado) ────────────────────────────────────────────
    const handlePayPal = async () => {
        setLoading(true);
        setApiError("");

        try {
            if (registrationData) {
                const regResponse = await axios.post(
                    `${API}/api/auth/register`,
                    {
                        nameUser: registrationData.nameUser,
                        email: registrationData.email,
                        password: registrationData.password,
                        returnPassword: registrationData.returnPassword,
                        plan: activePlan.id,
                    }
                );
                localStorage.setItem("token", regResponse.data.token);
                if (!localStorage.getItem("firstLogin")) {
                    localStorage.setItem("firstLogin", new Date().toLocaleDateString("es-ES", {
                        day: "numeric", month: "long", year: "numeric",
                    }));
                }
            }

            // Simulación de espera PayPal
            await new Promise((r) => setTimeout(r, 1800));

            setSuccess(true);
            setTimeout(onSuccess, 2500);
        } catch (err: any) {
            setApiError(err?.response?.data?.error ?? "Error al conectar con PayPal.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return createPortal(
            <PaymentSuccess
                plan={activePlan}
                onClose={onClose}
                redirectText={registrationData ? "Comenzando tu aventura…" : "Redirigiendo al dashboard…"}
            />,
            document.body
        );
    }

    return createPortal(
        <div className="pgw-overlay" onClick={onClose}>
            <div className="pgw-modal" onClick={(e) => e.stopPropagation()}>

                <PaymentHeader onClose={onClose} />

                <div className="pgw-body">

                    {apiError && (
                        <div className="error-banner">⚠ {apiError}</div>
                    )}

                    <PlanSummary plan={activePlan} />

                    <PlanSwitcher
                        currentPlan={activePlan}
                        onPlanChange={setActivePlan}
                    />

                    <div className="pgw-method-tabs">
                        <button
                            className={`pgw-method-tab${paymentMethod === "card" ? " active" : ""}`}
                            onClick={() => setPaymentMethod("card")}
                        >
                            💳 TARJETA
                        </button>
                        <button
                            className={`pgw-method-tab${paymentMethod === "paypal" ? " active" : ""}`}
                            onClick={() => setPaymentMethod("paypal")}
                        >
                            🅿 PAYPAL
                        </button>
                    </div>

                    {paymentMethod === "paypal" && (
                        <PayPalPanel
                            planPrice={activePlan.price}
                            loading={loading}
                            onPayPal={handlePayPal}
                        />
                    )}

                    {paymentMethod === "card" && (
                        <CardForm
                            cardType={cardType}
                            cardNumber={cardNumber}
                            cardHolder={cardHolder}
                            expiry={expiry}
                            cvv={cvv}
                            billingName={billingName}
                            email={email}
                            errors={errors}
                            loading={loading}
                            planPrice={activePlan.price}
                            onCardTypeChange={setCardType}
                            onCardNumberChange={setCardNumber}
                            onCardHolderChange={setCardHolder}
                            onExpiryChange={setExpiry}
                            onCvvChange={setCvv}
                            onBillingNameChange={setBillingName}
                            onEmailChange={setEmail}
                            onSubmit={handleCardSubmit}
                            onClearError={clearError}
                        />
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}