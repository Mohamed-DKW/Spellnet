export default function Section6() {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4 flex items-center">
                <span className="text-amber-600 mr-3">⏰</span>
                6. Retención de Datos
            </h2>
            <p className="text-amber-200/90 leading-relaxed mb-4">
                Conservamos tu información personal solo durante el tiempo necesario para:
            </p>
            <ul className="text-amber-200/90 space-y-2 ml-6">
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span>Proporcionar nuestros servicios mientras mantengas una cuenta activa</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span>Cumplir con obligaciones legales, fiscales o contables</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span>Resolver disputas y hacer cumplir nuestros acuerdos</span>
                </li>
            </ul>
            <p className="text-amber-200/90 leading-relaxed mt-4">
                Cuando elimines tu cuenta, borraremos o anonimizaremos tus datos personales, salvo que
                debamos conservarlos por obligaciones legales.
            </p>
        </section>
    )
}