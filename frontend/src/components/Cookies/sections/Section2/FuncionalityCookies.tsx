import Section2Props from "../types/Section2Props";
export default function FuncionalityCookies({ expandedSection, toggleSection }: Section2Props) {
    return (
        <div className="mb-6">
            <button
                onClick={() => toggleSection('functionality')}
                className="w-full flex items-center justify-between bg-black/40 border border-amber-700/40 rounded-lg p-4 hover:border-amber-600 transition-colors duration-200"
            >
                <div className="flex items-center">
                    <span className="text-2xl mr-3">⚙️</span>
                    <h3 className="text-xl font-bold text-amber-300">2.2 Cookies de Funcionalidad</h3>
                </div>
                <span className="text-amber-400">{expandedSection === 'functionality' ? '▼' : '▶'}</span>
            </button>
            {expandedSection === 'functionality' && (
                <div className="bg-black/20 border border-amber-800/20 rounded-b-lg p-6 mt-1">
                    <p className="text-amber-200/90 mb-3">
                        Permiten que el sitio recuerde tus elecciones y preferencias para ofrecerte
                        funcionalidades mejoradas y personalizadas.
                    </p>
                    <div className="space-y-3">
                        <div className="bg-amber-950/30 p-3 rounded">
                            <p className="text-amber-300 font-bold mb-1">user_preferences</p>
                            <p className="text-amber-200/80 text-sm mb-1">Duración: 1 año</p>
                            <p className="text-amber-200/80 text-sm">Propósito: Guarda tus preferencias de idioma, tema visual y configuración</p>
                        </div>
                        <div className="bg-amber-950/30 p-3 rounded">
                            <p className="text-amber-300 font-bold mb-1">plan_selected</p>
                            <p className="text-amber-200/80 text-sm mb-1">Duración: 30 días</p>
                            <p className="text-amber-200/80 text-sm">Propósito: Recuerda tu selección de plan (Goblin/Wizard/Elder Dragon) durante el proceso de registro</p>
                        </div>
                        <div className="bg-amber-950/30 p-3 rounded">
                            <p className="text-amber-300 font-bold mb-1">last_model</p>
                            <p className="text-amber-200/80 text-sm mb-1">Duración: 90 días</p>
                            <p className="text-amber-200/80 text-sm">Propósito: Recuerda el último modelo de Ollama que utilizaste</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}