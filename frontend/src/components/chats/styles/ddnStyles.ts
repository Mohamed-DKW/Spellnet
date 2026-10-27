export const dndStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  :root {
    --gold-primary: rgba(251, 191, 36, 0.85);
    --gold-faded:   rgba(251, 191, 36, 0.3);
    --bg-dark:      #0a0704;
  }

  body {
    margin: 0;
    background-color: var(--bg-dark);
    color: #e4d2aa;
    font-family: 'Cormorant Garamond', serif;
    overflow: hidden;
  }

  /* ─────────────────────────────────────────────
     ANIMACIONES
  ───────────────────────────────────────────── */
  @keyframes runeGlow {
    0%, 100% { opacity: 0.2; text-shadow: 0 0 10px rgba(251,191,36,0.2); }
    50%       { opacity: 0.5; text-shadow: 0 0 20px rgba(251,191,36,0.5); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes typingPulse {
    0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
    40%           { opacity: 1;    transform: scale(1); }
  }

  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  @keyframes floatUp {
    0%   { opacity: 0; transform: translateY(6px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  /* ─────────────────────────────────────────────
     DRAG OVERLAY
  ───────────────────────────────────────────── */
  .drag-overlay {
    position: fixed;
    inset: 0;
    background: rgba(5, 3, 2, 0.88);
    backdrop-filter: blur(6px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  .drag-drop-zone {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    width: 360px;
    height: 260px;
    border: 2px dashed rgba(251,191,36,0.45);
    border-radius: 16px;
    background: rgba(20,14,6,0.6);
    box-shadow: 0 0 60px rgba(251,191,36,0.08), inset 0 0 40px rgba(251,191,36,0.04);
  }

  .drag-zone-corner {
    position: absolute;
    width: 18px;
    height: 18px;
    border-color: rgba(251,191,36,0.7);
    border-style: solid;
  }
  .dzc-tl { top: -2px;    left: -2px;   border-width: 2px 0 0 2px; border-radius: 4px 0 0 0; }
  .dzc-tr { top: -2px;    right: -2px;  border-width: 2px 2px 0 0; border-radius: 0 4px 0 0; }
  .dzc-bl { bottom: -2px; left: -2px;   border-width: 0 0 2px 2px; border-radius: 0 0 0 4px; }
  .dzc-br { bottom: -2px; right: -2px;  border-width: 0 2px 2px 0; border-radius: 0 0 4px 0; }

  /* ─────────────────────────────────────────────
     LAYOUT PRINCIPAL
  ───────────────────────────────────────────── */
  .spell-chat-container {
    display: flex;
    height: 100vh;
    width: 100vw;
    background: radial-gradient(circle at 30% 50%, #1a120b 0%, #0a0704 100%);
  }

  /* Marca de agua central */
  .parchment-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 280px;
    color: rgba(251,191,36,0.018);
    pointer-events: none;
    user-select: none;
    z-index: 0;
    font-family: serif;
    line-height: 1;
  }

  /* Título superior centrado */
  .crest-border {
    font-family: 'Cinzel Decorative', 'Cinzel', serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 3px;
    color: rgba(251,191,36,0.55);
    text-shadow: 0 0 20px rgba(251,191,36,0.2);
  }

  /* ─────────────────────────────────────────────
     SIDEBAR
  ───────────────────────────────────────────── */
  .spell-sidebar {
    width: 280px;
    min-width: 280px;
    height: 100vh;
    background: linear-gradient(180deg, rgba(14,10,6,0.99) 0%, rgba(8,6,3,1) 100%);
    border-right: 1px solid rgba(251,191,36,0.15);
    display: flex;
    flex-direction: column;
    box-shadow: 4px 0 32px rgba(0,0,0,0.7), inset -1px 0 0 rgba(251,191,36,0.06);
    position: relative;
    overflow: hidden;
  }

  /* Esquinas decorativas del sidebar */
  .sfc {
    position: absolute;
    width: 16px;
    height: 16px;
    border-color: rgba(251,191,36,0.35);
    border-style: solid;
    z-index: 10;
    pointer-events: none;
  }
  .sfc-tl { top: 8px;    left: 8px;    border-width: 1px 0 0 1px; }
  .sfc-tr { top: 8px;    right: 8px;   border-width: 1px 1px 0 0; }
  .sfc-bl { bottom: 8px; left: 8px;    border-width: 0 0 1px 1px; }
  .sfc-br { bottom: 8px; right: 8px;   border-width: 0 1px 1px 0; }

  /* ── Header / Logo ── */
  .sidebar-header {
    padding: 20px 16px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba(251,191,36,0.08);
    margin-bottom: 4px;
  }

  .logo-link {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 8px;
    transition: background 0.2s;
  }
  .logo-link:hover { background: rgba(251,191,36,0.04); }

  .logo-icon {
    width: 32px;
    height: 32px;
    object-fit: contain;
    filter: drop-shadow(0 0 8px rgba(251,191,36,0.4));
  }

  .logo {
    font-family: 'Cinzel Decorative', 'Cinzel', serif;
    font-size: 18px;
    font-weight: 700;
    color: #fbbf24;
    letter-spacing: 2px;
    text-shadow: 0 0 20px rgba(251,191,36,0.5);
  }

  /* ── Dados decorativos ── */
  .dice-deco {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s, opacity 0.3s;
  }
  .dice-deco:hover { transform: scale(1.25) rotate(15deg); opacity: 1 !important; }

  /* ── Tarjeta de perfil ── */
  .profile-card {
    position: relative;
    margin: 4px 12px 8px;
    padding: 14px 14px 10px;
    background: linear-gradient(135deg, rgba(25,18,8,0.9) 0%, rgba(15,11,5,0.95) 100%);
    border: 1px solid rgba(251,191,36,0.18);
    border-radius: 10px;
    cursor: pointer;
    transition: border-color 0.25s, box-shadow 0.25s;
    text-decoration: none;
    display: block;
  }
  .profile-card:hover {
    border-color: rgba(251,191,36,0.35);
    box-shadow: 0 4px 20px rgba(251,191,36,0.07);
  }

  /* Esquinas de la profile card */
  .pc-corner {
    position: absolute;
    width: 10px;
    height: 10px;
    border-color: rgba(251,191,36,0.45);
    border-style: solid;
  }
  .pc-tl { top: 4px;    left: 4px;    border-width: 1px 0 0 1px; }
  .pc-tr { top: 4px;    right: 4px;   border-width: 1px 1px 0 0; }
  .pc-bl { bottom: 4px; left: 4px;    border-width: 0 0 1px 1px; }
  .pc-br { bottom: 4px; right: 4px;   border-width: 0 1px 1px 0; }

  .shield-avatar {
    flex-shrink: 0;
    filter: drop-shadow(0 0 6px rgba(251,191,36,0.3));
  }

  /* Badge de clase/plan */
  .profile-class-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 10px;
    border-radius: 20px;
    font-family: 'Cinzel', serif;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  /* Barra XP */
  .profile-xp-bar-track {
    width: 100%;
    height: 3px;
    background: rgba(251,191,36,0.1);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 3px;
  }
  .profile-xp-bar-fill {
    width: 68%;
    height: 100%;
    background: linear-gradient(90deg, rgba(251,191,36,0.4), rgba(251,191,36,0.8));
    border-radius: 10px;
    box-shadow: 0 0 6px rgba(251,191,36,0.4);
    background-size: 200% auto;
    animation: shimmer 2.5s linear infinite;
  }
  .profile-xp-label {
    display: flex;
    justify-content: space-between;
    font-family: 'JetBrains Mono', monospace;
    font-size: 8px;
    color: rgba(251,191,36,0.3);
    letter-spacing: 0.5px;
  }

  /* ── Sección label ("Conjuros") ── */
  .dnd-section-label {
    font-family: 'Cinzel', serif;
    font-size: 8.5px;
    letter-spacing: 3px;
    color: rgba(251,191,36,0.45);
    white-space: nowrap;
  }

  /* ── Lista de chats ── */
  .chat-list {
    flex: 1;
    overflow-y: auto;
    padding: 4px 0;
    scrollbar-width: thin;
    scrollbar-color: rgba(251,191,36,0.12) transparent;
  }
  .chat-list::-webkit-scrollbar       { width: 4px; }
  .chat-list::-webkit-scrollbar-track { background: transparent; }
  .chat-list::-webkit-scrollbar-thumb { background: rgba(251,191,36,0.12); border-radius: 10px; }

  .chat-item {
    padding: 10px 14px;
    margin: 3px 10px;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Cinzel', serif;
    font-size: 0.68rem;
    letter-spacing: 0.8px;
    color: rgba(228, 210, 170, 0.45);
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  .chat-item::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 0;
    background: rgba(251,191,36,0.06);
    transition: width 0.2s;
    border-radius: 8px;
  }
  .chat-item:hover::before  { width: 100%; }
  .chat-item:hover {
    color: rgba(251,191,36,0.8);
    transform: translateX(3px);
    border-color: rgba(251,191,36,0.1);
  }
  .chat-item.active {
    background: linear-gradient(90deg, rgba(120,53,9,0.25) 0%, rgba(120,53,9,0.06) 100%);
    border: 1px solid rgba(251,191,36,0.28);
    color: #fcd34d;
    box-shadow: inset 3px 0 0 rgba(251,191,36,0.7), 0 2px 12px rgba(0,0,0,0.3);
  }
  /* animación al crear nuevo chat */
  .chat-item-new {
    animation: floatUp 0.25s ease-out;
  }

  /* Botón eliminar chat */
  .chat-item-delete {
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(220,38,38,0.0);
    font-size: 11px;
    padding: 2px 4px;
    border-radius: 4px;
    line-height: 1;
    flex-shrink: 0;
    transition: color 0.15s, background 0.15s;
  }
  .chat-item:hover .chat-item-delete,
  .chat-item.active .chat-item-delete {
    color: rgba(220,38,38,0.4);
  }
  .chat-item-delete:hover {
    color: rgba(220,38,38,0.9) !important;
    background: rgba(220,38,38,0.12);
  }

  /* Spinner de carga de chats */
  .loading-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(251,191,36,0.15);
    border-top-color: rgba(251,191,36,0.6);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    display: inline-block;
    flex-shrink: 0;
  }

  /* ─────────────────────────────────────────────
     ÁREA DE MENSAJES
  ───────────────────────────────────────────── */
  .message-wrapper {
    display: flex;
    flex-direction: column;
    animation: fadeIn 0.3s ease-out;
  }
  .message-user      { align-items: flex-end; }
  .message-assistant { align-items: flex-start; }

  .animation-fadeIn { animation: fadeIn 0.35s ease-out; }

  /* ===== CAMBIO PRINCIPAL: BURBUJAS CON AJUSTE DE ANCHO ===== */
  .bubble {
    max-width: 70%;
    width: fit-content;
    padding: 14px 18px;
    border-radius: 12px;
    position: relative;
    backdrop-filter: blur(4px);
    word-break: break-word;
  }

  .bubble-assistant {
    background: linear-gradient(135deg, rgba(22,16,9,0.75) 0%, rgba(15,11,5,0.7) 100%);
    border: 1px solid rgba(251,191,36,0.13);
    border-left: 2px solid rgba(251,191,36,0.45);
    box-shadow: 0 2px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(251,191,36,0.05);
  }

  .bubble-user {
    background: linear-gradient(135deg, rgba(55,35,15,0.35) 0%, rgba(40,25,10,0.25) 100%);
    border: 1px solid rgba(251,191,36,0.12);
    border-right: 2px solid rgba(251,191,36,0.25);
    margin-left: auto;
  }
  /* ======================================================== */

  .oracle-response-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.12rem;
    line-height: 1.75;
    color: #e4d2aa;
  }
  .oracle-response-text p       { margin: 0 0 0.75em; }
  .oracle-response-text p:last-child { margin-bottom: 0; }
  .oracle-response-text strong  { color: #fbbf24; text-shadow: 0 0 8px rgba(251,191,36,0.25); }
  .oracle-response-text em      { color: #fcd34d; font-style: italic; }
  .oracle-response-text h1, .oracle-response-text h2, .oracle-response-text h3 {
    font-family: 'Cinzel', serif;
    color: #fbbf24;
    letter-spacing: 1px;
    margin: 1em 0 0.4em;
    text-shadow: 0 0 12px rgba(251,191,36,0.2);
  }
  .oracle-response-text h1 { font-size: 1.3rem; }
  .oracle-response-text h2 { font-size: 1.15rem; }
  .oracle-response-text h3 { font-size: 1rem; }
  .oracle-response-text ul, .oracle-response-text ol {
    padding-left: 1.4em;
    margin: 0.5em 0;
  }
  .oracle-response-text li { margin: 0.25em 0; }
  .oracle-response-text code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.85em;
    background: rgba(251,191,36,0.08);
    border: 1px solid rgba(251,191,36,0.15);
    padding: 1px 6px;
    border-radius: 4px;
    color: #fcd34d;
  }
  .oracle-response-text pre {
    background: rgba(5,3,2,0.7);
    border: 1px solid rgba(251,191,36,0.15);
    border-radius: 8px;
    padding: 14px 16px;
    overflow-x: auto;
    margin: 0.75em 0;
  }
  .oracle-response-text pre code {
    background: none;
    border: none;
    padding: 0;
    font-size: 0.88em;
    color: #e4d2aa;
  }
  .oracle-response-text a {
    color: #3b82f6;  /* azul */
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .oracle-response-text a:hover {
    color: #60a5fa;
  }
  .oracle-response-text blockquote {
    border-left: 2px solid rgba(251,191,36,0.3);
    padding-left: 12px;
    margin: 0.5em 0;
    color: rgba(228,210,170,0.65);
    font-style: italic;
  }
  .oracle-response-text hr {
    border: none;
    border-top: 1px solid rgba(251,191,36,0.15);
    margin: 1em 0;
  }

  .user-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.05rem;
    color: rgba(228,210,170,0.88);
    line-height: 1.6;
  }

  /* ── Indicador de "escribiendo" ── */
  .loading-block {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 18px;
    background: linear-gradient(135deg, rgba(22,16,9,0.7) 0%, rgba(15,11,5,0.65) 100%);
    border: 1px solid rgba(251,191,36,0.1);
    border-left: 2px solid rgba(251,191,36,0.35);
    border-radius: 12px;
    max-width: 280px;
    backdrop-filter: blur(4px);
  }

  .loading-text {
    font-family: 'Cinzel', serif;
    font-size: 10px;
    letter-spacing: 1.5px;
    color: rgba(251,191,36,0.5);
    text-transform: uppercase;
  }

  .typing-dot {
    width: 7px;
    height: 7px;
    background: rgba(251,191,36,0.6);
    border-radius: 50%;
    animation: typingPulse 1.4s ease-in-out infinite;
    box-shadow: 0 0 6px rgba(251,191,36,0.4);
  }
  .typing-dot:nth-child(1) { animation-delay: 0s; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }

  /* ─────────────────────────────────────────────
     INPUT AREA
  ───────────────────────────────────────────── */
  .input-area {
    padding: 14px 20px 18px;
    background: linear-gradient(0deg, rgba(8,5,3,0.97) 0%, rgba(10,7,4,0.9) 100%);
    border-top: 1px solid rgba(251,191,36,0.1);
    flex-shrink: 0;
    position: relative;
    z-index: 10;
  }

  /* ─────────────────────────────────────────────
     SCROLLBAR GLOBAL
  ───────────────────────────────────────────── */
  .custom-scrollbar::-webkit-scrollbar       { width: 5px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(251,191,36,0.1);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(251,191,36,0.22); }

  /* ─────────────────────────────────────────────
     ESTADO VACÍO (sin sesión activa)
  ───────────────────────────────────────────── */
  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    color: rgba(251,191,36,0.2);
    user-select: none;
  }
  .empty-state-icon {
    font-size: 64px;
    filter: grayscale(1) opacity(0.15);
  }
  .empty-state-text {
    font-family: 'Cinzel', serif;
    font-size: 11px;
    letter-spacing: 3px;
    text-align: center;
  }

  /* ─────────────────────────────────────────────
     MODAL PARA ARCHIVOS
  ───────────────────────────────────────────── */
  .file-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .file-modal-container {
    max-width: 90vw;
    width: 700px;
    max-height: 85vh;
    background: linear-gradient(135deg, #1e150c, #120d07);
    border: 1px solid rgba(251, 191, 36, 0.4);
    border-radius: 16px;
    box-shadow: 0 0 40px rgba(251, 191, 36, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: fadeIn 0.2s ease-out;
  }

  .file-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: rgba(0, 0, 0, 0.4);
    border-bottom: 1px solid rgba(251, 191, 36, 0.2);
    font-family: 'Cinzel', serif;
    font-size: 14px;
    color: #fbbf24;
  }

  .file-modal-close {
    background: none;
    border: none;
    color: rgba(251, 191, 36, 0.6);
    font-size: 20px;
    cursor: pointer;
    transition: color 0.2s;
    line-height: 1;
  }
  .file-modal-close:hover {
    color: #ef4444;
  }

  .file-modal-stats {
    padding: 8px 16px;
    background: rgba(0, 0, 0, 0.3);
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: rgba(251, 191, 36, 0.5);
    display: flex;
    gap: 20px;
    border-bottom: 1px solid rgba(251, 191, 36, 0.1);
  }

  .file-modal-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    line-height: 1.5;
    color: #e4d2aa;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .file-modal-content pre {
    margin: 0;
    font-family: inherit;
    white-space: pre-wrap;
  }

  .file-modal-no-content {
    color: rgba(251, 191, 36, 0.4);
    font-style: italic;
  }

  .spell-file-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: linear-gradient(135deg, rgba(15,10,5,0.9), rgba(20,14,7,0.85));
    border: 1px solid rgba(251,191,36,0.22);
    border-radius: 8px;
    transition: all 0.15s ease;
    cursor: pointer;
  }
  .spell-file-chip:hover {
    border-color: rgba(251,191,36,0.6);
    background: linear-gradient(135deg, rgba(30,20,8,0.95), rgba(40,28,12,0.9));
    transform: translateY(-2px);
  }
    @keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translate(-50%, 20px);
    }
    to {
        opacity: 1;
        transform: translate(-50%, 0);
    }
}
`;