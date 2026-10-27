// URLs
import APIBackend from '../../../services/api';
export const API = `${APIBackend}/api/chat`;
export const UPLOAD_URL = `${APIBackend}/api/upload`;
export const BASE_URL = `${APIBackend}`;

// Configuración de archivos
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Helper para colores dorados
export const GOLD = (opacity: number) => `rgba(251,191,36,${opacity})`;

// Badges de planes
export const PLAN_BADGES = {
    wizard: 'bg-[rgba(124,58,237,0.2)] border-[rgba(124,58,237,0.35)] text-[rgba(196,167,255,0.8)]',
    goblin: 'bg-[rgba(34,197,94,0.2)]  border-[rgba(34,197,94,0.35)]  text-[#16A34A]',
    default: 'bg-[rgba(239,68,68,0.133)] border-[rgb(239,68,68)] text-[rgb(239,68,68)]',
} as const;

// NOTA: El mensaje de bienvenida ya NO se exporta como objeto estático.
// Usa la función makeWelcome() dentro de useChat.ts para crear instancias
// frescas con IDs únicos en cada sesión.