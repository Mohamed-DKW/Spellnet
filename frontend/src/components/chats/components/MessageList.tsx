import React, { useEffect, useRef, useState } from 'react';
import { GOLD, BASE_URL } from '../constants';
import type { Message } from '../types/props';
import { copyToClipboard } from '../hooks/copy-edit/HandleCopy';

// ============================================================
// PROPS
// ============================================================



// ============================================================
// UTILIDADES
// ============================================================
// Toast component
const Toast: React.FC<{ message: string; visible: boolean; onClose: () => void }> = ({ message, visible, onClose }) => {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(onClose, 2000);
            return () => clearTimeout(timer);
        }
    }, [visible, onClose]);
    if (!visible) return null;
    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(251,191,36,0.5)',
            borderRadius: '30px',
            padding: '8px 20px',
            color: '#fbbf24',
            fontFamily: 'Cinzel, serif',
            fontSize: '12px',
            letterSpacing: '1px',
            zIndex: 9999,
            boxShadow: '0 0 20px rgba(251,191,36,0.2)',
            animation: 'fadeInUp 0.2s ease-out'
        }}>
            ✨ {message} ✨
        </div>
    );
};

// Utilities
const safeText = (value: any): string => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
        if ('$$typeof' in value) return '';
        if (value.answer) return String(value.answer);
        if (value.text) return String(value.text);
        if (value.content) return String(value.content);
        try { return JSON.stringify(value); } catch { return ''; }
    }
    return String(value);
};

const formatBytes = (b: number) => {
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    return (b / (1024 * 1024)).toFixed(1) + ' MB';
};

// Markdown inline renderer - VERSIÓN ORIGINAL RESTAURADA
const applyInline = (text: string, key: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
    let last = 0;
    let match;
    let idx = 0;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > last) parts.push(text.slice(last, match.index));
        if (match[2] !== undefined)
            parts.push(<strong key={`${key}-b${idx}`} style={{ color: '#fbbf24', textShadow: '0 0 8px rgba(251,191,36,0.25)' }}>{match[2]}</strong>);
        else if (match[3] !== undefined)
            parts.push(<em key={`${key}-i${idx}`} style={{ color: '#fcd34d' }}>{match[3]}</em>);
        else if (match[4] !== undefined)
            parts.push(<code key={`${key}-c${idx}`} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.85em', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)', padding: '1px 6px', borderRadius: '4px', color: '#fcd34d' }}>{match[4]}</code>);
        else if (match[5] !== undefined && match[6] !== undefined)
            parts.push(<a key={`${key}-a${idx}`} href={match[6]} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline', textUnderlineOffset: '3px' }}>{match[5]}</a>);
        last = match.index + match[0].length;
        idx++;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>;
};

