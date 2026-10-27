export default function Section3() {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4 flex items-center">
                <span className="text-amber-600 mr-3">🎛️</span>
                3. Cómo Gestionar las Cookies
            </h2>
            <p className="text-amber-200/90 leading-relaxed mb-4">
                Tienes el control total sobre las cookies (excepto las esenciales). Puedes gestionarlas de varias formas:
            </p>

            <h3 className="text-xl font-bold text-amber-300 mb-3 mt-6">3.1 Configuración del Navegador:</h3>
            <p className="text-amber-200/90 leading-relaxed mb-3">
                La mayoría de navegadores te permiten controlar las cookies a través de su configuración:
            </p>
            <div className="bg-black/30 border border-amber-800/30 rounded-lg p-6 space-y-3">
                <div className="flex items-start">
                    <span className="text-amber-600 mr-3 font-bold">Chrome:</span>
                    <span className="text-amber-200/90">Configuración → Privacidad y seguridad → Cookies</span>
                </div>
                <div className="flex items-start">
                    <span className="text-amber-600 mr-3 font-bold">Firefox:</span>
                    <span className="text-amber-200/90">Opciones → Privacidad y seguridad → Cookies</span>
                </div>
                <div className="flex items-start">
                    <span className="text-amber-600 mr-3 font-bold">Safari:</span>
                    <span className="text-amber-200/90">Preferencias → Privacidad → Cookies</span>
                </div>
                <div className="flex items-start">
                    <span className="text-amber-600 mr-3 font-bold">Edge:</span>
                    <span className="text-amber-200/90">Configuración → Privacidad → Cookies</span>
                </div>
            </div>

            <h3 className="text-xl font-bold text-amber-300 mb-3 mt-6">3.2 Panel de Preferencias de Spellnet:</h3>
            <p className="text-amber-200/90 leading-relaxed mb-3">
                Puedes gestionar tus preferencias de cookies directamente desde tu cuenta en la sección de Configuración.
            </p>

            <div className="bg-amber-950/30 border border-amber-700/50 rounded-lg p-6 mt-4">
                <p className="text-amber-300 font-bold mb-2">⚠️ Importante:</p>
                <p className="text-amber-200/90">
                    Si bloqueas o eliminas cookies, algunas funcionalidades de Spellnet pueden no funcionar
                    correctamente. Por ejemplo, es posible que tengas que iniciar sesión cada vez que visites
                    la plataforma.
                </p>
            </div>
        </section>
    )
}