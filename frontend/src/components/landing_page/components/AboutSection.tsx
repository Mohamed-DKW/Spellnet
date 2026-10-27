import FeaturesSection from "./AboutSection/FeaturesSection"
import MainContent from "./AboutSection/MainContent"
import SecundaryContent from "./AboutSection/SecundaryContent"

export default function AboutSection() {
    return (
        <section
            className="w-full py-24 px-4 relative overflow-hidden bg-black"
        >
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center mb-6">
                        <div className="w-12 h-px bg-amber-600/40"></div>
                        <span className="mx-4 text-amber-400 text-lg tracking-widest font-cinzel">
                            ◆ EL LEGADO ◆
                        </span>
                        <div className="w-12 h-px bg-amber-600/40"></div>
                    </div>
                    <h2 className="text-5xl font-bold text-amber-100 mb-6 section-title-glow">
                        La Crónica de SpellNet
                    </h2>
                    <p className="text-amber-300 text-xl max-w-3xl mx-auto leading-relaxed">
                        Donde la magia ancestral se encuentra con la tecnología más avanzada.
                        Descubre la saga detrás del hechizo más poderoso de la era digital.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch mb-20">
                    {/* Bloque principal */}
                    <MainContent />

                    {/* Bloques secundarios */}
                    <SecundaryContent />
                </div>

                {/* Sección de características */}
                <FeaturesSection />
            </div>
        </section>
    )
}