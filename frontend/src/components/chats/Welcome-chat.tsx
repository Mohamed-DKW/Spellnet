import { motion } from "framer-motion";
import { useState } from "react";
import Chat from "../chats/Chat";

const welcomeStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700&display=swap');

  @keyframes spin3d {
    0%   { transform: rotateX(0deg)   rotateY(0deg)   rotateZ(0deg);   }
    33%  { transform: rotateX(360deg) rotateY(180deg) rotateZ(0deg);   }
    66%  { transform: rotateX(180deg) rotateY(360deg) rotateZ(180deg); }
    100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
  }

  @keyframes pulseGlow {
    0%, 100% { opacity: 0.6; }
    50%       { opacity: 1;   }
  }

  @keyframes runeGlow {
    0%, 100% { opacity: 0.2;  text-shadow: 0 0 20px rgba(251,191,36,0.2); }
    50%       { opacity: 0.55; text-shadow: 0 0 40px rgba(251,191,36,0.55), 0 0 80px rgba(251,191,36,0.2); }
  }

  @keyframes floatParticle {
    0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(-140px) translateX(20px); opacity: 0; }
  }

  .wc-title {
    font-family: 'Cinzel', serif;
    font-weight: 900;
    font-size: clamp(5rem, 12vw, 9rem);
    letter-spacing: 0.12em;
    color: #fef3c7;
    text-shadow:
      0 0 40px rgba(251,191,36,0.55),
      0 0 80px rgba(251,191,36,0.25),
      0 2px 0 rgba(0,0,0,0.8);
    line-height: 1.05;
  }

  .wc-tagline-main {
    font-family: 'Cinzel', serif;
    font-weight: 700;
    font-size: clamp(1.05rem, 2.5vw, 1.4rem);
    color: #fcd34d;
    letter-spacing: 0.04em;
  }
  .wc-tagline-sub {
    font-family: 'Cinzel', serif;
    font-weight: 400;
    font-size: clamp(0.8rem, 1.8vw, 1rem);
    color: rgba(251,191,36,0.65);
    letter-spacing: 0.08em;
  }
  .wc-hint {
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.3em;
    color: rgba(251,191,36,0.35);
    text-transform: uppercase;
  }

  .wc-separator-line {
    flex: 1; height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.3) 10%, rgba(251,191,36,0.6) 50%, rgba(251,191,36,0.3) 90%, transparent 100%);
  }
  .wc-ornament         { position:relative; margin:0 1.8rem; width:50px; height:50px; display:flex; align-items:center; justify-content:center; }
  .wc-ornament-circle  { position:absolute; width:50px; height:50px; border:2px solid rgba(251,191,36,0.5); border-radius:50%; animation:pulseGlow 3s ease-in-out infinite; }
  .wc-ornament-inner   { position:absolute; width:32px; height:32px; border:1.5px solid rgba(251,191,36,0.8); border-radius:50%; animation:pulseGlow 3s ease-in-out infinite reverse; }
  .wc-ornament-center  { position:absolute; width:10px; height:10px; background:rgba(251,191,36,0.9); border-radius:50%; box-shadow:0 0 15px rgba(251,191,36,0.8); }
  .wc-ornament-sparkle { position:absolute; width:5px; height:5px; background:rgba(251,191,36,0.9); border-radius:50%; box-shadow:0 0 10px rgba(251,191,36,0.8); }
  .wc-sp1 { top:0; left:50%; transform:translateX(-50%); }
  .wc-sp2 { top:50%; right:0; transform:translateY(-50%); }
  .wc-sp3 { bottom:0; left:50%; transform:translateX(-50%); }
  .wc-sp4 { top:50%; left:0; transform:translateY(-50%); }

  /* Dice — exact copy from landing (80px, 40px translateZ, 6s) */
  .wc-dice-container { width:80px; height:80px; perspective:400px; }
  .wc-dice { width:100%; height:100%; position:relative; transform-style:preserve-3d; animation:spin3d 6s linear infinite; }
  .wc-dice-face {
    position:absolute; width:80px; height:80px;
    border:2px solid rgba(251,191,36,0.8);
    background:linear-gradient(135deg, rgba(30,20,10,0.95), rgba(20,10,5,0.95));
    display:flex; align-items:center; justify-content:center;
    padding:12px; border-radius:12px; box-sizing:border-box;
    box-shadow:inset 0 0 15px rgba(251,191,36,0.3), 0 0 20px rgba(251,191,36,0.4);
  }
  .wc-dice-dots { width:100%; height:100%; display:grid; grid-template-columns:repeat(3,1fr); grid-template-rows:repeat(3,1fr); gap:3px; }
  .wc-dice-dot  { width:9px; height:9px; background:#fbbf24; border-radius:50%; box-shadow:0 0 8px rgba(251,191,36,0.8); margin:auto; }
  .wc-face-front  { transform:translateZ(40px); }
  .wc-face-back   { transform:rotateY(180deg) translateZ(40px); }
  .wc-face-right  { transform:rotateY(90deg) translateZ(40px); }
  .wc-face-left   { transform:rotateY(-90deg) translateZ(40px); }
  .wc-face-top    { transform:rotateX(90deg) translateZ(40px); }
  .wc-face-bottom { transform:rotateX(-90deg) translateZ(40px); }

  .rune-corner { position:absolute; font-family:'Cinzel',serif; font-size:1rem; color:rgba(251,191,36,0.18); animation:runeGlow 4s ease-in-out infinite; pointer-events:none; letter-spacing:3px; }
  .arrow-glow  { filter:drop-shadow(0 0 8px rgba(251,191,36,0.6)); }
`;

const E = () => <div />;
const Dot = () => <div className="wc-dice-dot" />;

export default function WelcomeChat() {
    const [showChat, setShowChat] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleArrowClick = () => {
        setIsTransitioning(true);
        setTimeout(() => { setShowChat(true); setIsTransitioning(false); }, 500);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden" style={{
            background: 'radial-gradient(ellipse at 60% 20%, #2a1a05 0%, #1a1208 25%, #0f0a06 55%, #080503 100%)',
        }}>
            <style>{welcomeStyles}</style>

            {/* Ambient blobs */}
            <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(251,191,36,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '0', right: '-10%', width: '45%', height: '45%', background: 'radial-gradient(ellipse, rgba(124,58,237,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Particles */}
            {!showChat && [...Array(8)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute', left: `${8 + i * 12}%`, bottom: `${8 + (i % 3) * 15}%`,
                    width: '2px', height: '2px', borderRadius: '50%',
                    background: 'rgba(251,191,36,0.7)',
                    animation: `floatParticle ${3 + i * 0.6}s ease-in-out ${i * 0.35}s infinite`,
                    boxShadow: '0 0 6px rgba(251,191,36,0.9)',
                }} />
            ))}

            {/* Rune corners */}
            {!showChat && <>
                <span className="rune-corner" style={{ top: 32, left: 40 }}>ᚠ ᚢ ᚦ</span>
                <span className="rune-corner" style={{ top: 32, right: 40 }}>ᚨ ᚱ ᚲ</span>
                <span className="rune-corner" style={{ bottom: 32, left: 40 }}>ᛊ ᛏ ᛒ</span>
                <span className="rune-corner" style={{ bottom: 32, right: 40 }}>ᛖ ᛗ ᛚ</span>
            </>}

            {/* Welcome view */}
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center gap-6"
                style={{ display: showChat ? 'none' : 'flex', pointerEvents: showChat ? 'none' : 'auto' }}
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: isTransitioning ? 0 : 1, scale: isTransitioning ? 1.04 : 1, y: isTransitioning ? -40 : 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
                {/* Exact landing dice */}
                <motion.div className="wc-dice-container mb-2"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
                >
                    <div className="wc-dice">
                        <div className="wc-dice-face wc-face-front">
                            <div className="wc-dice-dots"><E /><E /><E /><E /><Dot /><E /><E /><E /><E /></div>
                        </div>
                        <div className="wc-dice-face wc-face-right">
                            <div className="wc-dice-dots"><Dot /><E /><E /><E /><E /><E /><E /><E /><Dot /></div>
                        </div>
                        <div className="wc-dice-face wc-face-top">
                            <div className="wc-dice-dots"><Dot /><E /><E /><E /><Dot /><E /><E /><E /><Dot /></div>
                        </div>
                        <div className="wc-dice-face wc-face-left">
                            <div className="wc-dice-dots"><Dot /><E /><Dot /><E /><E /><E /><Dot /><E /><Dot /></div>
                        </div>
                        <div className="wc-dice-face wc-face-bottom">
                            <div className="wc-dice-dots"><Dot /><E /><Dot /><E /><Dot /><E /><Dot /><E /><Dot /></div>
                        </div>
                        <div className="wc-dice-face wc-face-back">
                            <div className="wc-dice-dots"><Dot /><E /><Dot /><Dot /><E /><Dot /><Dot /><E /><Dot /></div>
                        </div>
                    </div>
                </motion.div>

                {/* Title */}
                <motion.h1 className="wc-title text-center"
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.9, ease: 'easeOut' }}
                >
                    Welcome
                </motion.h1>

                {/* Separator */}
                <motion.div className="flex items-center w-full max-w-lg px-4"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <div className="wc-separator-line" />
                    <div className="wc-ornament">
                        <div className="wc-ornament-circle" /><div className="wc-ornament-inner" />
                        <div className="wc-ornament-center" />
                        <div className="wc-ornament-sparkle wc-sp1" /><div className="wc-ornament-sparkle wc-sp2" />
                        <div className="wc-ornament-sparkle wc-sp3" /><div className="wc-ornament-sparkle wc-sp4" />
                    </div>
                    <div className="wc-separator-line" />
                </motion.div>

                {/* Taglines */}
                <motion.div className="flex flex-col items-center gap-2 text-center"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <p className="wc-tagline-main">Tu IA. Tus datos. Tu poder.</p>
                    <p className="wc-tagline-sub">Convierte el conocimiento en magia.</p>
                </motion.div>

                {/* Arrow */}
                <motion.div className="mt-6 cursor-pointer"
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: [0, 12, 0], transition: { opacity: { delay: 0.9, duration: 0.6 }, y: { delay: 1.2, duration: 1.8, repeat: Infinity, ease: 'easeInOut' } } }}
                    whileHover={{ scale: 1.15, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleArrowClick}
                >
                    <svg className="arrow-glow" width="56" height="56" viewBox="0 0 64 64" fill="none">
                        <path d="M32 8V52M32 52L54 34M32 52L10 34" stroke="rgba(251,191,36,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </motion.div>

                <motion.p className="wc-hint mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.8 }}>
                    Haz clic para comenzar tu aventura
                </motion.p>
            </motion.div>

            {/* Chat view */}
            {showChat && (
                <motion.div className="absolute inset-0"
                    initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                >
                    <Chat />
                </motion.div>
            )}
        </div>
    );
}