export default function Section1() {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4 flex items-center">
                <span className="text-amber-600 mr-3">📊</span>
                1. Información que Recopilamos
            </h2>

            <h3 className="text-xl font-bold text-amber-300 mb-3 mt-6">1.1 Información que nos proporcionas:</h3>
            <ul className="text-amber-200/90 space-y-2 ml-6 mb-4">
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span><strong>Datos de registro:</strong> Nombre de usuario, correo electrónico, contraseña (encriptada)</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span><strong>Información de pago:</strong> Datos de facturación para suscripciones premium</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span><strong>Contenido del usuario:</strong> Documentos, textos y datos que subes para usar con el RAG</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span><strong>Comunicaciones:</strong> Mensajes que nos envías a través del formulario de contacto</span>
                </li>
            </ul>

            <h3 className="text-xl font-bold text-amber-300 mb-3 mt-6">1.2 Información recopilada automáticamente:</h3>
            <ul className="text-amber-200/90 space-y-2 ml-6">
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span><strong>Datos de uso:</strong> Interacciones con la plataforma, consultas realizadas, funcionalidades utilizadas</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span><strong>Información técnica:</strong> Dirección IP, tipo de navegador, sistema operativo, configuración de idioma</span>
                </li>
                <li className="flex items-start">
                    <span className="text-amber-600 mr-2">→</span>
                    <span><strong>Cookies y tecnologías similares:</strong> Para mejorar tu experiencia (ver Política de Cookies)</span>
                </li>
            </ul>
        </section>
    )
}