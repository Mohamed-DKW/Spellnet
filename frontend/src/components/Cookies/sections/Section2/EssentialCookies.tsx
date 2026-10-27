import Section2Props from "../types/Section2Props"
export default function EssentialCookies({expandedSection, toggleSection} : Section2Props) {
    return (
        <div className="mb-6">
            <button
                onClick={() => toggleSection('essential')}
                className="w-full flex items-center justify-between bg-black/40 border border-amber-700/40 rounded-lg p-4 hover:border-amber-600 transition-colors duration-200"
            >
                <div className="flex items-center">
                    <span className="text-2xl mr-3">🔑</span>
                    <h3 className="text-xl font-bold text-amber-300">2.1 Cookies Esenciales</h3>
                </div>
                <span className="text-amber-400">{expandedSection === 'essential' ? '▼' : '▶'}</span>
            </button>
            {expandedSection === 'essential' && (
                <div className="bg-black/20 border border-amber-800/20 rounded-b-lg p-6 mt-1">
                    <p className="text-amber-200/90 mb-3">
                        Son necesarias para el funcionamiento básico de Spellnet. Sin ellas, algunas
                        partes del sitio no funcionarían correctamente.
                    </p>
                    <div className="space-y-3">
                        <div className="bg-amber-950/30 p-3 rounded">
                            <p className="text-amber-300 font-bold mb-1">session_id</p>
                            <p className="text-amber-200/80 text-sm mb-1">Duración: Sesión del navegador</p>
                            <p className="text-amber-200/80 text-sm">Propósito: Mantiene tu sesión iniciada mientras navegas por la plataforma</p>
                        </div>
                        <div className="bg-amber-950/30 p-3 rounded">
                            <p className="text-amber-300 font-bold mb-1">csrf_token</p>
                            <p className="text-amber-200/80 text-sm mb-1">Duración: Sesión del navegador</p>
                            <p className="text-amber-200/80 text-sm">Propósito: Protege contra ataques de falsificación de solicitudes</p>
                        </div>
                        <div className="bg-amber-950/30 p-3 rounded">
                            <p className="text-amber-300 font-bold mb-1">auth_token</p>
                            <p className="text-amber-200/80 text-sm mb-1">Duración: 30 días (o hasta cerrar sesión)</p>
                            <p className="text-amber-200/80 text-sm">Propósito: Autentica tu identidad en el sistema</p>
                        </div>
                    </div>
                    <p className="text-amber-400 text-sm mt-4 italic">
                        ⚠️ Estas cookies no se pueden deshabilitar sin afectar el funcionamiento de la plataforma.
                    </p>
                </div>
            )}
        </div>
    )
}