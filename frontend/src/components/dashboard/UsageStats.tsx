// ── UsageStats ────────────────────────────────────────────────────────────────
// Panel de estadísticas de uso del usuario.
//
// Secciones:
//   1. Barras de progreso: mensajes y archivos consumidos hoy vs. límite diario
//   2. Mensajes por período: semana, mes y total acumulado
//   3. Resumen global: totales + días activo
//   4. Archivos por tipo de extensión (badges)
//
// Si el límite es >= 9_999_999 se considera ilimitado y la barra se muestra
// en tono suave sin porcentaje. Si el consumo supera el 90%, la barra y el
// contador se vuelven rojos y aparece un aviso.

import type { PlanDef, StatsData } from "./dashboard.types";
import { isUnlimited } from "./dashboard.constants";

interface UsageStatsProps {
    planDef: PlanDef;
    stats: StatsData | null;
}

export default function UsageStats({ planDef, stats }: UsageStatsProps) {
    const msgUsed = stats?.messages.used_today ?? 0;
    const msgLimit = stats?.messages.limit_today ?? 1;
    const fileUsed = stats?.files.used_today ?? 0;
    const fileLimit = stats?.files.limit_today ?? 1;

    const msgPct = isUnlimited(msgLimit) ? 100 : Math.min(100, Math.round((msgUsed / msgLimit) * 100));
    const filePct = isUnlimited(fileLimit) ? 100 : Math.min(100, Math.round((fileUsed / fileLimit) * 100));

    // Datos de las dos barras de progreso diarias
    const bars = [
        {
            label: "Mensajes diarios",
            color: planDef.color,
            used: msgUsed,
            limit: msgLimit,
            pct: msgPct,
            unlimited: isUnlimited(msgLimit),
        },
        {
            label: "Archivos diarios",
            color: "#8b5cf6",
            used: fileUsed,
            limit: fileLimit,
            pct: filePct,
            unlimited: isUnlimited(fileLimit),
        },
    ];

    // Desglose de mensajes por período de tiempo
    const temporal = stats
        ? [
            { label: "Esta semana", value: stats.messages.week },
            { label: "Este mes", value: stats.messages.month },
            { label: "Total", value: stats.messages.total },
        ]
        : [];

    // Cards del resumen global
    const summary = [
        { label: "Mensajes totales", value: stats ? String(stats.messages.total) : "—" },
        { label: "Archivos subidos", value: stats ? String(stats.files.total) : "—" },
        { label: "Días activo", value: stats ? String(stats.activity.active_days) : "—" },
    ];

    // Devuelve el gradiente CSS de la barra según el estado de consumo
    const barGradient = (color: string, unlimited: boolean, pct: number): string => {
        if (unlimited) return `linear-gradient(90deg,${color}44,${color}66)`;
        if (pct >= 90) return "linear-gradient(90deg,#b91c1c,#ef4444)";
        return `linear-gradient(90deg,${color}99,${color})`;
    };

    return (
        <div className="panel db-2">
            <div className="panel-header">
                <h3 className="panel-title">Estadísticas de Uso</h3>
            </div>

            <div className="p-6 db-stats-body">

                {/* ── Barras de progreso diario ── */}
                {bars.map(({ label, color, used, limit, pct, unlimited }) => (
                    <div key={label}>
                        <div className="db-bar-header">
                            <span className="db-bar-label">{label}</span>
                            {stats ? (
                                <span
                                    className="db-bar-value"
                                    style={{ color: !unlimited && pct >= 90 ? "#ef4444" : color }}
                                >
                                    {unlimited
                                        ? <span className="db-bar-unlimited">∞ Sin límite</span>
                                        : `${used} / ${limit} (${pct}%)`
                                    }
                                </span>
                            ) : (
                                <span className="db-bar-loading">Cargando…</span>
                            )}
                        </div>
                        <div className="bar-track">
                            <div
                                className="bar-fill"
                                style={{
                                    width: `${unlimited ? 100 : pct}%`,
                                    background: barGradient(color, unlimited, pct),
                                }}
                            />
                        </div>
                        {/* Aviso cuando el límite está casi alcanzado */}
                        {!unlimited && pct >= 90 && (
                            <p className="db-bar-warning">⚠ Límite casi alcanzado</p>
                        )}
                    </div>
                ))}

                {/* ── Desglose por período ── */}
                {temporal.length > 0 && (
                    <>
                        <div className="divider">
                            <span className="divider-label">MENSAJES POR PERÍODO</span>
                        </div>
                        <div className="db-temporal-grid">
                            {temporal.map(({ label, value }) => (
                                <div key={label} className="stat-card text-center db-stat-card-sm">
                                    <div className="font-cinzel db-stat-value">{value}</div>
                                    <div className="db-stat-label">{label}</div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div className="divider">
                    <span className="divider-label">RESUMEN GLOBAL</span>
                </div>

                {/* ── Resumen global ── */}
                <div className="db-summary-grid">
                    {summary.map(({ label, value }) => (
                        <div key={label} className="stat-card text-center db-stat-card-md">
                            <div className="font-cinzel db-stat-value">{value}</div>
                            <div className="db-stat-label">{label}</div>
                        </div>
                    ))}
                </div>

                {/* ── Archivos por extensión ── */}
                {stats && Object.keys(stats.files.by_type).length > 0 && (
                    <>
                        <div className="divider">
                            <span className="divider-label">ARCHIVOS POR TIPO</span>
                        </div>
                        <div className="db-file-types">
                            {Object.entries(stats.files.by_type).map(([ext, count]) => (
                                <span key={ext} className="type-badge">.{ext} · {count}</span>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}