import { Link } from "react-router-dom";

export default function HeaderDecorator() {
    return (
        <div className="text-center mb-12">
            {/* Logo navegable */}
            <Link to="/" className="inline-block mb-6 group">
                <div className="relative">
                    <img
                        src="/img/icono-pagina.png"
                        alt="Spellnet"
                        className="w-36 h-36 mx-auto filter drop-shadow-[0_0_12px_rgba(251,191,36,0.6)] group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full group-hover:bg-amber-500/40 transition-all duration-300"></div>
                </div>
            </Link>
            <h1 className="text-5xl font-bold text-amber-100 mb-4">
                Política de Privacidad
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto"></div>
            <p className="text-amber-400 mt-4 text-lg">El Grimorio de la Confidencialidad</p>
        </div>
    )
}