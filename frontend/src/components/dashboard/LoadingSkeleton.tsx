// ── LoadingSkeleton ───────────────────────────────────────────────────────────
// Placeholder visual que imita la estructura del dashboard mientras se cargan
// los datos del usuario. Evita el "salto" de layout entre el estado de carga
// y el render real. Los bloques usan la clase .skeleton definida en dashboard.css,
// que aplica un efecto shimmer animado.

export default function LoadingSkeleton() {
    return (
        <div className="db-skeleton-wrapper">
            {/* Cabecera de página */}
            <div className="skeleton db-skel-title" />
            <div className="skeleton db-skel-subtitle" />

            <div className="db-grid">
                {/* Columna izquierda: avatar + nombre */}
                <div className="db-col-left">
                    <div className="panel db-skel-profile">
                        <div className="skeleton db-skel-avatar" />
                        <div className="skeleton db-skel-name" />
                        <div className="skeleton db-skel-email" />
                    </div>
                </div>

                {/* Columna derecha: panel de estadísticas */}
                <div className="db-col-right">
                    <div className="panel db-skel-stats">
                        <div className="skeleton db-skel-bar-label" />
                        <div className="skeleton db-skel-bar" />
                        <div className="skeleton db-skel-bar" />
                    </div>
                </div>
            </div>
        </div>
    );
}