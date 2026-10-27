export default function Section4() {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4 flex items-center">
                <span className="text-amber-600 mr-3">🧠</span>
                4. Uso de IA y Procesamiento de Datos
            </h2>
            <div className="bg-black/30 border border-amber-800/30 rounded-lg p-6 mb-4">
                <p className="text-amber-200/90 leading-relaxed mb-3">
                    <strong className="text-amber-300">Importante sobre el procesamiento de IA:</strong>
                </p>
                <ul className="text-amber-200/90 space-y-2 ml-4">
                    <li className="flex items-start">
                        <span className="text-amber-600 mr-2">•</span>
                        <span>Los datos que subes se utilizan para generar respuestas mediante RAG (Retrieval-Augmented Generation)</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-amber-600 mr-2">•</span>
                        <span>Utilizamos Ollama para ejecutar modelos de IA localmente, lo que mejora la privacidad</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-amber-600 mr-2">•</span>
                        <span>Tus datos NO se utilizan para entrenar modelos de IA de terceros</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-amber-600 mr-2">•</span>
                        <span>Conservamos tu contenido solo mientras uses el servicio, salvo que lo elimines antes</span>
                    </li>
                </ul>
            </div>
        </section>
    )
}