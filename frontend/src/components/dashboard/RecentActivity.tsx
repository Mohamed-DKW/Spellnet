// ── RecentActivity ────────────────────────────────────────────────────────────
// Muestra los últimos 5 chats o archivos del usuario con sus fechas.
// Un par de tabs permite alternar entre ambas vistas sin recargar datos.
// Mientras las stats no están disponibles, se muestran skeletons de carga.

import { useState } from "react";
import type { StatsData } from "./dashboard.types";
import { formatDate } from "./dashboard.constants";

interface RecentActivityProps {
    stats: StatsData | null;
}

type Tab = "chats" | "files";

export default function RecentActivity({ stats }: RecentActivityProps) {
    const [tab, setTab] = useState<Tab>("chats");

    const recentChats = stats?.activity.recent_chats ?? [];
    const recentFiles = stats?.activity.recent_files ?? [];
    const isEmpty = tab === "chats" ? recentChats.length === 0 : recentFiles.length === 0;

    return (
        <div className="panel db-5">
            <div className="panel-header db-activity-header">
                <h3 className="panel-title">Actividad Reciente</h3>

                {/* Selector de vista: chats o archivos */}
                <div className="db-tabs">
                    {(["chats", "files"] as Tab[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`tab-btn ${tab === t ? "tab-btn--active" : "tab-btn--inactive"}`}
                        >
                            {t === "chats" ? "💬 Chats" : "📄 Archivos"}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6">
                {/* Skeletons mientras llegan las stats */}
                {!stats && (
                    <div className="db-skeleton-list">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="skeleton db-skeleton-row" />
                        ))}
                    </div>
                )}

                {/* Mensaje vacío */}
                {stats && isEmpty && (
                    <p className="db-activity-empty">
                        {tab === "chats"
                            ? "Aún no hay conversaciones registradas."
                            : "Aún no hay archivos subidos."}
                    </p>
                )}

                {/* Lista de chats recientes */}
                {stats && tab === "chats" && recentChats.map((chat) => (
                    <div key={chat.chat_id} className="activity-row">
                        <div className="db-activity-item">
                            <span className="db-activity-icon">💬</span>
                            <span className="db-activity-name">
                                {chat.chat_name || `Chat #${chat.chat_id}`}
                            </span>
                        </div>
                        <span className="db-activity-date">
                            {formatDate(chat.last_message_date)}
                        </span>
                    </div>
                ))}

                {/* Lista de archivos recientes */}
                {stats && tab === "files" && recentFiles.map((file) => (
                    <div key={file.file_id} className="activity-row">
                        <div className="db-activity-item">
                            <span className="db-activity-icon">📄</span>
                            <span className="db-activity-name db-activity-name--truncate">
                                {file.file_name}
                            </span>
                        </div>
                        <span className="db-activity-date">
                            {formatDate(file.upload_date)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}