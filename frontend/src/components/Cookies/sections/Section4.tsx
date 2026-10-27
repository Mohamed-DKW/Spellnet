export default function Section4() {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4 flex items-center">
                <span className="text-amber-600 mr-3">🌐</span>
                4. Cookies de Terceros
            </h2>
            <p className="text-amber-200/90 leading-relaxed mb-4">
                Spellnet puede utilizar servicios de terceros que establecen sus propias cookies:
            </p>
            <ul className="text-amber-200/90 space-y-2 ml-6">
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span><strong>Google Analytics:</strong> Para análisis de uso y estadísticas</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span><strong>Procesadores de pago:</strong> Para gestionar suscripciones de forma segura</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span><strong>CDN (Content Delivery Network):</strong> Para mejorar velocidades de carga</span>
                </li>
            </ul>
            <p className="text-amber-200/90 leading-relaxed mt-4">
                Estas cookies están sujetas a las políticas de privacidad de los respectivos terceros.
            </p>
        </section>
    )
}