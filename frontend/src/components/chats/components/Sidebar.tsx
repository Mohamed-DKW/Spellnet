import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { D20 } from '../hooks/D20';
import { ShieldAvatar } from '../hooks/shieldAvatar';
import { GOLD } from '../constants';
import type { ChatSession } from '../types/props';

interface SidebarProps {
    sidebarOpen: boolean;
    sessions: ChatSession[];
    activeId: number | null;
    loadingChats: boolean;
    user: any;
    onSelectChat: (id: number) => void;
    onNewChat: () => void;
    onDeleteChat: (id: number) => void;
}

function getPlanBadgeStyle(planName: string): React.CSSProperties {
    const n = planName.toLowerCase();
    if (n === 'wizard') return {
        background: 'rgba(124,58,237,0.2)',
        border: '1px solid rgba(124,58,237,0.35)',
        color: 'rgba(196,167,255,0.8)',
    };
    if (n === 'goblin') return {
        background: 'rgba(34,197,94,0.2)',
        border: '1px solid rgba(34,197,94,0.35)',
        color: '#16A34A',
    };
    return {
        background: 'rgba(239,68,68,0.133)',
        border: '1px solid rgb(239,68,68)',
        color: 'rgb(239,68,68)',
    };
}

export const Sidebar: React.FC<SidebarProps> = ({
    sidebarOpen,
    sessions,
    activeId,
    loadingChats,
    user,
    onSelectChat,
    onNewChat,
    onDeleteChat,
}) => {
    const navigate = useNavigate();
    const canDelete = sessions.length > 1;
    const planName = user?.plan?.name ?? 'goblin';

    const [query, setQuery] = React.useState('');
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        navigate(`?q=${encodeURIComponent(val)}`, { replace: true });
    };

    // Obtener query desde URL al cargar
    React.useEffect(() => {
        const params = new URLSearchParams(location.search);
        const q = params.get('q') ?? '';
        setQuery(q);
    }, []);

    const filteredSessions = sessions.filter(session => {
        if (!query.trim()) return true;
        const lowerQuery = query.toLowerCase();
        const matchesTitle = session.title.toLowerCase().includes(lowerQuery);
        const matchesMessages = session.messages.some(msg =>
            msg.text.toLowerCase().includes(lowerQuery)
        );
        return matchesTitle || matchesMessages;
    });

    if (!sidebarOpen) return null;

    return (
        <aside className="spell-sidebar" style={{ width: '280px', minWidth: '280px', position: 'relative' }}>
            <div style={{ width: '280px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="sfc sfc-tl" /><div className="sfc sfc-tr" />
                <div className="sfc sfc-bl" /><div className="sfc sfc-br" />

                {/* Logo */}
                <div className="sidebar-header">
                    <button className="logo-link" onClick={() => navigate('/')}>
                        <img className="logo-icon" src="/img/icono-pagina.png" alt="SpellNet" />
                        <span className="logo">SpellNet</span>
                    </button>
                </div>

                {/* Dados decorativos */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', padding: '2px 16px 10px' }}>
                    <div className="dice-deco"><D20 size={18} opacity={0.5} /></div>
                    <div className="dice-deco"><D20 size={24} opacity={0.72} /></div>
                    <div className="dice-deco"><D20 size={18} opacity={0.5} /></div>
                </div>

                {/* Perfil */}
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <div className="profile-card">
                        <div className="pc-corner pc-tl" /><div className="pc-corner pc-tr" />
                        <div className="pc-corner pc-bl" /><div className="pc-corner pc-br" />
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <div className="shield-avatar"><ShieldAvatar /></div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '6px' }}>
                                    <span style={{ fontFamily: 'Cinzel,serif', fontSize: '13px', fontWeight: 700, color: GOLD(0.92), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                                        {user?.name ?? 'Aventurero'}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.8)' }} />
                                        <span style={{ fontFamily: 'Cinzel,serif', fontSize: '7.5px', color: 'rgba(16,185,129,0.7)', letterSpacing: '0.5px' }}>EN LÍNEA</span>
                                    </div>
                                </div>
                                <div style={{ marginBottom: '8px' }}>
                                    <span className="profile-class-badge" style={{ ...getPlanBadgeStyle(planName), display: 'flex', width: '100%', justifyContent: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', boxSizing: 'border-box' }}>
                                        ✦ {planName.toUpperCase()} · LVL 7
                                    </span>
                                </div>
                                <div className="profile-xp-bar-track"><div className="profile-xp-bar-fill" /></div>
                                <div className="profile-xp-label"><span>XP 6,800</span><span>10,000 →</span></div>
                            </div>
                        </div>
                        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: `1px solid ${GOLD(0.1)}`, display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontFamily: 'Cinzel,serif', fontSize: '8px', color: GOLD(0.3), letterSpacing: '0.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>PLAN · {planName.toUpperCase()}</span>
                            <span style={{ fontFamily: 'Cinzel,serif', fontSize: '8px', color: GOLD(0.3), letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>VER PERFIL →</span>
                        </div>
                    </div>
                </Link>

                {/* Separador */}
                <div style={{ display: 'flex', alignItems: 'center', padding: '8px 14px 10px', gap: '8px' }}>
                    <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${GOLD(0.35)})` }} />
                    <span className="dnd-section-label">⚔ Conjuros ⚔</span>
                    <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${GOLD(0.35)}, transparent)` }} />
                </div>

                {/* Buscador mejorado */}
                <div style={{ padding: '0 12px 12px' }}>
                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(20,14,6,0.7)',
                        border: `1px solid ${GOLD(0.25)}`,
                        borderRadius: '30px',
                        padding: '4px 12px',
                        transition: 'all 0.2s',
                    }}>
                        <span style={{ color: GOLD(0.5), marginRight: '8px', fontSize: '12px' }}>🔍</span>
                        <input
                            type="text"
                            value={query}
                            onChange={handleFilterChange}
                            placeholder="Buscar en conjuros..."
                            style={{
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: GOLD(0.9),
                                fontFamily: 'Cinzel, serif',
                                fontSize: '11px',
                                letterSpacing: '1px',
                                width: '100%',
                            }}
                        />
                        {query && (
                            <button
                                onClick={() => {
                                    setQuery('');
                                    navigate('?', { replace: true });
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: GOLD(0.4),
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    padding: 0,
                                }}
                            >✕</button>
                        )}
                    </div>
                </div>

                {/* Lista de chats */}
                <div className="chat-list" style={{ flex: 1, overflowY: 'auto' }}>
                    {loadingChats ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '24px', color: GOLD(0.4), fontFamily: 'Cinzel, serif', fontSize: '9px', letterSpacing: '2px' }}>
                            <div className="loading-spinner" /> CARGANDO…
                        </div>
                    ) : filteredSessions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '24px 16px', color: GOLD(0.3), fontFamily: 'Cinzel, serif', fontSize: '9px', letterSpacing: '1.5px', lineHeight: 2 }}>
                            {query ? '🔍 No se encontraron conjuros' : '📜 Ningún conjuro aún. ¡Crea el primero!'}
                        </div>
                    ) : (
                        filteredSessions.map(s => (
                            <div
                                key={s.id}
                                className={`chat-item chat-item-new ${s.id === activeId ? 'active' : ''}`}
                                onClick={() => onSelectChat(s.id)}
                            >
                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    📜 {s.title}
                                </span>
                                <button
                                    type="button"
                                    className="chat-item-delete"
                                    title={canDelete ? 'Eliminar conjuro' : 'No puedes eliminar el último conjuro'}
                                    disabled={!canDelete}
                                    style={{ opacity: canDelete ? 0.6 : 0.2, cursor: canDelete ? 'pointer' : 'not-allowed' }}
                                    onClick={(e) => { e.stopPropagation(); if (canDelete) onDeleteChat(s.id); }}
                                >✕</button>
                            </div>
                        ))
                    )}
                </div>

                {/* Runas decorativas */}
                <div style={{ padding: '6px 16px 8px', textAlign: 'center' }}>
                    <span style={{ fontFamily: 'serif', fontSize: '12px', color: GOLD(0.2), letterSpacing: '7px' }}>ᚠ ᚢ ᚦ ᚨ ᚱ</span>
                </div>

                {/* Botón nuevo chat */}
                <div style={{ padding: '4px 16px 20px' }}>
                    <button onClick={onNewChat} style={{
                        width: '100%', padding: '10px', background: 'linear-gradient(135deg, rgba(92,40,9,0.6), rgba(120,53,9,0.6))',
                        border: `1px solid ${GOLD(0.3)}`, borderRadius: '8px', color: GOLD(0.8), fontFamily: 'Cinzel,serif',
                        fontSize: '10px', letterSpacing: '2px', cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}>
                        <span>✦</span> NUEVO CONJURO
                    </button>
                </div>
            </div>
        </aside>
    );
};