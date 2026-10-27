export default function MainContent() {
    return (
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-700/20 to-amber-900/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-black/50 to-amber-950/30 border-2 border-amber-700/30 rounded-xl p-8 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-900/20">
                <div className="flex items-start mb-6">
                    <div className="mr-4 mt-1">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-900/30">
                            <span className="text-3xl">⚔️</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-amber-100 mb-2">El Origen del Hechizo</h3>
                        <p className="text-amber-200/90 leading-relaxed">
                            En las profundidades de la biblioteca digital, un grupo de magos tecnománticos
                            descubrió cómo fusionar los antiguos pergaminos con la inteligencia arcana.
                            Así nació SpellNet: un grimorio viviente que aprende, crece y evoluciona.
                        </p>
                    </div>
                </div>
                <div className="border-t border-amber-700/30 pt-6">
                    <p className="text-amber-300 italic text-lg">
                        "No creamos simples herramientas, forjamos artefactos de conocimiento
                        que respiran y aprenden con cada hechizo lanzado."
                    </p>
                </div>
            </div>
        </div>
    )
}