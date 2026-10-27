// ── Tipos compartidos del Dashboard ──────────────────────────────────────────
// Centralizados aquí para no duplicarlos entre componentes.

// Definición de un plan con sus colores y textos para el UI
export interface PlanDef {
    id: string;        // Identificador interno: "goblin" | "wizard" | "elder-dragon"
    dbName: string;    // Nombre exacto en la BD: "Goblin" | "Wizard" | "Elder_dragon"
    name: string;      // Nombre legible para mostrar
    price: string;     // Precio formateado: "Gratis" | "$20/mes" | "$50/mes"
    priceNum: number;  // Precio numérico para lógica de pago
    color: string;     // Color principal del plan (hex)
    glow: string;      // Color del brillo/sombra (rgba)
    bg: string;        // Fondo del card seleccionado (rgba)
    border: string;    // Color del borde del card
    benefits: string[];
    image: string;     // Ruta al icono del plan
}

// Datos del usuario tal como los devuelve la API
export interface ApiUser {
    user_id: number;
    name: string;
    email: string;
    plan_id: number;
    plan?: {
        plan_id: number;
        name: string;
        message_limit: number;
        file_limit: number;
        price: number;
    };
}

// Datos de estadísticas del usuario tal como los devuelve /api/stats/:id
export interface StatsData {
    messages: {
        total: number;
        today: number;
        week: number;
        month: number;
        used_today: number;
        limit_today: number;
    };
    files: {
        total: number;
        today: number;
        by_type: Record<string, number>;
        used_today: number;
        limit_today: number;
    };
    chats: { total: number };
    activity: {
        active_days: number;
        recent_chats: { chat_id: number; chat_name: string; last_message_date: string }[];
        recent_files: { file_id: number; file_name: string; upload_date: string }[];
    };
    plan: ApiUser["plan"] | null;
}