export default function Section5() {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4 flex items-center">
                <span className="text-amber-600 mr-3">💰</span>
                5. Planes y Pagos
            </h2>
            <div className="bg-black/30 border border-amber-800/30 rounded-lg p-6 mb-4">
                <h3 className="text-xl font-bold text-amber-300 mb-3">Planes Disponibles:</h3>
                <div className="space-y-3 text-amber-200/90">
                    <div className="flex items-start">
                        <span className="text-green-500 mr-2 font-bold">Goblin:</span>
                        <span>Plan gratuito con funcionalidades básicas</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-purple-500 mr-2 font-bold">Wizard:</span>
                        <span>$20/mes - Funcionalidades avanzadas y mayor capacidad</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-red-500 mr-2 font-bold">Elder Dragon:</span>
                        <span>$50/mes - Acceso completo y recursos premium</span>
                    </div>
                </div>
            </div>
            <p className="text-amber-200/90 leading-relaxed">
                Los pagos son procesados de forma segura. Las suscripciones se renuevan automáticamente
                a menos que las canceles antes del próximo período de facturación. No ofrecemos reembolsos
                por períodos parciales.
            </p>
        </section>
    )
}