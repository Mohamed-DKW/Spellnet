interface Props {
    fullSubject: string
    setSubjectSuffix: React.Dispatch<React.SetStateAction<string>>;
}
export default function Section7({ fullSubject, setSubjectSuffix }: Props) {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4 flex items-center">
                <span className="text-amber-600 mr-3">✉️</span>
                7. Contacto
            </h2>
            <p className="text-amber-200/90 leading-relaxed mb-6">
                ¿Tienes preguntas sobre el uso de cookies en Spellnet o quieres gestionar tus
                preferencias? Escríbenos y te responderemos en un plazo de 72 horas.
            </p>
            <div className="bg-black/30 border border-amber-700/40 rounded-lg p-6">
                <h3 className="text-lg font-bold text-amber-300 mb-5 flex items-center">
                    <span className="mr-2">🍪</span> Gestión de Cookies
                </h3>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-amber-200 text-sm font-medium mb-1">Nombre</label>
                            <input
                                type="text"
                                placeholder="Tu nombre"
                                className="w-full px-4 py-2 bg-black/40 border border-amber-700/40 rounded text-amber-100 placeholder-amber-700/60 focus:outline-none focus:border-amber-500 transition-colors duration-200 cincel"
                            />
                        </div>
                        <div>
                            <label className="block text-amber-200 text-sm font-medium mb-1">Correo</label>
                            <input
                                type="email"
                                placeholder="tu@correo.com"
                                className="w-full px-4 py-2 bg-black/40 border border-amber-700/40 rounded text-amber-100 placeholder-amber-700/60 focus:outline-none focus:border-amber-500 transition-colors duration-200 cincel"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-amber-200 text-sm font-medium mb-2">Asunto</label>
                        <div className="rounded-lg overflow-hidden border border-amber-700/40">
                            <div className="px-4 py-2 bg-amber-900/40 border-b border-amber-700/40 flex items-center justify-between">
                                <span className="text-amber-400 text-xs uppercase tracking-widest font-bold">Vista previa del asunto</span>
                                <span className="text-amber-200 text-xs italic truncate ml-3">{fullSubject}</span>
                            </div>
                            <select
                                onChange={(e) => setSubjectSuffix(e.target.value)}
                                className="w-full px-4 py-2.5 bg-black/40 text-amber-100 focus:outline-none transition-colors duration-200 cincel"
                            >
                                <option value="">Selecciona un motivo</option>
                                <option value="Retirar consentimiento">Retirar consentimiento</option>
                                <option value="Más información">Más información sobre cookies</option>
                                <option value="Eliminar mis cookies">Eliminar mis cookies</option>
                                <option value="Cookies de terceros">Cookies de terceros</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <input type="hidden" name="subject" value={fullSubject} />
                    </div>
                    <div>
                        <label className="block text-amber-200 text-sm font-medium mb-1">Mensaje</label>
                        <textarea
                            placeholder="Describe tu consulta..."
                            rows={4}
                            className="w-full px-4 py-2 bg-black/40 border border-amber-700/40 rounded text-amber-100 placeholder-amber-700/60 focus:outline-none focus:border-amber-500 transition-colors duration-200 resize-none cincel"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-amber-700 to-amber-800 text-amber-100 font-bold rounded border border-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-200 cincel"
                    >
                        Enviar Consulta
                    </button>
                </form>
            </div>
        </section>
    )
}