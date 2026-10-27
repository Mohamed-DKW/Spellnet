import React, { useRef } from 'react';
import { D20 } from '../hooks/D20';
import { formatBytes } from '../hooks/formatBytes';
import { getFileIcon } from '../hooks/getFileIcon';
import { GOLD } from '../constants';
import type { UploadedFile } from '../types/props';

interface InputAreaProps {
    inputText: string;
    setInputText: (text: string) => void;
    files: UploadedFile[];
    onSend: () => void;
    onAddFiles: (files: FileList) => void;
    onRemoveFile: (id: string) => void;
    onClearFiles: () => void;
    isDisabled: boolean;
    isTyping: boolean;
    activeSessionExists: boolean;
    planBlocked: boolean;
}

const inputStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Cinzel:wght@400;600;700&family=JetBrains+Mono:wght@300;400&display=swap');

  .spell-textarea {
    width: 100%;
    height: 52px;
    min-height: 52px;
    max-height: 160px;
    resize: none;
    background: linear-gradient(160deg, rgba(10,7,4,0.95), rgba(15,11,6,0.9));
    border: 1px solid rgba(251,191,36,0.22);
    border-radius: 10px;
    color: rgba(228,210,170,0.92);
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.08em;
    font-weight: 400;
    line-height: 1.6;
    padding: 14px 16px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
    caret-color: rgba(251,191,36,0.8);
    letter-spacing: 0.02em;
  }
  .spell-textarea::placeholder {
    color: rgba(251,191,36,0.22);
    font-style: italic;
    font-size: 0.97em;
  }
  .spell-textarea:focus {
    border-color: rgba(251,191,36,0.45);
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.3), 0 0 16px rgba(251,191,36,0.06);
  }
  .spell-textarea:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .spell-upload-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 0 16px;
    height: 52px;
    flex-shrink: 0;
    background: linear-gradient(140deg, rgba(20,14,6,0.95), rgba(28,20,10,0.9));
    border: 1px solid rgba(251,191,36,0.28);
    border-radius: 10px;
    color: rgba(251,191,36,0.65);
    font-family: 'Cinzel', serif;
    font-size: 9px;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    box-shadow: 0 2px 12px rgba(0,0,0,0.4);
  }
  .spell-upload-btn:hover {
    border-color: rgba(251,191,36,0.55);
    color: #fbbf24;
    box-shadow: 0 0 18px rgba(251,191,36,0.1), 0 2px 12px rgba(0,0,0,0.4);
    background: linear-gradient(140deg, rgba(30,20,8,0.95), rgba(40,28,12,0.9));
  }
  .spell-upload-btn:active { transform: scale(0.97); }

  .spell-send-btn {
    width: 52px;
    height: 52px;
    flex-shrink: 0;
    background: linear-gradient(135deg, rgba(92,40,9,0.7), rgba(120,53,9,0.6));
    border: 1px solid rgba(251,191,36,0.35);
    border-radius: 10px;
    color: rgba(251,191,36,0.85);
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 12px rgba(0,0,0,0.4);
  }
  .spell-send-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(120,53,9,0.9), rgba(150,65,9,0.8));
    border-color: rgba(251,191,36,0.6);
    box-shadow: 0 0 20px rgba(251,191,36,0.15), 0 2px 12px rgba(0,0,0,0.4);
    transform: scale(1.04);
  }
  .spell-send-btn:active:not(:disabled) { transform: scale(0.96); }
  .spell-send-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .spell-file-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 11px;
    background: linear-gradient(135deg, rgba(15,10,5,0.9), rgba(20,14,7,0.85));
    border: 1px solid rgba(251,191,36,0.22);
    border-radius: 8px;
    animation: fileChipIn 0.2s ease-out;
    max-width: 190px;
    transition: border-color 0.15s;
  }
  .spell-file-chip:hover { border-color: rgba(251,191,36,0.4); }
  @keyframes fileChipIn {
    from { opacity: 0; transform: translateY(5px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

export const InputArea: React.FC<InputAreaProps> = ({
    inputText,
    setInputText,
    files,
    onSend,
    onAddFiles,
    onRemoveFile,
    onClearFiles,
    isDisabled,
    isTyping,
    activeSessionExists,
    planBlocked,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(e.target.value);
        // Auto-resize
        e.target.style.height = '52px';
        e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
    };

    return (
        <div className="input-area" style={{ position: 'relative', zIndex: 10 }}>
            <style>{inputStyles}</style>

            {/* Decorative separator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${GOLD(0.18)})` }} />
                <D20 size={13} opacity={0.25} />
                <span style={{ color: GOLD(0.18), fontSize: '10px', letterSpacing: '5px', fontFamily: 'serif' }}>ᚠ ✦ ᚢ</span>
                <D20 size={13} opacity={0.25} />
                <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${GOLD(0.18)}, transparent)` }} />
            </div>

            {/* File previews */}
            {files.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            padding: '3px 10px',
                            background: 'rgba(17,13,8,0.7)',
                            border: `1px solid ${GOLD(0.22)}`,
                            borderRadius: '20px',
                            fontFamily: 'Cinzel, serif', fontSize: '8.5px',
                            letterSpacing: '2px', color: GOLD(0.55),
                        }}>
                            <D20 size={11} opacity={0.6} />
                            {files.length} {files.length === 1 ? 'PERGAMINO' : 'PERGAMINOS'}
                        </div>
                        <div style={{ flex: 1, height: '1px', background: GOLD(0.08) }} />
                        <button
                            onClick={onClearFiles}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontSize: '8px', color: 'rgba(220,38,38,0.45)',
                                fontFamily: 'Cinzel, serif', letterSpacing: '1px',
                                transition: 'color 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(220,38,38,0.8)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(220,38,38,0.45)')}
                        >BORRAR TODO</button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {files.map(f => (
                            <div key={f.id} className="spell-file-chip">
                                <span style={{ fontSize: '15px', flexShrink: 0 }}>{getFileIcon(f.type)}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontFamily: 'Cinzel, serif', fontSize: '8.5px',
                                        letterSpacing: '0.4px', color: GOLD(0.8),
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                        maxWidth: '110px',
                                    }}>{f.name}</div>
                                    <div style={{
                                        fontFamily: "'JetBrains Mono', monospace", fontSize: '7.5px',
                                        color: GOLD(0.35), marginTop: '1px',
                                    }}>{formatBytes(f.size)}</div>
                                </div>
                                <button
                                    onClick={() => onRemoveFile(f.id)}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: GOLD(0.3), fontSize: '11px', padding: 0,
                                        lineHeight: 1, flexShrink: 0, transition: 'color 0.15s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(220,38,38,0.75)')}
                                    onMouseLeave={e => (e.currentTarget.style.color = GOLD(0.3))}
                                >✕</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Plan limit alert */}
            {planBlocked && (
                <div style={{
                    padding: '12px 16px', marginBottom: '10px',
                    background: 'rgba(220,38,38,0.08)',
                    border: '1px solid rgba(220,38,38,0.3)',
                    borderRadius: '8px',
                    fontFamily: 'Cinzel, serif', fontSize: '10px',
                    letterSpacing: '1.5px', color: '#ef4444',
                }}>
                    ⚠ Has alcanzado el límite de conjuros de tu plan
                </div>
            )}

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={(e) => e.target.files && onAddFiles(e.target.files)}
                    multiple
                />

                <button className="spell-upload-btn" onClick={() => fileInputRef.current?.click()}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                    ARCHIVO
                </button>

                <div style={{ flex: 1, position: 'relative' }}>
                    <textarea
                        className="spell-textarea"
                        placeholder={
                            !activeSessionExists ? 'Crea un conjuro para empezar…' :
                                isTyping ? 'El oráculo está conjurando...' :
                                    'Lanza tu hechizo al oráculo…'
                        }
                        value={inputText}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyPress}
                        disabled={isDisabled}
                    />
                </div>

                <button
                    className="spell-send-btn"
                    onClick={onSend}
                    disabled={isDisabled}
                    title="Enviar"
                >
                    {isTyping ? (
                        <div style={{
                            width: 14, height: 14,
                            border: '2px solid rgba(251,191,36,0.3)',
                            borderTopColor: 'rgba(251,191,36,0.85)',
                            borderRadius: '50%',
                            animation: 'spin 0.7s linear infinite',
                        }} />
                    ) : '➤'}
                </button>
            </div>

            <div style={{
                marginTop: '10px', textAlign: 'center',
                fontFamily: 'Cinzel, serif', fontSize: '8px',
                letterSpacing: '3px', color: GOLD(0.14),
            }}>
                SPELLNET · TU IA · TUS DATOS · TU PODER
            </div>
        </div>
    );
};