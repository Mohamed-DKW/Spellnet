import { useEffect, useState } from 'react';
import ImageTheme from '../components/Terminos/ImageTheme';
import FullPrivacity from '../components/privacity/FullPrivacity';

export default function Privacidad() {
    const BASE_SUBJECT = "Consulta sobre Política de Privacidad";
    const [subjectSuffix, setSubjectSuffix] = useState("");
    const fullSubject = subjectSuffix ? `${BASE_SUBJECT} - ${subjectSuffix}` : BASE_SUBJECT;

    useEffect(() => {
        document.title = "Política de Privacidad - Spellnet";
    }, []);

    return (
        <>
            {/* Fondo con imagen fija */}
            <ImageTheme />

            {/* Filtro oscuro sobre el fondo */}
            <div className="fixed inset-0 bg-black/75 -z-10"></div>
            {/* Contenido */}
            <FullPrivacity fullSubject={fullSubject} setSubjectSuffix={setSubjectSuffix} />
        </>
    );
}
