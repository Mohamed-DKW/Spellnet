export default function Section1() {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4 flex items-center">
                <span className="text-amber-600 mr-3">🍪</span>
                1. ¿Qué son las Cookies?
            </h2>
            <p className="text-amber-200/90 leading-relaxed mb-4">
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador,
                tablet o móvil) cuando visitas un sitio web. Permiten que el sitio web recuerde tus
                acciones y preferencias durante un período de tiempo.
            </p>
            <div className="bg-black/30 border border-amber-800/30 rounded-lg p-6">
                <p className="text-amber-300 mb-2"><strong>Las cookies nos ayudan a:</strong></p>
                <ul className="text-amber-200/90 space-y-2 ml-4">
                    <li className="flex items-start">
                        <span className="text-amber-600 mr-2">•</span>
                        <span>Mantener tu sesión iniciada mientras navegas</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-amber-600 mr-2">•</span>
                        <span>Recordar tus preferencias y configuraciones</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-amber-600 mr-2">•</span>
                        <span>Mejorar el rendimiento y funcionalidad de la plataforma</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-amber-600 mr-2">•</span>
                        <span>Comprender cómo usas Spellnet para mejorar tu experiencia</span>
                    </li>
                </ul>
            </div>
        </section>
    )
}