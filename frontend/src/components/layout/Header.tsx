import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import API from '../../services/api';

// ── Types ──────────────────────────────────────────────────────────────────
interface UserLocation {
  user_id: number;
  name: string;
  email: string;
  plan_id: number;
  plan?: { name: string; };
}

const PLAN_MAP: Record<number, { name: string; color: string }> = {
  1: { name: 'Goblin', color: '#16a34a' },
  2: { name: 'Wizard', color: '#8b5cf6' },
  3: { name: 'Elder Dragon', color: '#ef4444' },
};

// ── CSS ────────────────────────────────────────────────────────────────────
const popupStyles = `
  @keyframes popupFadeIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .profile-popup {
    animation: popupFadeIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
`;

// ── Component ──────────────────────────────────────────────────────────────
export default function Header() {
  const location = useLocation();
  const hasPlan = location.search.includes('plan=');
  const token = localStorage.getItem('token');

  const [locationData, setLocationData] = useState<UserLocation | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupCoords, setPopupCoords] = useState({ top: 0, right: 0 });

  const avatarRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Fetch user data
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API}/api/user/location`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(r => setLocationData(r.data))
      .catch(e => console.error('Error al obtener usuario:', e));
  }, [token]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Limpiar la URL para no dejar el token expuesto
      window.history.replaceState({}, document.title, "/");
      window.location.reload();
    }
  }, []);

  // Escucha el evento global que emite ChangeName/Dashboard al cambiar el nombre,
  // para actualizar el avatar sin recargar la página.
  useEffect(() => {
    const handler = (e: Event) => {
      const newName = (e as CustomEvent<string>).detail;
      setLocationData(prev => prev ? { ...prev, name: newName } : prev);
    };
    window.addEventListener("spellnet:nameChanged", handler);
    return () => window.removeEventListener("spellnet:nameChanged", handler);
  }, []);

  // Calculate popup position from avatar button
  const openPopup = () => {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      setPopupCoords({
        top: rect.bottom + 10,
        right: window.innerWidth - rect.right,
      });
    }
    setPopupOpen(v => !v);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popupRef.current && !popupRef.current.contains(target) &&
        avatarRef.current && !avatarRef.current.contains(target)
      ) {
        setPopupOpen(false);
      }
    };
    if (popupOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [popupOpen]);

  function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  // Usa el nombre real del plan desde la API; PLAN_MAP solo para el color
  const rawPlanName = locationData?.plan?.name ?? '';
  const planColor = Object.values(PLAN_MAP).find(p =>
    p.name.toLowerCase() === rawPlanName.toLowerCase().replace('_', ' ')
  ) ?? PLAN_MAP[1];
  const planInfo = locationData ? { name: rawPlanName.replace('_', ' '), color: planColor.color } : null;

  // --- CORRECCIÓN: Inicial segura ---
  const initial = locationData?.name?.[0]?.toUpperCase() ?? '?';

  // ── Popup (rendered via portal so it escapes every stacking context) ──
  const popup = popupOpen && locationData && (
    <div
      ref={popupRef}
      className="profile-popup"
      style={{
        position: 'fixed',
        top: popupCoords.top,
        right: popupCoords.right,
        width: '272px',
        zIndex: 99999,
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(10,5,2,0.98) 0%, rgba(20,10,5,0.99) 100%)',
        border: '1px solid rgba(251,191,36,0.3)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.85), 0 0 40px rgba(180,83,9,0.15)',
      }}
    >
      {/* User info stripe */}
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'linear-gradient(90deg, rgba(180,83,9,0.2), transparent)',
          borderBottom: '1px solid rgba(251,191,36,0.15)',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #b45309, #92400e)',
            border: '2px solid rgba(251,191,36,0.6)',
            color: '#fef3c7',
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 16px rgba(251,191,36,0.25)',
          }}
        >
          {initial}
        </div>

        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: '13px',
              color: '#fef3c7',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              margin: 0,
            }}
          >
            {locationData.name}
          </p>
          <p
            style={{
              fontSize: '11px',
              color: '#92400e',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              margin: '2px 0',
            }}
          >
            {locationData.email}
          </p>
          {planInfo && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '2px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: planInfo.color,
                background: `${planInfo.color}22`,
                border: `1px solid ${planInfo.color}55`,
              }}
            >
              {planInfo.name}
            </span>
          )}
        </div>
      </div>

      {/* Mi Perfil */}
      <div style={{ padding: '6px 0' }}>
        <Link
          to="/dashboard"
          onClick={() => setPopupOpen(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px 20px',
            color: 'rgba(253,230,138,0.8)',
            fontFamily: "'Cinzel', serif",
            fontSize: '13px',
            textDecoration: 'none',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(180,83,9,0.15)'; (e.currentTarget as HTMLElement).style.color = '#fef3c7'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(253,230,138,0.8)'; }}
        >
          Mi Perfil
        </Link>
      </div>

      {/* Divider */}
      <div style={{ margin: '0 16px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.2), transparent)' }} />

      {/* Cerrar sesión */}
      <div style={{ padding: '6px 0 10px' }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            background: 'transparent',
            color: 'rgba(248,113,113,0.8)',
            fontFamily: "'Cinzel', serif",
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(127,29,29,0.3)'; (e.currentTarget as HTMLElement).style.color = '#fca5a5'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(248,113,113,0.8)'; }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{popupStyles}</style>

      {/* z-index en el header para que quede por encima del contenido de página */}
      <header
        className="bg-black/40 backdrop-blur-sm border-b border-amber-900/50 shadow-lg"
        style={{ position: 'relative', zIndex: 50 }}
      >
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">

            {/* ── Logo ── */}
            <div className="flex items-center space-x-3">
              <div className="relative group cursor-pointer">
                <div className="transition-transform duration-300 group-hover:scale-110">
                  <img
                    src="/img/icono-pagina.png"
                    alt="Spellnet Logo"
                    className="w-[30mm] h-[30mm] object-contain filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                  />
                  <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
                </div>
              </div>
              <Link
                to="/"
                className="text-3xl font-bold text-amber-100 hover:text-amber-300 transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Spellnet
              </Link>
            </div>

            {/* ── Navigation ── */}
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className="text-amber-100 hover:text-amber-400 transition-all duration-300 text-lg relative group"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <span className="relative z-10">Inicio</span>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>

              <Link
                to="/chats"
                className="text-amber-100 hover:text-amber-400 transition-all duration-300 text-lg relative group"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <span className="relative z-10">Chat</span>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>

              {/* ── Auth section ── */}
              {!locationData ? (
                <>
                  <Link
                    to="/signup"
                    className="px-5 py-2 text-emerald-100 border-2 border-emerald-700 hover:border-emerald-500 transition-all duration-300 rounded shadow-lg"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      background: hasPlan ? 'rgba(20,83,30,0.8)' : 'rgba(30,64,34,0.6)',
                      boxShadow: hasPlan ? '0 0 12px rgba(74,222,128,0.4)' : 'none',
                    }}
                  >
                    Registrarse {hasPlan && '✓'}
                  </Link>
                  <Link
                    to="/login"
                    className="px-5 py-2 bg-amber-900/60 text-amber-100 hover:bg-amber-800/80 border-2 border-amber-700 hover:border-amber-500 transition-all duration-300 rounded shadow-lg hover:shadow-amber-900/50"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Iniciar Sesión
                  </Link>
                </>
              ) : (
                /* ── Avatar button ── */
                <button
                  ref={avatarRef}
                  onClick={openPopup}
                  className="flex items-center gap-2 group"
                  aria-label="Perfil de usuario"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #92400e, #78350f)',
                      borderColor: popupOpen ? '#fbbf24' : 'rgba(251,191,36,0.5)',
                      color: '#fef3c7',
                      fontFamily: "'Cinzel', serif",
                      boxShadow: popupOpen ? '0 0 16px rgba(251,191,36,0.5)' : '0 0 8px rgba(251,191,36,0.2)',
                    }}
                  >
                    {initial}
                  </div>
                  <svg
                    className={`w-3 h-3 text-amber-500 transition-transform duration-300 ${popupOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Portal: el popup se renderiza directamente en <body>, fuera de cualquier contexto de apilamiento */}
      {createPortal(popup, document.body)}
    </>
  );
}