const renderMarkdown = (raw: string): React.ReactNode => {
    const lines = raw.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        if (line.trim() === '') { i++; continue; }
        if (/^---+$/.test(line.trim())) {
            elements.push(<hr key={`hr-${i}`} style={{ border: 'none', borderTop: '1px solid rgba(251,191,36,0.15)', margin: '1em 0' }} />);
            i++; continue;
        }
        const h1 = line.match(/^#\s+(.*)/);
        const h2 = line.match(/^##\s+(.*)/);
        const h3 = line.match(/^###\s+(.*)/);
        if (h1 || h2 || h3) {
            const level = h1 ? 1 : h2 ? 2 : 3;
            const txt = (h1 || h2 || h3)![1];
            const sizes = ['1.3rem', '1.15rem', '1rem'];
            elements.push(
                <div key={`h-${i}`} style={{ fontFamily: 'Cinzel,serif', color: '#fbbf24', letterSpacing: '1px', margin: '1em 0 0.4em', fontSize: sizes[level - 1], textShadow: '0 0 12px rgba(251,191,36,0.2)', fontWeight: 700 }}>
                    {applyInline(txt, `h${i}`)}
                </div>
            );
            i++; continue;
        }
        if (/^[-*]\s/.test(line)) {
            const items: React.ReactNode[] = [];
            while (i < lines.length && /^[-*]\s/.test(lines[i])) {
                const t = lines[i].replace(/^[-*]\s/, '');
                items.push(<li key={`li-${i}`} style={{ margin: '0.25em 0' }}>{applyInline(t, `li${i}`)}</li>);
                i++;
            }
            elements.push(<ul key={`ul-${i}`} style={{ paddingLeft: '1.4em', margin: '0.5em 0' }}>{items}</ul>);
            continue;
        }
        if (/^\d+\.\s/.test(line)) {
            const items: React.ReactNode[] = [];
            while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
                const t = lines[i].replace(/^\d+\.\s/, '');
                items.push(<li key={`oli-${i}`} style={{ margin: '0.25em 0' }}>{applyInline(t, `oli${i}`)}</li>);
                i++;
            }
            elements.push(<ol key={`ol-${i}`} style={{ paddingLeft: '1.4em', margin: '0.5em 0' }}>{items}</ol>);
            continue;
        }
        if (line.startsWith('```')) {
            const codeLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++; }
            elements.push(
                <pre key={`pre-${i}`} style={{ background: 'rgba(5,3,2,0.7)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: '8px', padding: '14px 16px', overflowX: 'auto', margin: '0.75em 0' }}>
                    <code style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.88em', color: '#e4d2aa' }}>{codeLines.join('\n')}</code>
                </pre>
            );
            i++; continue;
        }
        if (line.startsWith('> ')) {
            elements.push(
                <blockquote key={`bq-${i}`} style={{ borderLeft: '2px solid rgba(251,191,36,0.3)', paddingLeft: '12px', margin: '0.5em 0', color: 'rgba(228,210,170,0.65)', fontStyle: 'italic' }}>
                    {applyInline(line.slice(2), `bq${i}`)}
                </blockquote>
            );
            i++; continue;
        }
        elements.push(<p key={`p-${i}`} style={{ margin: '0 0 0.75em' }}>{applyInline(line, `p${i}`)}</p>);
        i++;
    }
    return <>{elements}</>;
};

// File modal
const FileModal: React.FC<{ file: { id?: number; name: string; content?: string; meta?: any } | null; onClose: () => void }> = ({ file, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<string | null>(file?.content || null);
    const [meta, setMeta] = useState(file?.meta);
    useEffect(() => {
        if (!file) return;
        if (file.content) {
            setContent(file.content);
            setMeta(file.meta);
            return;
        }
        if (file.id) {
            setLoading(true);
            fetch(`${BASE_URL}/api/file/${file.id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
                .then(res => res.json())
                .then(data => { setContent(data.content); setMeta({ size: data.size, lines: data.lines, words: data.words, chars: data.chars }); })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [file]);
    if (!file) return null;
    return (
        <div className="file-modal-overlay" onClick={onClose}>
            <div className="file-modal-container" onClick={e => e.stopPropagation()}>
                <div className="file-modal-header"><span>📄 {file.name}</span><button className="file-modal-close" onClick={onClose}>✕</button></div>
                <div className="file-modal-stats">
                    {meta?.size !== undefined && <span>📦 {formatBytes(meta.size)}</span>}
                    {meta?.words !== undefined && <span>📝 {meta.words.toLocaleString()} palabras</span>}
                    {meta?.lines !== undefined && <span>📏 {meta.lines.toLocaleString()} líneas</span>}
                    {meta?.chars !== undefined && <span>🔤 {meta.chars.toLocaleString()} caracteres</span>}
                </div>
                <div className="file-modal-content">{loading ? <div className="loading-spinner" /> : content ? <pre>{content}</pre> : <p className="file-modal-no-content">* Contenido no disponible *</p>}</div>
            </div>
        </div>
    );
};

const FileAttachment: React.FC<{ fileId?: number; name: string; meta?: any; content?: string; onClick: () => void; onRemove?: () => void }> = ({ fileId, name, meta, onClick, onRemove }) => (
    <div className="spell-file-attachment" onClick={onClick} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'rgba(20,14,6,0.8)', border: `1px solid ${GOLD(0.3)}`, borderRadius: '6px' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '11px', color: GOLD(0.9), maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
        {meta?.size !== undefined && <span style={{ fontFamily: "'JetBrains Mono'", fontSize: '9px', color: GOLD(0.5) }}>{formatBytes(meta.size)}</span>}
        {onRemove && <button onClick={(e) => { e.stopPropagation(); onRemove(); }} style={{ background: 'none', border: 'none', color: 'rgba(220,38,38,0.6)', cursor: 'pointer' }}>✕</button>}
    </div>
);

const ThinkingDots = () => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '8px' }}>
        {[0, 1, 2].map(i => <span key={i} className="typing-dot" style={{ animationDelay: `${i * 0.2}s` }} />)}
    </span>
);

const ThinkingIndicator = ({ searchSites = [] }: { searchSites?: { title: string; url: string; domain?: string }[] }) => (
    <div className="message-wrapper message-assistant" style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'Cinzel, serif', fontSize: '11px', color: 'rgba(251,191,36,0.7)', letterSpacing: '1px', flexWrap: 'wrap' }}>
            {searchSites.length > 0 ? (
                <>
                    <span>🌐 BUSCANDO:</span>
                    {searchSites.map((site, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(251,191,36,0.15)', padding: '4px 12px', borderRadius: '40px' }}>
                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(251,191,36,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#fbbf24' }}>
                                {(site.domain || site.title).charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontSize: '10px', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {site.title.length > 20 ? site.title.slice(0, 17) + '…' : site.title}
                            </span>
                        </div>
                    ))}
                    <ThinkingDots />
                </>
            ) : (
                <>PENSANDO<ThinkingDots /></>
            )}
        </div>
    </div>
);

const SpellNetHeader = () => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontFamily: 'Cinzel,serif', fontSize: '9px', letterSpacing: '3px', color: GOLD(0.6), textTransform: 'uppercase' }}>⚔ SpellNet</span>
    </div>
);

const UserHeader = ({ name }: { name: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '6px' }}>
        <span style={{ fontFamily: 'Cinzel,serif', fontSize: '8.5px', letterSpacing: '2px', color: GOLD(0.35), textTransform: 'uppercase' }}>{name}</span>
    </div>
);

const ActionButton: React.FC<{
    onClick: () => void;
    icon: string;
    label: string;
}> = ({ onClick, icon, label }) => (
    <button
        onClick={onClick}
        title={label}
        className="
      bg-transparent border-0 cursor-pointer p-[3px]
      opacity-40 hover:opacity-100
      transition-all duration-200
      leading-none
      drop-shadow-none hover:drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]
    "
    >
        <img
            src={icon}
            alt={label}
            className="w-[14px] h-[14px] block"
        />
    </button>
);
const VersionNav: React.FC<{
    currentIdx: number;
    total: number;
    onPrev: () => void;
    onNext: () => void;
    disabled?: boolean;
}> = ({ currentIdx, total, onPrev, onNext, disabled = false }) => {
    if (total <= 1) return null;
    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}>
            <button
                onClick={onPrev}
                disabled={disabled || currentIdx === 0}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: (disabled || currentIdx === 0) ? 'not-allowed' : 'pointer',
                    color: GOLD(0.7),
                    fontSize: '14px',
                    padding: '2px 4px',
                    opacity: (disabled || currentIdx === 0) ? 0.3 : 1,
                }}
            >◀</button>
            <span style={{ fontFamily: 'Cinzel, serif', fontSize: '9px', color: GOLD(0.6) }}>
                {currentIdx + 1}/{total}
            </span>
            <button
                onClick={onNext}
                disabled={disabled || currentIdx === total - 1}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: (disabled || currentIdx === total - 1) ? 'not-allowed' : 'pointer',
                    color: GOLD(0.7),
                    fontSize: '14px',
                    padding: '2px 4px',
                    opacity: (disabled || currentIdx === total - 1) ? 0.3 : 1,
                }}
            >▶</button>
        </div>
    );
};

const ActionButtons = ({
    onCopy,
    onEdit,
    onStop,
    showStop,
    isAssistant,
    isMessageComplete,
    isWelcomeMessage = false,
    versionNav,
    disabled = false,
}: {
    onCopy: () => void;
    onEdit?: () => void;
    onStop?: () => void;
    showStop?: boolean;
    isAssistant: boolean;
    isMessageComplete: boolean;
    isWelcomeMessage?: boolean;
    versionNav?: React.ReactNode;
    disabled?: boolean;
}) => {
    const buttonStyle = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        opacity: 0.7,
        transition: 'opacity 0.2s, transform 0.1s, text-shadow 0.2s',
        padding: '6px 10px',
        borderRadius: '4px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '16px',
        color: GOLD(0.9),
        fontFamily: 'Cinzel, serif',
        fontWeight: 500,
        textShadow: '0 0 4px rgba(251,191,36,0.3)'
    };
    const hoverStyle = { opacity: 1, transform: 'scale(1.1)', textShadow: '0 0 8px rgba(251,191,36,0.7)' };
    return (
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: isAssistant ? 'flex-start' : 'flex-end', alignItems: 'center' }}>
            {showStop && onStop && (
                <button onClick={onStop} style={buttonStyle} onMouseEnter={e => Object.assign(e.currentTarget.style, hoverStyle)} onMouseLeave={e => Object.assign(e.currentTarget.style, { opacity: 0.7, transform: 'scale(1)', textShadow: '0 0 4px rgba(251,191,36,0.3)' })} title="Detener generación">⏹</button>
            )}
            {!isAssistant && onEdit && (
                <button onClick={onEdit} style={buttonStyle} disabled={disabled} onMouseEnter={e => !disabled && Object.assign(e.currentTarget.style, hoverStyle)} onMouseLeave={e => !disabled && Object.assign(e.currentTarget.style, { opacity: 0.7, transform: 'scale(1)', textShadow: '0 0 4px rgba(251,191,36,0.3)' })} title={disabled ? "Espera a que termine de escribir" : "Editar mensaje"}>✎</button>
            )}
            {versionNav && <div style={{ marginLeft: '4px' }}>{versionNav}</div>}
            {!isWelcomeMessage && ((isAssistant && isMessageComplete) || !isAssistant) && (
                <button onClick={onCopy} style={buttonStyle} onMouseEnter={e => Object.assign(e.currentTarget.style, hoverStyle)} onMouseLeave={e => Object.assign(e.currentTarget.style, { opacity: 0.7, transform: 'scale(1)', textShadow: '0 0 4px rgba(251,191,36,0.3)' })} title="Copiar">⎘</button>
            )}
        </div>
    );
};

// Main MessageList component
interface MessageListProps {
    messages: Message[];
    isTyping: boolean;
    hasStartedTyping?: boolean;
    userName?: string;
    onStopGeneration?: () => void;
    isGenerating?: boolean;
    onEditUserMessage?: (messageId: string, currentText: string) => void;
    versionSnapshots?: Map<string | number, { text: string; versionNumber: number }[]>;
    currentVersionIdx?: Map<string | number, number>;
    onVersionChange?: (messageId: string, newIndex: number) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    isTyping,
    hasStartedTyping = false,
    userName = 'Aventurero',
    onStopGeneration,
    isGenerating = false,
    onEditUserMessage,
    versionSnapshots = new Map(),
    currentVersionIdx = new Map(),
    onVersionChange,
}) => {
    const [modalFile, setModalFile] = useState<any>(null);
    const [searchSites, setSearchSites] = useState<{ title: string; url: string; domain?: string }[]>([]);
    const [toast, setToast] = useState({ visible: false, message: '' });
    const showToast = (msg: string) => setToast({ visible: true, message: msg });
    const hideToast = () => setToast({ visible: false, message: '' });
    const [changingVersion, setChangingVersion] = useState<string | null>(null);


    const handleCopyMessage = async (text: string) => {
        const ok = await copyToClipboard(text);
        showToast(ok ? 'Texto copiado al grimorio' : 'No se pudo copiar el texto');
    };

    const lastUserMessage = [...messages].reverse().find(m => m.sender === 'user');
    const showStopForMessage = (msg: Message) => msg.sender === 'user' && isGenerating && lastUserMessage?.id === msg.id;

    const isWelcomeMessage = (msg: Message) => {
        return String(msg.id).includes('welcome') || msg.text === '¡Bienvenido, aventurero! Soy SpellNet, tu oráculo digital. ¿En qué puedo iluminarte hoy?';
    };

    // Mostrar el indicador "PENSANDO..." mientras la IA está generando y aún no ha comenzado a escribir
    const showGlobalThinking = isTyping && !hasStartedTyping;

    return (
        <>
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', position: 'relative', zIndex: 1 }}>
                {messages.map(m => {
                    const text = safeText(m.text);
                    const isAssistant = m.sender === 'assistant';
                    const isEmpty = text.trim() === '';

                    // No mostrar mensajes del asistente que estén vacíos (evita el bloque vacío mientras se piensa)
                    if (isAssistant && isEmpty) return null;

                    const isMessageComplete = !isTyping || (isAssistant && m.text !== '');
                    const welcomeFlag = isWelcomeMessage(m);

                    const messageIdStr = String(m.id);
                    const snapshots = versionSnapshots.get(messageIdStr) || [];
                    const currentIdx = currentVersionIdx.get(messageIdStr) ?? (snapshots.length > 0 ? snapshots.length - 1 : 0);
                    const displayedText = (snapshots[currentIdx]?.text !== undefined) ? snapshots[currentIdx].text : text;
                    const totalVersions = snapshots.length;
                    const hasMultipleVersions = totalVersions > 1;
                    const isChanging = changingVersion === messageIdStr;

                    const handlePrevVersion = () => {
                        if (currentIdx > 0 && onVersionChange && !isGenerating && !isChanging) {
                            setChangingVersion(messageIdStr);
                            onVersionChange(messageIdStr, currentIdx - 1);
                            setTimeout(() => setChangingVersion(null), 500);
                        } else if (isGenerating) {
                            showToast('Espera a que termine de escribir antes de cambiar de versión');
                        }
                    };
                    const handleNextVersion = () => {
                        if (currentIdx < totalVersions - 1 && onVersionChange && !isGenerating && !isChanging) {
                            setChangingVersion(messageIdStr);
                            onVersionChange(messageIdStr, currentIdx + 1);
                            setTimeout(() => setChangingVersion(null), 500);
                        } else if (isGenerating) {
                            showToast('Espera a que termine de escribir antes de cambiar de versión');
                        }
                    };

                    const versionNav = !isAssistant && hasMultipleVersions ? (
                        <VersionNav
                            currentIdx={currentIdx}
                            total={totalVersions}
                            onPrev={handlePrevVersion}
                            onNext={handleNextVersion}
                            disabled={isGenerating || isChanging}
                        />
                    ) : null;

                    return (
                        <div key={String(m.id)} style={{ marginBottom: '24px' }}>
                            {isAssistant ? <SpellNetHeader /> : <UserHeader name={userName} />}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: isAssistant ? 'flex-start' : 'flex-end' }}>
                                <div className={`bubble ${isAssistant ? 'bubble-assistant' : 'bubble-user'}`} style={{ marginBottom: '4px' }}>
                                    {isAssistant ? (
                                        <div className="oracle-response-text">{renderMarkdown(displayedText)}</div>
                                    ) : (
                                        <div className="user-text">
                                            <span>{displayedText}</span>
                                            {m.attachments && m.attachments.length > 0 && (
                                                <div style={{ marginTop: text ? '12px' : 0, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                    {m.attachments.map((name, i) => (
                                                        <FileAttachment key={i} fileId={m.attachmentIds?.[i]} name={name} meta={m.attachmentsMeta?.[i]} content={m.attachmentContents?.[i]} onClick={() => setModalFile({ id: m.attachmentIds?.[i], name, content: m.attachmentContents?.[i], meta: m.attachmentsMeta?.[i] })} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <ActionButtons
                                    onCopy={() => handleCopyMessage(displayedText)}
                                    onEdit={!isAssistant ? () => onEditUserMessage?.(String(m.id), displayedText) : undefined}
                                    onStop={!isAssistant ? onStopGeneration : undefined}
                                    showStop={showStopForMessage(m)}
                                    isAssistant={isAssistant}
                                    isMessageComplete={isMessageComplete}
                                    isWelcomeMessage={welcomeFlag}
                                    versionNav={versionNav}
                                    disabled={isGenerating}
                                />
                            </div>
                        </div>
                    );
                })}
                {showGlobalThinking && <ThinkingIndicator searchSites={searchSites} />}
            </div>
            <FileModal file={modalFile} onClose={() => setModalFile(null)} />
            <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />
        </>
    );
};