import Section2Props from "../types/Section2Props";
export default function AnalyticsCookies({ expandedSection, toggleSection }: Section2Props) {
    return (
        <div className="mb-6">
            <button
                onClick={() => toggleSection('analytics')}
                className="w-full flex items-center justify-between bg-black/40 border border-amber-700/40 rounded-lg p-4 hover:border-amber-600 transition-colors duration-200"
            >
                <div className="flex items-center">
                    <span className="text-2xl mr-3">📊</span>
                    <h3 className="text-xl font-bold text-amber-300">2.3 Cookies Analíticas</h3>
                </div>
                <span className="text-amber-400">{expandedSection === 'analytics' ? '▼' : '▶'}</span>
            </button>
            {expandedSection === 'analytics' && (
                <div className="bg-black/20 border border-amber-800/20 rounded-b-lg p-6 mt-1">
                    <p className="text-amber-200/90 mb-3">
                        Nos ayudan a entender cómo los usuarios interactúan con Spellnet,
                        permitiéndonos mejorar el servicio.
                    </p>
                    <div className="space-y-3">
                        <div className="bg-amber-950/30 p-3 rounded">
                            <p className="text-amber-300 font-bold mb-1">_ga</p>
                            <p className="text-amber-200/80 text-sm mb-1">Duración: 2 años</p>
                            <p className="text-amber-200/80 text-sm">Propósito: Google Analytics - distingue usuarios únicos</p>
                        </div>
                        <div className="bg-amber-950/30 p-3 rounded">
                            <p className="text-amber-300 font-bold mb-1">_gid</p>
                            <p className="text-amber-200/80 text-sm mb-1">Duración: 24 horas</p>
                            <p className="text-amber-200/80 text-sm">Propósito: Google Analytics - distingue usuarios únicos</p>
                        </div>
                        <div className="bg-amber-950/30 p-3 rounded">
                            <p className="text-amber-300 font-bold mb-1">usage_stats</p>
                            <p className="text-amber-200/80 text-sm mb-1">Duración: 1 año</p>
                            <p className="text-amber-200/80 text-sm">Propósito: Recopila estadísticas sobre funcionalidades más utilizadas</p>
                        </div>
                    </div>
                    <p className="text-amber-400 text-sm mt-4 italic">
                        💡 Estas cookies no identifican personalmente a los usuarios.
                    </p>
                </div>
            )}
        </div>
    )
}