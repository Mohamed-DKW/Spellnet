export default function Section3() {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4 flex items-center">
                <span className="text-amber-600 mr-3">🛡️</span>
                3. Registro y Cuentas de Usuario
            </h2>
            <p className="text-amber-200/90 leading-relaxed mb-4">
                Para utilizar ciertas funcionalidades de Spellnet, debes crear una cuenta proporcionando
                información precisa y completa. Eres responsable de:
            </p>
            <ul className="text-amber-200/90 space-y-2 ml-6">
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span>Mantener la confidencialidad de tu contraseña</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span>Todas las actividades que ocurran bajo tu cuenta</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span>Notificarnos inmediatamente de cualquier uso no autorizado</span>
                </li>
            </ul>
        </section>
    )
}