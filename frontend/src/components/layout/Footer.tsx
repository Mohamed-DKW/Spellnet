import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-black/40 backdrop-blur-sm border-t border-amber-900/50 shadow-lg mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {/* Enlaces de Páginas - Izquierda */}
                    <div className="flex justify-center items-start ml-auto mr-0 max-w-xs">
                        <div className="space-y-4">
                            <h3
                                className="text-2xl font-bold text-amber-100 mb-6"
                                style={{ fontFamily: "'Cinzel', serif" }}
                            >
                                Páginas
                            </h3>
                            <nav className="flex flex-col space-y-3">
                                <Link to="/" className="text-amber-100 hover:text-amber-400 transition-all duration-300 text-lg group flex items-center" style={{ fontFamily: "'Cinzel', serif" }}>
                                    <span className="mr-2 text-amber-600 group-hover:text-amber-400">→</span>Inicio
                                </Link>
                                <Link
                                    to="/chats"
                                    className="text-amber-100 hover:text-amber-400 transition-all duration-300 text-lg group flex items-center"
                                    style={{ fontFamily: "'Cinzel', serif" }}
                                >
                                    <span className="mr-2 text-amber-600 group-hover:text-amber-400">→</span>Chat
                                </Link>
                                <Link to="/terminos" className="text-amber-100 hover:text-amber-400 transition-all duration-300 text-lg group flex items-center" style={{ fontFamily: "'Cinzel', serif" }}>
                                    <span className="mr-2 text-amber-600 group-hover:text-amber-400">→</span>Términos de Servicio
                                </Link>
                                <Link to="/privacidad" className="text-amber-100 hover:text-amber-400 transition-all duration-300 text-lg group flex items-center" style={{ fontFamily: "'Cinzel', serif" }}>
                                    <span className="mr-2 text-amber-600 group-hover:text-amber-400">→</span>Política de Privacidad
                                </Link>
                                <Link to="/cookies" className="text-amber-100 hover:text-amber-400 transition-all duration-300 text-lg group flex items-center" style={{ fontFamily: "'Cinzel', serif" }}>
                                    <span className="mr-2 text-amber-600 group-hover:text-amber-400">→</span>Política de Cookies
                                </Link>
                            </nav>
                        </div>
                    </div>
                    {/* Separador con Logo - Centro */}
                    <div className="hidden md:flex flex-col items-center justify-start relative min-h-[400px]">
                        <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-amber-700 to-transparent"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 group cursor-pointer">
                            <div className="relative transition-transform duration-300 group-hover:scale-110">
                                <img src="/img/icono-pagina.png" alt="Spellnet Logo" className="w-[30mm] h-[30mm] object-contain filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Formulario de Contacto - Derecha */}
                    <div>
                        <h3 className="text-2xl font-bold text-amber-100 mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
                            Contáctanos
                        </h3>
                        <form className="footer-form">
                            <input type="text" placeholder="Asunto" className="footer-input" />
                            <div className="footer-row">
                                <input type="text" placeholder="Nombre" className="footer-input" />
                                <input type="email" placeholder="Correo" className="footer-input" />
                            </div>
                            <textarea placeholder="Mensaje" rows={4} className="footer-input footer-textarea"></textarea>
                            <button type="submit" className="footer-btn">Enviar Mensaje</button>
                        </form>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-amber-900/30 text-center">
                    <p className="text-amber-700 text-sm" style={{ fontFamily: "'Cinzel', serif" }}>
                        © 2026 Spellnet. Todos los derechos reservados.
                    </p>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');

                .footer-form {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    width: 100%;
                }
                .footer-row {
                    display: flex;
                    flex-direction: row;
                    gap: 12px;
                    width: 100%;
                }
                .footer-row .footer-input {
                    width: calc(50% - 6px);
                    flex: none;
                }
                .footer-input {
                    width: 100%;
                    padding: 8px 16px;
                    background: rgba(0,0,0,0.3);
                    border: 2px solid rgba(120,53,15,0.5);
                    border-radius: 4px;
                    color: #fef3c7;
                    font-family: 'Cinzel', serif;
                    box-sizing: border-box;
                }
                .footer-textarea {
                    resize: none;
                }
                .footer-input::placeholder {
                    color: rgba(180,83,9,0.7);
                }
                .footer-input:focus {
                    outline: none;
                    border-color: rgba(217,119,6,0.8);
                }
                .footer-btn {
                    width: 100%;
                    padding: 8px 16px;
                    background: rgba(120,53,15,0.6);
                    border: 2px solid rgba(180,83,9,0.7);
                    border-radius: 4px;
                    color: #fef3c7;
                    font-family: 'Cinzel', serif;
                    cursor: pointer;
                    box-sizing: border-box;
                    transition: all 0.3s;
                }
                .footer-btn:hover {
                    background: rgba(180,83,9,0.8);
                    border-color: rgba(245,158,11,0.8);
                }
            `}</style>
        </footer>
    );
}
