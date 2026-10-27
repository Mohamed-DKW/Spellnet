// ── Tipos del PaymentGateway ──────────────────────────────────────────────────

export interface PaymentPlan {
    id: string;
    dbName: string;
    name: string;
    price: string;
    priceNum: number;
    color: string;
    image: string;
}

// Datos de registro que la pasarela necesita para crear el usuario
// antes de procesar el cobro. Solo se usan en el flujo signup + pago.
export interface RegistrationData {
    nameUser: string;
    email: string;
    password: string;
    returnPassword: string;
    plan: string;
}

export interface PaymentGatewayProps {
    plan: PaymentPlan;
    // En el flujo de registro con plan de pago se pasa registrationData.
    // La pasarela registra al usuario al confirmar el pago.
    // En el flujo normal (usuario ya registrado) se pasa userId + userName.
    registrationData?: RegistrationData;
    userId?: number;
    userName: string;
    onClose: () => void;
    onSuccess: () => void;
}

export interface CardType {
    id: "visa" | "mastercard" | "amex" | "discover";
    name: string;
    icon: string;
    gradient: string;
}

// ── Constantes ────────────────────────────────────────────────────────────────

export const CARD_TYPES: CardType[] = [
    { id: "visa", name: "Visa", icon: "VISA", gradient: "linear-gradient(135deg,#1a1f71,#0d47a1)" },
    { id: "mastercard", name: "Mastercard", icon: "⊕", gradient: "linear-gradient(135deg,#1a1a1a,#2d2d2d)" },
    { id: "amex", name: "Amex", icon: "AMEX", gradient: "linear-gradient(135deg,#006fcf,#0077c8)" },
    { id: "discover", name: "Discover", icon: "◉", gradient: "linear-gradient(135deg,#ff6600,#e55300)" },
];

export const SIGNUP_PLANS: (PaymentPlan & { gradient: string; dimGradient: string; label: string })[] = [
    {
        id: "goblin", dbName: "Goblin", name: "Goblin",
        price: "Gratis", priceNum: 0,
        color: "#16a34a", image: "/img/icono-goblin.png",
        gradient: "plan-btn--goblin-active",
        dimGradient: "plan-btn--goblin",
        label: "Gratis",
    },
    {
        id: "wizard", dbName: "Wizard", name: "Wizard",
        price: "$20/mes", priceNum: 20,
        color: "#8b5cf6", image: "/img/icono-wizard.png",
        gradient: "plan-btn--wizard-active",
        dimGradient: "plan-btn--wizard",
        label: "$20/mes",
    },
    {
        id: "elder-dragon", dbName: "Elder_dragon", name: "Elder Dragon",
        price: "$50/mes", priceNum: 50,
        color: "#ef4444", image: "/img/icono-dragon.png",
        gradient: "plan-btn--dragon-active",
        dimGradient: "plan-btn--dragon",
        label: "$50/mes",
    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export const formatCardNumber = (v: string): string =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

export const formatExpiry = (v: string): string => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export const maskCardNumber = (n: string): string => {
    const raw = n.replace(/\s/g, "");
    if (raw.length < 4) return "•••• •••• •••• ••••";
    return (raw.slice(0, -4).replace(/\d/g, "•") + raw.slice(-4))
        .replace(/(.{4})/g, "$1 ")
        .trim();
};

export const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);