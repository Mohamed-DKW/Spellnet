import { Link } from "react-router-dom";

export default function Section8() {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-amber-100 mb-4 flex items-center">
                <span className="text-amber-600 mr-3">🍪</span>
                8. Cookies y Tecnologías Similares
            </h2>
            <p className="text-amber-200/90 leading-relaxed mb-4">
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia. Para más información,
                consulta nuestra{' '}
                <Link to="/cookies" className="text-amber-300 hover:text-amber-100 underline">
                    Política de Cookies
                </Link>.
            </p>
        </section>
    )
}