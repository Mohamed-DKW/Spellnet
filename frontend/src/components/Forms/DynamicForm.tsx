// ── DynamicForm ───────────────────────────────────────────────────────────────
// Formulario reutilizable para Login y SignUp.
//
// FLUJO SIGNUP CON PLAN DE PAGO:
//   1. El usuario rellena el formulario y pulsa "Comenzar Aventura".
//   2. Si el plan elegido tiene precio, NO se llama a la API de registro.
//      En su lugar se abre el PaymentGateway con los datos del formulario.
//   3. Dentro del PaymentGateway, al confirmar el pago, se registra al usuario
//      y se procesa el cobro en una sola operación.
//   4. Si el usuario cierra el modal sin pagar, vuelve al formulario intacto
//      y puede volver a intentarlo sin que se haya creado ningún usuario.
//
// FLUJO LOGIN / SIGNUP GRATIS:
//   - Se envía directamente a la API y se redirige a /chats.

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import PaymentGateway from "../payment/PaymentGateway";
import type { RegistrationData } from "../payment/payment.types";
import { SIGNUP_PLANS } from "../payment/payment.types";

import FormBody from "./sign-up-login/FormBody";


interface DynamicFormProps {
    name: string;
    url: string;
    fields: string[];
    redirection: string;
    redirectionDes: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ name, url, fields, redirection, redirectionDes }) => {
    const [selectedPlan, setSelectedPlan] = useState("goblin");
    const location = useLocation();
    const navigate = useNavigate();

    // Datos del formulario que la pasarela necesita para registrar al usuario
    // al confirmar el pago. Mientras sea null, el modal no se monta.
    const [pendingPayment, setPendingPayment] = useState<{
        registrationData: RegistrationData;
        userName: string;
    } | null>(null);

    useEffect(() => {
        document.title = name;
        const planFromState = location.state?.selectedPlan;
        if (planFromState && name === "Crear cuenta") {
            setSelectedPlan(planFromState);
        }
    }, [name, location.state]);

    const isSignup = name.toLowerCase() === "crear cuenta";


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        // ── Login ──────────────────────────────────────────────────────────
        if (!isSignup) {
            try {
                const response = await axios.post(url, {
                    email: formData.get("email"),
                    password: formData.get("password"),
                });
                localStorage.setItem("token", response.data.token);
                if (!localStorage.getItem("firstLogin")) {
                    localStorage.setItem("firstLogin", new Date().toLocaleDateString("es-ES", {
                        day: "numeric", month: "long", year: "numeric",
                    }));
                }
                navigate("/chats");
            } catch (error) {
                console.error("Error en login:", error);
            }
            return;
        }

        // ── Signup ─────────────────────────────────────────────────────────
        const chosenPlan = SIGNUP_PLANS.find((p) => p.id === selectedPlan);

        // Plan de pago: NO registramos aún — abrimos la pasarela con los datos
        if (chosenPlan && chosenPlan.priceNum > 0) {
            const registrationData: RegistrationData = {
                nameUser: String(formData.get("nombre-de-usuario") ?? ""),
                email: String(formData.get("email") ?? ""),
                password: String(formData.get("password") ?? ""),
                returnPassword: String(formData.get("repite-la-contraseña") ?? ""),
                plan: selectedPlan,
            };
            setPendingPayment({
                registrationData,
                userName: registrationData.nameUser,
            });
            return;
        }

        // Plan gratuito: registramos directamente
        try {
            const response = await axios.post(url, {
                nameUser: formData.get("nombre-de-usuario"),
                email: formData.get("email"),
                password: formData.get("password"),
                returnPassword: formData.get("repite-la-contraseña"),
                plan: selectedPlan,
            });
            localStorage.setItem("token", response.data.token);
            if (!localStorage.getItem("firstLogin")) {
                localStorage.setItem("firstLogin", new Date().toLocaleDateString("es-ES", {
                    day: "numeric", month: "long", year: "numeric",
                }));
            }
            navigate("/chats");
        } catch (error) {
            console.error("Error en registro:", error);
        }
    };

    // Pago completado → guardamos el token que la pasarela devuelve y navegamos
    const handlePaymentSuccess = () => {
        setPendingPayment(null);
        navigate("/chats");
    };

    // Cerró el modal sin pagar → vuelve al formulario, sin ningún usuario creado
    const handlePaymentClose = () => {
        setPendingPayment(null);
    };

    const chosenPlan = SIGNUP_PLANS.find((p) => p.id === selectedPlan);

    return (
        <>
            <FormBody name={name} onSubmit={handleSubmit} fields={fields} isSignup={isSignup} redirection={redirection} redirectionDes={redirectionDes} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} />

            {/* Modal de pago — solo se monta cuando hay plan de pago pendiente */}
            {pendingPayment && chosenPlan && (
                <PaymentGateway
                    plan={chosenPlan}
                    registrationData={pendingPayment.registrationData}
                    userName={pendingPayment.userName}
                    onClose={handlePaymentClose}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </>
    );
};

export default DynamicForm;