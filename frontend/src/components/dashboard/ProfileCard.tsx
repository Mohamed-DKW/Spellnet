// ── ProfileCard ───────────────────────────────────────────────────────────────
// Tarjeta de perfil del usuario ubicada en la columna izquierda del dashboard.
// Muestra avatar con inicial, nombre, email, fecha de registro y clase activa.
// La barra de nivel está reservada para una futura funcionalidad de gamificación.

import type { ApiUser, PlanDef } from "./dashboard.types";
import { getInitial } from "./dashboard.constants";

interface ProfileCardProps {
    user: ApiUser;
    planDef: PlanDef;
    joinDate: string;
}

export default function ProfileCard({ user, planDef, joinDate }: ProfileCardProps) {
    return (
        <div className="panel db-2">
            <div className="p-8 flex flex-col items-center text-center">

                {/* Avatar circular con la inicial del nombre */}
                <div className="avatar mb-4">{getInitial(user.name)}</div>

                <h2 className="font-cinzel db-profile-name">{user.name}</h2>
                <p className="db-profile-email">{user.email}</p>

                <div className="divider w-full">
                    <span className="divider-label">AVENTURERO</span>
                </div>

                {/* Fecha de registro y clase activa */}
                <div className="w-full db-profile-meta">
                    <div className="db-profile-meta-row">
                        <span className="db-meta-key">Miembro desde</span>
                        <span className="db-meta-value">{joinDate}</span>
                    </div>
                    <div className="db-profile-meta-row">
                        <span className="db-meta-key">Clase</span>
                        {/* El color del plan es dinámico y viene de la BD */}
                        <span style={{ color: planDef.color }}>{planDef.name}</span>
                    </div>
                </div>

                <div className="divider w-full">
                    <span className="divider-label">NIVEL</span>
                </div>

                {/* Sistema de niveles pendiente de implementar en el backend */}
                <div className="w-full">
                    <div className="db-level-header">
                        <span className="font-cinzel db-level-label">Nivel —</span>
                        <span className="db-level-soon">Próximamente</span>
                    </div>
                    <div className="bar-track">
                        <div className="bar-fill db-level-bar" />
                    </div>
                    <p className="db-level-note">Sistema de niveles en desarrollo</p>
                </div>
            </div>
        </div>
    );
}