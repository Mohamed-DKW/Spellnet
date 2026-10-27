export default function FeaturesSection() {
    return (
        <div className="mb-16">
            <h3 className="text-3xl font-bold text-amber-100 text-center mb-10">Los Pilares de Nuestra Magia</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        icon: '📜',
                        title: 'Tecnología RAG',
                        description: 'Nuestro núcleo mágico: Retrieval-Augmented Generation. Como un bibliotecario arcano, busca, comprende y sintetiza conocimiento de miles de pergaminos digitales al instante.',
                        level: 'Épico',
                        colorFrom: 'from-amber-600',
                        colorTo: 'to-amber-800',
                        borderColor: 'border-amber-600/30',
                        hoverBorderColor: 'border-amber-500/50',
                        glowColor: 'amber'
                    },
                    {
                        icon: '🔮',
                        title: 'IA Evolutiva',
                        description: 'Un familiar digital que crece contigo. Aprende de tus pergaminos, adapta sus conjuros a tu estilo y se vuelve más sabio con cada consulta.',
                        level: 'Legendario',
                        colorFrom: 'from-purple-600',
                        colorTo: 'to-purple-800',
                        borderColor: 'border-purple-600/30',
                        hoverBorderColor: 'border-purple-500/50',
                        glowColor: 'purple'
                    },
                    {
                        icon: '🛡️',
                        title: 'Seguridad Arcano',
                        description: 'Tus secretos están protegidos por escudos mágicos de grado militar. Criptografía élfica, barreras de fuego digital y sellos de confidencialidad.',
                        level: 'Ancestral',
                        colorFrom: 'from-red-600',
                        colorTo: 'to-red-800',
                        borderColor: 'border-red-600/30',
                        hoverBorderColor: 'border-red-500/50',
                        glowColor: 'red'
                    }
                ].map((pilar, index) => (
                    <div key={index} className="flex flex-col h-full">
                        <div className="relative group h-full">
                            <div className={`absolute -inset-0.5 bg-gradient-to-br ${pilar.colorFrom} ${pilar.colorTo} rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                            <div className={`relative bg-gradient-to-b from-black/50 to-${pilar.glowColor}-950/20 border-2 ${pilar.borderColor} rounded-xl p-7 h-full transition-all duration-300 group-hover:translate-y-[-5px] group-hover:${pilar.hoverBorderColor} group-hover:shadow-xl group-hover:shadow-${pilar.glowColor}-900/20 flex flex-col`}>
                                <div className="flex items-center mb-5">
                                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${pilar.colorFrom} ${pilar.colorTo} flex items-center justify-center mr-4 shadow-lg shadow-${pilar.glowColor}-900/30`}>
                                        <span className="text-3xl">{pilar.icon}</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-amber-100">{pilar.title}</h4>
                                </div>
                                <p className="text-amber-200/80 mb-5 flex-grow leading-relaxed">
                                    {pilar.description}
                                </p>
                                <div className="flex items-center text-amber-300 text-sm pt-4 border-t border-amber-800/20">
                                    <span className="mr-2">{
                                        pilar.icon === '📜' ? '✨' :
                                            pilar.icon === '🔮' ? '⚡' : '🛡️'
                                    }</span>
                                    <span>Hechizo de nivel: <span className="font-bold">{pilar.level}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}