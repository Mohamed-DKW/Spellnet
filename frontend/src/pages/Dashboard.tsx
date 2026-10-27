// ── Dashboard (pages/Dashboard.tsx) ──────────────────────────────────────────
// Página principal del perfil del usuario.
//
// Carga en paralelo:
//   1. Datos del usuario autenticado (GET /api/user/location via JWT)
//   2. Estadísticas de uso (GET /api/stats/:id)
//
// Si las stats fallan, el dashboard sigue funcional mostrando "—" en los campos
// de estadísticas. El usuario nunca ve una pantalla de error por ese motivo.
//
// Al cambiar el nombre (ChangeName), se emite el evento global
// "spellnet:nameChanged" para que el Header actualice su avatar sin recargar.

import { useState, useEffect } from "react";
import axios from "axios";

// El CSS se importa en la página (no en los componentes) para que esté disponible
// desde el primer render, incluyendo el LoadingSkeleton.
import "../components/dashboard/dashboard.css";

import ProfileCard from "../components/dashboard/ProfileCard";
import UsageStats from "../components/dashboard/UsageStats";
import RecentActivity from "../components/dashboard/RecentActivity";
import ChangeName from "../components/dashboard/ChangeName";
import PlanSelector from "../components/dashboard/PlanSelector";
import LoadingSkeleton from "../components/dashboard/LoadingSkeleton";
import API from "../services/api";

import type { ApiUser, StatsData } from "../components/dashboard/dashboard.types";
import { resolvePlan } from "../components/dashboard/dashboard.constants";


export default function Dashboard() {
    const [user, setUser] = useState<ApiUser | null>(null);
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = "Perfil | SpellNet";

        const token = localStorage.getItem("token");
        if (!token) {
            setError("No hay sesión activa.");
            setLoading(false);
            return;
        }

        axios
            .get(`${API}/api/user/location`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(async (res) => {
                const userData: ApiUser = res.data;
                setUser(userData);

                // Las stats se piden de forma independiente para no bloquear el dashboard
                try {
                    const statsRes = await axios.get(
                        `${API}/api/stats/${userData.user_id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setStats(statsRes.data);
                } catch {
                    console.warn("No se pudieron cargar las estadísticas.");
                }

                setLoading(false);
            })
            .catch(() => {
                setError("Error al cargar el perfil.");
                setLoading(false);
            });
    }, []);

    // Actualiza el estado local y notifica al Header via evento global para
    // que el avatar se actualice sin necesidad de recargar la página.
    const handleNameChanged = (newName: string) => {
        setUser((prev) => prev ? { ...prev, name: newName } : prev);
        window.dispatchEvent(new CustomEvent("spellnet:nameChanged", { detail: newName }));
    };

    if (loading) return <LoadingSkeleton />;

    if (error) {
        return (
            <div className="db-error-screen">
                <p className="font-cinzel db-error-text">{error}</p>
            </div>
        );
    }

    if (!user) return null;

    const planDef = resolvePlan(user.plan?.name ?? "");
    // firstLogin se almacena en localStorage durante el flujo de registro/login
    const joinDate = localStorage.getItem("firstLogin") ?? "—";

    return (
        <div className="db-root font-crimson">
            {/* Fondo degradado fijo que cubre toda la ventana */}
            <div className="db-bg" />

            <div className="db-container">

                {/* ── Cabecera de la página ── */}
                <div className="db-1 db-page-header">
                    <h1 className="font-cinzel db-page-title">
                        Grimorio del Aventurero
                    </h1>
                    <p className="db-page-subtitle">
                        Gestiona tu perfil, estadísticas y clase activa
                    </p>
                </div>

                {/* ── Layout: 1 col móvil / 3 col desktop ── */}
                <div className="db-grid">

                    {/* Columna izquierda: perfil + mini stats diarias */}
                    <div className="db-col-left">
                        <ProfileCard user={user} planDef={planDef} joinDate={joinDate} />

                        {/* Consumo rápido del día */}
                        <div className="db-3 db-mini-stats">
                            <div className="stat-card text-center">
                                <div className="font-cinzel db-mini-stat-value">
                                    {stats ? String(stats.messages.used_today) : "—"}
                                </div>
                                <div className="db-mini-stat-label">Mensajes usados hoy</div>
                            </div>
                            <div className="stat-card text-center">
                                <div className="font-cinzel db-mini-stat-value">
                                    {stats ? String(stats.files.used_today) : "—"}
                                </div>
                                <div className="db-mini-stat-label">Archivos subidos hoy</div>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha: estadísticas, actividad, nombre y plan */}
                    <div className="db-col-right">
                        <UsageStats planDef={planDef} stats={stats} />
                        <RecentActivity stats={stats} />
                        <ChangeName
                            name={user.name}
                            onNameChanged={handleNameChanged}
                        />
                        <PlanSelector
                            currentPlanId={planDef.id}
                            userId={Number(user.user_id)}
                            userName={user.name}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}