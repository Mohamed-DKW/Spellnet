import HeaderDecorator from "../HeaderDecorator";
import Section1 from "./sections/Section1";
import Section2 from "./sections/Section2";
import Section3 from "./sections/Section3";
import Section4 from "./sections/Section4";
import Section5 from "./sections/Section5";
import Section6 from "./sections/Section6";
import Section7 from "./sections/Section7";
import Section8 from "./sections/Section8";
import Section9 from "./sections/Section9";
import Section10 from "./sections/Section10";
interface Props {
    fullSubject: string
    setSubjectSuffix: React.Dispatch<React.SetStateAction<string>>;
}

export default function FullParchment({ fullSubject, setSubjectSuffix }: Props) {
    return (
        <div
            className="relative min-h-screen py-16 px-4 z-10 cincel"
        >
            <div className="max-w-4xl mx-auto">
                {/* Header decorativo */}
                <HeaderDecorator />

                {/* Contenedor del pergamino */}
                <div className="bg-gradient-to-br from-amber-950/60 to-black/80 backdrop-blur-sm border-2 border-amber-700/50 rounded-lg shadow-2xl p-8 md:p-12">

                    {/* Fecha de actualización */}
                    <div className="text-amber-400 text-sm mb-8 pb-4 border-b border-amber-800/30">
                        Última actualización: Febrero 2026
                    </div>

                    {/* Sección 1 */}
                    <Section1 />

                    {/* Sección 2 */}
                    <Section2 />

                    {/* Sección 3 */}
                    <Section3 />

                    {/* Sección 4 */}
                    <Section4 />

                    {/* Sección 5 */}
                    <Section5 />

                    {/* Sección 6 */}
                    <Section6 />

                    {/* Sección 7 */}
                    <Section7 />

                    {/* Sección 8 */}
                    <Section8 />

                    {/* Sección 9 */}
                    <Section9 />

                    {/* Sección 10 */}
                    <Section10 fullSubject={fullSubject} setSubjectSuffix={setSubjectSuffix} />

                    {/* Botón de volver */}
                    <div className="mt-12 pt-8 border-t border-amber-800/30"></div>
                </div>
            </div>
            <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
        `}</style>
        </div>
    )
}