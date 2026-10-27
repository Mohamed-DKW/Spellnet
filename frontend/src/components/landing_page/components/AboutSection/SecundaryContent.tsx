export default function SecundaryContent() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-600 to-yellow-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-b from-black/40 to-amber-950/20 border border-amber-700/25 rounded-xl p-6 h-full transition-all duration-300 group-hover:translate-y-[-5px] group-hover:border-amber-500/40 group-hover:shadow-lg group-hover:shadow-amber-900/10">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center mb-5 mx-auto shadow-md shadow-amber-900/30">
                        <span className="text-3xl">🏆</span>
                    </div>
                    <h4 className="text-xl font-bold text-amber-100 text-center mb-4">Nuestro Juramento</h4>
                    <p className="text-amber-200/80 text-center leading-relaxed">
                        Cada línea de código es un conjuro, cada algoritmo un ritual.
                        Prometemos magia honesta y poder accesible para todos los aventureros.
                    </p>
                </div>
            </div>

            <div className="relative group h-full">
                <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-b from-black/40 to-purple-950/20 border border-purple-700/25 rounded-xl p-6 h-full transition-all duration-300 group-hover:translate-y-[-5px] group-hover:border-purple-500/40 group-hover:shadow-lg group-hover:shadow-purple-900/10">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center mb-5 mx-auto shadow-md shadow-purple-900/30">
                        <span className="text-3xl">🌟</span>
                    </div>
                    <h4 className="text-xl font-bold text-amber-100 text-center mb-4">La Visión</h4>
                    <p className="text-amber-200/80 text-center leading-relaxed">
                        Un mundo donde cualquier bardo, guerrero o mago pueda invocar
                        la sabiduría de los siglos con un simple hechizo digital.
                    </p>
                </div>
            </div>
        </div>
    )
}