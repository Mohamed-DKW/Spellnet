export default function Section2() {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4 flex items-center">
                <span className="text-amber-600 mr-3">🗡️</span>
                2. Descripción del Servicio
            </h2>
            <p className="text-amber-200/90 leading-relaxed mb-4">
                Spellnet proporciona:
            </p>
            <ul className="text-amber-200/90 space-y-2 ml-6">
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span>Acceso a modelos de IA mediante Ollama para procesamiento de lenguaje natural</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span>Funcionalidades de RAG para búsqueda y generación aumentada de respuestas</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span>Almacenamiento y gestión de tus propios datos para consultas personalizadas</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span>Diferentes planes de suscripción: Goblin (Gratis), Wizard ($20/mes) y Elder Dragon ($50/mes)</span>
                </li>
            </ul>
        </section>
    )
}