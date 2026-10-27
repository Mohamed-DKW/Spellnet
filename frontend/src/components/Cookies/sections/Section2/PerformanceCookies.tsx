import Section2Props from "../types/Section2Props";
export default function PerformanceCookies({ expandedSection, toggleSection }: Section2Props) {
    return (
        <div className="mb-6">
            <button
                onClick={() => toggleSection('performance')}
                className="w-full flex items-center justify-between bg-black/40 border border-amber-700/40 rounded-lg p-4 hover:border-amber-600 transition-colors duration-200"
            >
                <div className="flex items-center">
                    <span className="text-2xl mr-3">⚡</span>
                    <h3 className="text-xl font-bold text-amber-300">2.4 Cookies de Rendimiento</h3>
                </div>
                <span className="text-amber-400">{expandedSection === 'performance' ? '▼' : '▶'}</span>
            </button>
            {expandedSection === 'performance' && (
                <div className="bg-black/20 border border-amber-800/20 rounded-b-lg p-6 mt-1">
                    <p className="text-amber-200/90 mb-3">
                        Mejoran el rendimiento y velocidad de la plataforma.
                    </p>
                    <div className="space-y-3">
                        <div className="bg-amber-950/30 p-3 rounded">
                            <p className="text-amber-300 font-bold mb-1">cache_version</p>
                            <p className="text-amber-200/80 text-sm mb-1">Duración: 7 días</p>
                            <p className="text-amber-200/80 text-sm">Propósito: Gestiona el almacenamiento en caché para cargas más rápidas</p>
                        </div>
                        <div className="bg-amber-950/30 p-3 rounded">
                            <p className="text-amber-300 font-bold mb-1">load_time</p>
                            <p className="text-amber-200/80 text-sm mb-1">Duración: Sesión</p>
                            <p className="text-amber-200/80 text-sm">Propósito: Mide tiempos de carga para optimización</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}