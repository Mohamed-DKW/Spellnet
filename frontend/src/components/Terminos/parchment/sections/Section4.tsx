export default function Section4() {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4 flex items-center">
                <span className="text-amber-600 mr-3">📜</span>
                4. Uso Aceptable
            </h2>
            <p className="text-amber-200/90 leading-relaxed mb-4">
                Te comprometes a NO utilizar Spellnet para:
            </p>
            <ul className="text-amber-200/90 space-y-2 ml-6">
                <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>Actividades ilegales o que violen derechos de terceros</span>
                </li>
                <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>Transmitir contenido malicioso, virus o código dañino</span>
                </li>
                <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>Intentar acceder sin autorización a otros sistemas o cuentas</span>
                </li>
                <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>Sobrecargar o interferir con la infraestructura del servicio</span>
                </li>
                <li className="flex items-start">
                    <span className="text-red-600 mr-2">✗</span>
                    <span>Utilizar el servicio para generar contenido discriminatorio, odioso o ilegal</span>
                </li>
            </ul>
        </section>
    )
}