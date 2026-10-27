import { useEffect, useState } from 'react';
import ImageTheme from '../components/Terminos/ImageTheme';

import FullParchment from '../components/Terminos/parchment/FullParchment';

export default function Terminos() {
    const BASE_SUBJECT = "Consulta sobre Términos de Servicio";
    const [subjectSuffix, setSubjectSuffix] = useState("");
    const fullSubject = subjectSuffix ? `${BASE_SUBJECT} - ${subjectSuffix}` : BASE_SUBJECT;

    useEffect(() => {
        document.title = "Términos de Servicio - Spellnet";
    }, []);

    return (
        <>
            {/* Fondo con imagen fija */}
            <ImageTheme />

            {/* Filtro oscuro sobre el fondo */}
            <div className="fixed inset-0 bg-black/75 -z-10"></div>            
            {/* Contenido */}
            <FullParchment fullSubject={fullSubject} setSubjectSuffix={setSubjectSuffix} />
        </>
    );
}
