export default function Section5() {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4 flex items-center">
                <span className="text-amber-600 mr-3">🔐</span>
                5. Seguridad de los Datos
            </h2>
            <p className="text-amber-200/90 leading-relaxed mb-4">
                Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos:
            </p>
            <ul className="text-amber-200/90 space-y-2 ml-6">
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span>Encriptación de datos en tránsito (HTTPS/SSL) y en reposo</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span>Contraseñas hasheadas con algoritmos seguros</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span>Acceso restringido a datos personales solo para personal autorizado</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span>Monitoreo continuo de seguridad y actualizaciones regulares</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span>Copias de seguridad regulares para prevenir pérdida de datos</span>
                </li>
            </ul>
            <p className="text-amber-200/90 leading-relaxed mt-4">
                Sin embargo, ningún sistema es 100% seguro. Te recomendamos usar contraseñas fuertes y
                no compartir tus credenciales.
            </p>
        </section>
    )
}