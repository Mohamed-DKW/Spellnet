import { useEffect, useState } from 'react';
import ImageTheme from '../components/Terminos/ImageTheme';

import FullCookies from '../components/Cookies/FullCookies';

export default function Cookies() {
    const BASE_SUBJECT = "Consulta sobre Política de Cookies";
    const [subjectSuffix, setSubjectSuffix] = useState("");
    const fullSubject = subjectSuffix ? `${BASE_SUBJECT} - ${subjectSuffix}` : BASE_SUBJECT;

    useEffect(() => {
        document.title = "Política de Cookies - Spellnet";
    }, []);

    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    return (
        <>
            {/* Fondo con imagen fija */}
            <ImageTheme />

            {/* Filtro oscuro sobre el fondo */}
            <div className="fixed inset-0 bg-black/75 -z-10"></div>

            {/* Contenido */}
            <FullCookies toggleSection={toggleSection}
            expandedSection={expandedSection}
            fullSubject={fullSubject}
            setSubjectSuffix={setSubjectSuffix}
            />
        </>
    );
}
