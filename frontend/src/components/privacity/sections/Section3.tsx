export default function Section3() {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4 flex items-center">
                <span className="text-amber-600 mr-3">🤝</span>
                3. Compartir tu Información
            </h2>
            <p className="text-amber-200/90 leading-relaxed mb-4">
                No vendemos tu información personal. Podemos compartir tu información solo en los siguientes casos:
            </p>
            <ul className="text-amber-200/90 space-y-3 ml-6">
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <div>
                        <strong className="text-amber-300">Proveedores de servicios:</strong> Empresas que nos ayudan a operar la plataforma
                        (hosting, procesamiento de pagos, análisis), bajo estrictos acuerdos de confidencialidad
                    </div>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <div>
                        <strong className="text-amber-300">Ollama:</strong> Tu contenido se procesa mediante modelos de Ollama para
                        proporcionar el servicio de IA
                    </div>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <div>
                        <strong className="text-amber-300">Cumplimiento legal:</strong> Cuando sea requerido por ley, orden judicial
                        o autoridades competentes
                    </div>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <div>
                        <strong className="text-amber-300">Protección de derechos:</strong> Para proteger nuestros derechos, propiedad
                        o seguridad, así como los de nuestros usuarios
                    </div>
                </li>
            </ul>
        </section>
    )
}