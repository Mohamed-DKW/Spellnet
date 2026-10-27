import { Link } from "react-router-dom";

export default function Section6() {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4 flex items-center">
                <span className="text-amber-600 mr-3">ℹ️</span>
                6. Más Información
            </h2>
            <p className="text-amber-200/90 leading-relaxed mb-4">
                Para obtener más información sobre cómo protegemos tu privacidad, consulta:
            </p>
            <div className="flex gap-4">
                <Link
                    to="/privacidad"
                    className="px-6 py-2 bg-amber-900/60 text-amber-100 hover:bg-amber-800/80 border-2 border-amber-700 hover:border-amber-500 transition-all duration-300 rounded"
                >
                    Política de Privacidad
                </Link>
                <Link
                    to="/terminos"
                    className="px-6 py-2 bg-amber-900/60 text-amber-100 hover:bg-amber-800/80 border-2 border-amber-700 hover:border-amber-500 transition-all duration-300 rounded"
                >
                    Términos de Servicio
                </Link>
            </div>
        </section>
    )
}