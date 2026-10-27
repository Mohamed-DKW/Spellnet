// ── FormLogo ──────────────────────────────────────────────────────────────────
// Logo lateral decorativo, visible solo en pantallas grandes (lg+).

import { Link } from "react-router-dom";

export default function FormLogo() {
    return (
        <div className="hidden lg:block">
            <Link to="/" className="group transition-all duration-300 hover:scale-125">
                <div className="relative">
                    <img
                        className="w-80 h-80 object-contain transition-transform duration-300 group-hover:scale-110"
                        src="/img/icono-login_registro.png"
                        alt="Spellnet Logo"
                    />
                    <div className="absolute inset-0 bg-amber-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            </Link>
            <div className="text-center mt-4">
                <p className="text-amber-300 text-xl font-medium">Tu IA. Tus datos. Tu poder.</p>
            </div>
        </div>
    );
}