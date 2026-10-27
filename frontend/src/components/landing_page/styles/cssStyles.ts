const cssStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');

  @keyframes spin3d {
    0%   { transform: rotateX(0deg) rotateY(0deg); }
    100% { transform: rotateX(360deg) rotateY(360deg); }
  }

  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulseGlow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  .hero-fade-in   { animation: fadeInDown 1.2s ease forwards; }
  .hero-fade-in-2 { animation: fadeInUp 1.2s ease 0.3s both; }
  .hero-fade-in-3 { animation: fadeInUp 1.2s ease 0.6s both; }

  .dice-container {
    width: 80px;
    height: 80px;
    perspective: 400px;
  }

  .dice {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    animation: spin3d 6s linear infinite;
  }

  .dice-face {
    position: absolute;
    width: 80px;
    height: 80px;
    border: 2px solid rgba(251, 191, 36, 0.8);
    background: linear-gradient(135deg, rgba(30, 20, 10, 0.95), rgba(20, 10, 5, 0.95));
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border-radius: 12px;
    box-shadow: inset 0 0 15px rgba(251, 191, 36, 0.3), 0 0 20px rgba(251, 191, 36, 0.4);
  }

  .dice-dots-container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 3px;
  }

  .dice-dot {
    width: 9px;
    height: 9px;
    background: #fbbf24;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(251, 191, 36, 0.8);
    margin: auto;
  }

  .dice-face.front  { transform: translateZ(40px); }
  .dice-face.back   { transform: rotateY(180deg) translateZ(40px); }
  .dice-face.right  { transform: rotateY(90deg) translateZ(40px); }
  .dice-face.left   { transform: rotateY(-90deg) translateZ(40px); }
  .dice-face.top    { transform: rotateX(90deg) translateZ(40px); }
  .dice-face.bottom { transform: rotateX(-90deg) translateZ(40px); }

  .pergamino {
    position: relative;
    border-radius: 12px;
    overflow: visible;
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    background: 
      radial-gradient(ellipse at top, rgba(255, 247, 230, 0.9) 0%, transparent 50%),
      radial-gradient(ellipse at bottom, rgba(255, 247, 230, 0.9) 0%, transparent 50%),
      linear-gradient(to bottom, 
        #f5e6d3 0%, 
        #f0dfc5 3%,
        #ecdab8 8%, 
        #ead7b5 15%,
        #e8d4b2 25%,
        #ead7b5 50%,
        #e8d4b2 75%,
        #ead7b5 85%,
        #ecdab8 92%,
        #f0dfc5 97%,
        #f5e6d3 100%
      );
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.25),
      0 5px 15px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.5),
      inset 0 -1px 0 rgba(139, 111, 78, 0.15),
      inset 3px 0 15px rgba(139, 111, 78, 0.08),
      inset -3px 0 15px rgba(139, 111,78, 0.08);
    border: 1px solid rgba(139, 111, 78, 0.3);
  }
  
  .pergamino::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 1.5px,
        rgba(139, 111, 78, 0.02) 1.5px,
        rgba(139, 111, 78, 0.02) 3px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 1.5px,
        rgba(139, 111, 78, 0.01) 1.5px,
        rgba(139, 111, 78, 0.01) 3px
      );
    border-radius: 12px;
    pointer-events: none;
    z-index: 1;
    opacity: 0.6;
  }
  
  .pergamino::after {
    content: '';
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border: 1px solid rgba(139, 111, 78, 0.15);
    border-radius: 8px;
    pointer-events: none;
    z-index: 1;
  }

  .pergamino:hover {
    transform: translateY(-20px) scale(1.08);
    box-shadow: 
      0 20px 50px rgba(0, 0, 0, 0.35),
      0 10px 25px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.6),
      inset 0 -1px 0 rgba(139, 111, 78, 0.2),
      inset 3px 0 15px rgba(139, 111, 78, 0.1),
      inset -3px 0 15px rgba(139, 111, 78, 0.1);
  }
  
  .pergamino.popular-plan {
    transform: scale(1.08);
  }
  
  .pergamino.popular-plan:hover {
    transform: translateY(-20px) scale(1.15);
  }

  .pergamino-inner {
    position: relative;
    z-index: 3;
    padding: 45px 28px 45px;
    background: transparent;
    border-radius: 12px;
  }
  
  .pergamino-inner::before,
  .pergamino-inner::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 30px;
    border-style: solid;
    border-color: rgba(139, 111, 78, 0.25);
    border-width: 0;
  }
  
  .pergamino-inner::before {
    top: 20px;
    left: 20px;
    border-top-width: 2px;
    border-left-width: 2px;
    border-top-left-radius: 8px;
  }
  
  .pergamino-inner::after {
    bottom: 20px;
    right: 20px;
    border-bottom-width: 2px;
    border-right-width: 2px;
    border-bottom-right-radius: 8px;
  }

  .pergamino-roll-left,
  .pergamino-roll-right {
    position: absolute;
    top: -10px;
    bottom: -10px;
    width: 28px;
    background: 
      linear-gradient(to right, 
        #3e2723 0%, 
        #4a3228 10%,
        #5d4037 25%, 
        #6d4c41 40%,
        #8b6f47 50%,
        #6d4c41 60%,
        #5d4037 75%,
        #4a3228 90%,
        #3e2723 100%
      );
    border-radius: 14px;
    z-index: 4;
    box-shadow: 
      0 3px 10px rgba(0,0,0,0.5),
      inset 0 2px 1px rgba(255,255,255,0.15),
      inset 0 -2px 1px rgba(0,0,0,0.4),
      inset 2px 0 3px rgba(0,0,0,0.2),
      inset -2px 0 3px rgba(0,0,0,0.2);
  }
  
  .pergamino-roll-left::before,
  .pergamino-roll-right::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 18px;
    height: 100%;
    background: 
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 3px,
        rgba(0, 0, 0, 0.1) 3px,
        rgba(0, 0, 0, 0.1) 4px
      );
    border-radius: 9px;
  }

  .pergamino-roll-left  { left: -12px; }
  .pergamino-roll-right { right: -12px; }

  .conocenos-card {
    background: rgba(20, 12, 5, 0.6);
    border: 1px solid rgba(251,191,36,0.2);
    border-radius: 12px;
    padding: 28px 24px;
    backdrop-filter: blur(4px);
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  .conocenos-card:hover {
    border-color: rgba(251,191,36,0.5);
    box-shadow: 0 0 20px rgba(251,191,36,0.15);
  }

  .section-title-glow {
    text-shadow: 0 0 20px rgba(251,191,36,0.5), 0 0 60px rgba(251,191,36,0.2);
  }

  .plan-btn {
    width: 100%;
    padding: 12px 0;
    border-radius: 8px;
    font-family: 'Cinzel', serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid;
    text-decoration: none;
    display: block;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .plan-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  .popular-badge {
    position: absolute;
    top: -16px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #7c2d12 0%, #991b1b 100%);
    color: #fef3c7;
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 1.5px;
    z-index: 10;
    border: 2px solid #fbbf24;
    box-shadow: 0 4px 12px rgba(251, 191, 36, 0.5), 0 0 20px rgba(251, 191, 36, 0.3);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    white-space: nowrap;
  }

    /* Nuevos estilos para el separador decorativo - MODIFICADO */
  .magic-separator {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1.5rem auto;
    width: 100%;
    max-width: 550px; /* Cambiado de 420px a 550px */
  }

  .separator-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(251, 191, 36, 0.3) 10%,
      rgba(251, 191, 36, 0.6) 50%,
      rgba(251, 191, 36, 0.3) 90%,
      transparent 100%
    );
  }

  .separator-ornament {
    position: relative;
    margin: 0 1.8rem; /* Aumentado de 1.2rem a 1.8rem */
    width: 50px; /* Aumentado de 44px a 50px */
    height: 50px; /* Aumentado de 44px a 50px */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ornament-circle {
    position: absolute;
    width: 50px; /* Aumentado de 44px a 50px */
    height: 50px; /* Aumentado de 44px a 50px */
    border: 2px solid rgba(251, 191, 36, 0.5); /* Aumentado de 1.5px a 2px */
    border-radius: 50%;
    animation: pulseGlow 3s ease-in-out infinite;
  }

  .ornament-inner {
    position: absolute;
    width: 32px; /* Aumentado de 28px a 32px */
    height: 32px; /* Aumentado de 28px a 32px */
    border: 1.5px solid rgba(251, 191, 36, 0.8); /* Aumentado de 1px a 1.5px */
    border-radius: 50%;
    animation: pulseGlow 3s ease-in-out infinite reverse;
  }

  .ornament-center {
    position: absolute;
    width: 10px; /* Aumentado de 8px a 10px */
    height: 10px; /* Aumentado de 8px a 10px */
    background: rgba(251, 191, 36, 0.9);
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(251, 191, 36, 0.8); /* Aumentado de 12px a 15px */
  }

  .ornament-sparkle {
    position: absolute;
    width: 5px; /* Aumentado de 4px a 5px */
    height: 5px; /* Aumentado de 4px a 5px */
    background: rgba(251, 191, 36, 0.9);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(251, 191, 36, 0.8); /* Aumentado de 8px a 10px */
  }

  .sparkle-1 { top: 0; left: 50%; transform: translateX(-50%); }
  .sparkle-2 { top: 50%; right: 0; transform: translateY(-50%); }
  .sparkle-3 { bottom: 0; left: 50%; transform: translateX(-50%); }
  .sparkle-4 { top: 50%; left: 0; transform: translateY(-50%); }
`;
export default cssStyles;