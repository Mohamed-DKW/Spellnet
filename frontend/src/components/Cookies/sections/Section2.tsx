import AnalyticsCookies from "./Section2/AnalyticsCookies"
import EssentialCookies from "./Section2/EssentialCookies"
import FuncionalityCookies from "./Section2/FuncionalityCookies"
import PerformanceCookies from "./Section2/PerformanceCookies"
import Section2Props from "./types/Section2Props"
export default function Section2({ toggleSection, expandedSection }: Section2Props) {
    return (

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4 flex items-center">
                <span className="text-amber-600 mr-3">📋</span>
                2. Tipos de Cookies que Utilizamos
            </h2>

            {/* Cookie Esenciales */}
            <EssentialCookies expandedSection={expandedSection} toggleSection={toggleSection} />

            {/* Cookies de Funcionalidad */}
            <FuncionalityCookies expandedSection={expandedSection} toggleSection={toggleSection} />

            {/* Cookies Analíticas */}
            <AnalyticsCookies expandedSection={expandedSection} toggleSection={toggleSection} />

            {/* Cookies de Rendimiento */}
            <PerformanceCookies expandedSection={expandedSection} toggleSection={toggleSection} />
        </section>
    )
}