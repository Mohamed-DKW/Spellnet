import type { PlanDef } from "./dashboard.types";

// ── Lista de planes disponibles ───────────────────────────────────────────────
// Fuente de verdad del frontend para colores, textos e imágenes de cada plan.
// El campo `dbName` debe coincidir exactamente con el valor en la BD.
export const PLANS: PlanDef[] = [
    {
        id: "goblin", dbName: "Goblin", name: "Goblin",
        price: "Gratis", priceNum: 0,
        color: "#16a34a", glow: "rgba(34,197,94,.35)",
        bg: "rgba(20,83,45,.3)", border: "#16a34a",
        benefits: ["10 mensajes/día", "1 archivo/día"],
        image: "/img/icono-goblin.png",
    },
    {
        id: "wizard", dbName: "Wizard", name: "Wizard",
        price: "$20/mes", priceNum: 20,
        color: "#8b5cf6", glow: "rgba(139,92,246,.35)",
        bg: "rgba(76,29,149,.3)", border: "#8b5cf6",
        benefits: ["30 mensajes/día", "5 archivos/día"],
        image: "/img/icono-wizard.png",
    },
    {
        id: "elder-dragon", dbName: "Elder_dragon", name: "Elder Dragon",
        price: "$50/mes", priceNum: 50,
        color: "#ef4444", glow: "rgba(239,68,68,.35)",
        bg: "rgba(127,29,29,.3)", border: "#ef4444",
        benefits: ["Mensajes ilimitados", "Archivos ilimitados"],
        image: "/img/icono-dragon.png",
    },
];

// Mapa para convertir el nombre de la BD al id interno del frontend
export const DB_NAME_TO_ID: Record<string, string> = {
    Goblin: "goblin",
    Wizard: "wizard",
    Elder_dragon: "elder-dragon",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

// Devuelve la primera letra del nombre en mayúscula (para el avatar)
export const getInitial = (name: string): string =>
    name[0]?.toUpperCase() ?? "?";

// Considera un límite como "ilimitado" si supera este umbral
export const isUnlimited = (n: number): boolean => n >= 9_999_999;

// Formatea una fecha ISO a formato legible en español
export const formatDate = (iso: string): string => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("es-ES", {
        day: "2-digit", month: "short", year: "numeric",
    });
};

// Resuelve el PlanDef de un usuario a partir del nombre guardado en su plan
export const resolvePlan = (planName: string): PlanDef => {
    const id = DB_NAME_TO_ID[planName] ?? "goblin";
    return PLANS.find((p) => p.id === id) ?? PLANS[0];
};