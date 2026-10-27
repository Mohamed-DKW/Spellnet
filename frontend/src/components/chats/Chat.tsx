import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io as createSocket, type Socket } from 'socket.io-client';
import { Sidebar } from './components/Sidebar';
import { MessageList } from './components/MessageList';
import { InputArea } from './components/InputArea';
import { useChat } from './hooks/useChat';
import { OrnateDivider } from './hooks/OrnateDivider';
import { dndStyles } from './styles/ddnStyles';
import { BASE_URL } from './constants';
import type { UploadedFile, Message } from './types/props';

interface VersionSnapshot {
    text: string;
    responseText?: string;
    versionNumber: number;
}

const Chat: React.FC = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [user, setUser] = useState<any>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [inputText, setInputText] = useState('');
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [fileObjects, setFileObjects] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentResponseId, setCurrentResponseId] = useState<number | null>(null);
    const [hasStartedTyping, setHasStartedTyping] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const socketRef = useRef<Socket | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [versionSnapshots, setVersionSnapshots] = useState<Map<string, VersionSnapshot[]>>(new Map());
    const [currentVersionIdx, setCurrentVersionIdx] = useState<Map<string, number>>(new Map());

    const {
        sessions, setSessions,
        activeId, setActiveId,
        loadingChats,
        loadingMessages,
        isTyping, setIsTyping,
        planBlocked,
        handleNewChat, handleDeleteChat, markChatUsed,
        reloadMessages,
    } = useChat(user, token);

    const activeSession = sessions.find(s => s.id === activeId) ?? null;
    const isDisabled = isTyping || !activeSession || planBlocked;

    // Scroll handling
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            setShowScrollButton(!isNearBottom);
        }
    };

    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: scrollContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    // Load versions for a message
    const loadVersionsForMessage = async (messageFullId: string, currentText: string, currentResponseText?: string, targetVersionNumber?: number) => {
        const numericId = parseInt(messageFullId.replace('u-', ''));
        if (isNaN(numericId)) return;
        try {
            const res = await fetch(`${BASE_URL}/api/message/${numericId}/versions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            let historical: VersionSnapshot[] = (data.versions || []).map((v: any) => ({
                text: v.content,
                responseText: v.response_content,
                versionNumber: v.version_number
            }));
            // Add current version if not present (except when restoring a specific version)
            const exists = historical.some(v => v.text === currentText);
            if (!exists && targetVersionNumber === undefined) {
                const lastVersionNum = historical.length > 0 ? historical[historical.length - 1].versionNumber : 0;
                historical.push({ text: currentText, responseText: currentResponseText, versionNumber: lastVersionNum + 1 });
            }
            // Sort by version number to ensure order
            historical.sort((a, b) => a.versionNumber - b.versionNumber);
            setVersionSnapshots(prev => new Map(prev).set(messageFullId, historical));

            // Determine target index
            let targetIdx = historical.length - 1;
            if (targetVersionNumber !== undefined) {
                const foundIdx = historical.findIndex(v => v.versionNumber === targetVersionNumber);
                if (foundIdx !== -1) targetIdx = foundIdx;
            } else {
                // Check localStorage for saved index
                const storedKey = `chat_version_${activeId}_${messageFullId}`;
                const storedVersion = localStorage.getItem(storedKey);
                if (storedVersion && !isNaN(parseInt(storedVersion))) {
                    const storedIdx = parseInt(storedVersion);
                    if (storedIdx >= 0 && storedIdx < historical.length) {
                        targetIdx = storedIdx;
                    }
                    localStorage.removeItem(storedKey);
                }
            }
            console.log(`[Versions loaded] ${messageFullId}: ${historical.length} versions, target index ${targetIdx}/${historical.length - 1}`);
            setCurrentVersionIdx(prev => new Map(prev).set(messageFullId, targetIdx));
        } catch (err) {
            console.error('Error loading versions:', err);
            setVersionSnapshots(prev => new Map(prev).set(messageFullId, [{ text: currentText, responseText: currentResponseText, versionNumber: 1 }]));
            setCurrentVersionIdx(prev => new Map(prev).set(messageFullId, 0));
        }
    };

    // Load versions when messages are loaded
    useEffect(() => {
        if (activeSession?.messages) {
            activeSession.messages.forEach(msg => {
                if (msg.sender === 'user' && typeof msg.id === 'string' && msg.id.startsWith('u-')) {
                    if (!versionSnapshots.has(msg.id)) {
                        const assistantMsg = activeSession.messages.find(m => {
                            if (m.sender !== 'assistant') return false;
                            const msgIdStr = String(m.id);
                            const userMsgIdStr = String(msg.id);
                            const assistantNum = parseInt(msgIdStr.replace('a-', ''));
                            const userNum = parseInt(userMsgIdStr.replace('u-', ''));
                            return assistantNum === userNum;
                        });
                        loadVersionsForMessage(msg.id, msg.text, assistantMsg?.text);
                    }
                }
            });
        }
    }, [activeSession?.messages]);

    const stopGeneration = async () => {
        if (!currentResponseId) return;
        try {
            await fetch(`${BASE_URL}/api/upload/abort`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: JSON.stringify({ responseId: currentResponseId }),
            });
            setIsTyping(false);
            setIsGenerating(false);
            setCurrentResponseId(null);
            setHasStartedTyping(false);
        } catch (error) {
            console.error('Abort error:', error);
        }
    };

    // Auth effect
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        axios.get(`${BASE_URL}/api/user/location`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => setUser(r.data))
            .catch(() => navigate('/login'));
    }, [token, navigate]);

    // Socket connection
    useEffect(() => {
        if (!user?.user_id) return;
        const socket = createSocket(BASE_URL, { transports: ['websocket', 'polling'], withCredentials: true });
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('join-user', user.user_id);
            if (activeId) socket.emit('join-chat', activeId);
        });
        socket.on('assistant:prepare', ({ chatId, responseId }) => {
            console.log('[Socket] assistant:prepare', { chatId, responseId });
            setHasStartedTyping(false);
            setIsTyping(true);
            setIsGenerating(true);
            setCurrentResponseId(responseId);
        });
        socket.on('assistant:start', ({ chatId, responseId }) => {
            console.log('[Socket] assistant:start', { chatId, responseId });
            setHasStartedTyping(true);
            setIsTyping(true);
            setIsGenerating(true);
            setCurrentResponseId(responseId);
            setSessions(prev => prev.map(session => {
                if (session.id !== Number(chatId)) return session;
                const exists = session.messages.some(m => m.id === `a-${responseId}`);
                if (exists) return session;
                return { ...session, messages: [...session.messages, { id: `a-${responseId}`, text: '', sender: 'assistant' as const }] };
            }));
        });
        socket.on('assistant:token', ({ chatId, responseId, token: tokenChunk }) => {
            setSessions(prev => prev.map(session => {
                if (session.id !== Number(chatId)) return session;
                const updatedMessages = session.messages.map(message =>
                    message.id === `a-${responseId}` ? { ...message, text: (message.text || '') + tokenChunk } : message
                );
                return { ...session, messages: updatedMessages };
            }));
        });
        socket.on('assistant:end', ({ chatId, responseId, reply }) => {
            console.log('[Socket] assistant:end', { chatId, responseId });
            setSessions(prev => prev.map(session => {
                if (session.id !== Number(chatId)) return session;
                const updatedMessages = session.messages.map(message =>
                    message.id === `a-${responseId}` ? { ...message, text: reply || message.text } : message
                );
                return { ...session, messages: updatedMessages };
            }));
            setIsTyping(false);
            setIsGenerating(false);
            setCurrentResponseId(null);
            setHasStartedTyping(false);
        });
        socket.on('assistant:error', () => {
            console.log('[Socket] assistant:error');
            setIsTyping(false);
            setIsGenerating(false);
            setCurrentResponseId(null);
            setHasStartedTyping(false);
        });
        socket.on('chat:title-updated', ({ chatId, title }) => {
            setSessions(prev => prev.map(s => s.id === Number(chatId) ? { ...s, title } : s));
        });
        socket.on('messages:reload', ({ chatId }) => {
            if (Number(chatId) === activeId) {
                reloadMessages(Number(chatId));
                setVersionSnapshots(new Map());
                setCurrentVersionIdx(new Map());
            }
        });
        socket.on('message:edited', ({ chatId, messageId, newContent }) => {
            console.log('[Socket] message:edited', { chatId, messageId, newContent });
            if (Number(chatId) === activeId) {
                setSessions(prev => prev.map(session => {
                    if (session.id !== Number(chatId)) return session;
                    const updatedMessages = session.messages.map(msg =>
                        msg.id === `u-${messageId}` ? { ...msg, text: newContent } : msg
                    );
                    return { ...session, messages: updatedMessages };
                }));
                // Recargar las versiones reales desde el backend
                loadVersionsForMessage(`u-${messageId}`, newContent);
            }
        });
        socket.on('assistant:response-created', () => { });
        socket.on('version:changed', ({ chatId, restoredVersionNumber, updatedUserMessage, updatedResponse, deletedMessageIds }) => {
            console.log('[Socket] version:changed', { chatId, restoredVersionNumber, updatedUserMessage });
            if (Number(chatId) !== activeId) return;

            // Actualizar los mensajes
            setSessions(prev => prev.map(session => {
                if (session.id !== Number(chatId)) return session;
                let newMessages = [...session.messages];
                const userMsgIndex = newMessages.findIndex(m => String(m.id) === `u-${updatedUserMessage.message_id}`);
                if (userMsgIndex !== -1) {
                    // Eliminar todos los mensajes posteriores al mensaje de usuario editado
                    newMessages = newMessages.slice(0, userMsgIndex + 1);
                    // Actualizar el texto del mensaje de usuario
                    newMessages[userMsgIndex] = {
                        ...newMessages[userMsgIndex],
                        text: updatedUserMessage.text
                    };
                }
                if (updatedResponse) {
                    newMessages.push({
                        id: `a-${updatedResponse.response_id}`,
                        text: updatedResponse.text,
                        sender: 'assistant'
                    });
                }
                return { ...session, messages: newMessages };
            }));

            // Recargar las versiones con el número de versión restaurado
            if (updatedUserMessage) {
                // Forzar la recarga de versiones y establecer el índice a la versión restaurada
                loadVersionsForMessage(`u-${updatedUserMessage.message_id}`, updatedUserMessage.text, undefined, restoredVersionNumber);
            }
        });
        socket.on('disconnect', () => console.warn('Socket disconnected'));
        return () => { socket.disconnect(); socketRef.current = null; };
    }, [user?.user_id, activeId]);

    useEffect(() => {
        if (!socketRef.current || !activeId) return;
        socketRef.current.emit('join-chat', activeId);
    }, [activeId]);

    // Dialog for editing
    const showVersionedEditDialog = (snapshotsTexts: string[], currentIdx: number, initialText: string): Promise<string | null> => {
        return new Promise((resolve) => {
            const container = document.createElement('div');
            container.className = 'version-edit-overlay';
            const versionsToShow = snapshotsTexts.length > 0 ? snapshotsTexts : [initialText];
            let idx = currentIdx >= 0 && currentIdx < versionsToShow.length ? currentIdx : versionsToShow.length - 1;
            container.innerHTML = `
        <div class="version-edit-modal">
          <div class="version-edit-header"><span>✎ Editar mensaje</span><button class="version-close-btn">✕</button></div>
          <textarea class="version-textarea">${escapeHtml(versionsToShow[idx])}</textarea>
          <div class="version-controls">
            <button class="version-prev" ${idx === 0 ? 'disabled' : ''}>◀ Anterior</button>
            <span class="version-counter">${idx + 1}/${versionsToShow.length}</span>
            <button class="version-next" ${idx === versionsToShow.length - 1 ? 'disabled' : ''}>Siguiente ▶</button>
          </div>
          <div class="version-actions"><button class="version-cancel">Cancelar</button><button class="version-save">Guardar</button></div>
        </div>
      `;
            document.body.appendChild(container);
            const textarea = container.querySelector('.version-textarea') as HTMLTextAreaElement;
            const prevBtn = container.querySelector('.version-prev') as HTMLButtonElement;
            const nextBtn = container.querySelector('.version-next') as HTMLButtonElement;
            const counterSpan = container.querySelector('.version-counter') as HTMLSpanElement;
            const saveBtn = container.querySelector('.version-save') as HTMLButtonElement;
            const cancelBtn = container.querySelector('.version-cancel') as HTMLButtonElement;
            const closeBtn = container.querySelector('.version-close-btn') as HTMLButtonElement;
            const updateView = () => {
                textarea.value = versionsToShow[idx];
                counterSpan.textContent = `${idx + 1}/${versionsToShow.length}`;
                prevBtn.disabled = idx === 0;
                nextBtn.disabled = idx === versionsToShow.length - 1;
            };
            const onPrev = () => { if (idx > 0) { idx--; updateView(); } };
            const onNext = () => { if (idx < versionsToShow.length - 1) { idx++; updateView(); } };
            const onSave = () => { resolve(textarea.value); container.remove(); };
            const onCancel = () => { resolve(null); container.remove(); };
            prevBtn.addEventListener('click', onPrev);
            nextBtn.addEventListener('click', onNext);
            saveBtn.addEventListener('click', onSave);
            cancelBtn.addEventListener('click', onCancel);
            closeBtn.addEventListener('click', onCancel);
            textarea.focus();
        });
    };

    function escapeHtml(str: string) {
        return str.replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m] || m));
    }

    // Edit message with regeneration - CORRECTED
    const editMessageWithContent = async (messageId: string, newContent: string) => {
        const currentMessages = activeSession?.messages || [];
        const messageIndex = currentMessages.findIndex(m => String(m.id) === messageId);
        if (messageIndex === -1) return;

        // OPTIMISTIC UPDATE: Delete all later messages and update user message text
        const newMessages = currentMessages.slice(0, messageIndex + 1);
        newMessages[messageIndex] = { ...newMessages[messageIndex], text: newContent };

        // Update local state immediately for visual feedback
        setSessions(prev => prev.map(s => s.id === activeId ? { ...s, messages: newMessages } : s));

        // ---> INMEDIATELY ADD A PLACEHOLDER VERSION <---
        const messageFullId = messageId;
        const currentSnapshots = versionSnapshots.get(messageFullId) || [];
        // Calculate next version number
        const lastVersionNum = currentSnapshots.length > 0 ? currentSnapshots[currentSnapshots.length - 1].versionNumber : 0;
        const newVersionNumber = lastVersionNum + 1;

        // Create a placeholder snapshot (without AI response - it's empty for now)
        const placeholderSnapshot: VersionSnapshot = {
            text: newContent,
            responseText: '',
            versionNumber: newVersionNumber,
        };

        // Update the snapshots map
        const updatedSnapshots = [...currentSnapshots, placeholderSnapshot];
        setVersionSnapshots(prev => new Map(prev).set(messageFullId, updatedSnapshots));
        // Set the current index to the new placeholder version
        setCurrentVersionIdx(prev => new Map(prev).set(messageFullId, updatedSnapshots.length - 1));
        // ---> END OF PLACEHOLDER VERSION ADDITION <---

        // Show "Thinking..." indicator
        setIsTyping(true);
        setHasStartedTyping(false);
        setIsGenerating(true);

        try {
            const response = await fetch(`${BASE_URL}/api/message/edit`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    message_id: parseInt(messageId.replace('u-', '')),
                    new_content: newContent,
                    chat_id: activeId,
                }),
            });
            if (!response.ok) throw new Error('Edit failed');
        } catch (error) {
            console.error('Error editing message:', error);
            alert('No se pudo editar el mensaje');
            setIsTyping(false);
            setIsGenerating(false);
            // Rollback optimistic update: remove the placeholder? For simplicity, we'll reload the conversation.
            if (activeId) reloadMessages(activeId);
        }
    };

    const handleEditUserMessageWithVersions = async (messageId: string, currentText: string) => {
        if (isGenerating) {
            alert('Espera a que termine de escribir antes de editar');
            return;
        }
        const snapshots = versionSnapshots.get(messageId) || [];
        const currentIdx = currentVersionIdx.get(messageId) ?? (snapshots.length > 0 ? snapshots.length - 1 : 0);
        const snapshotTexts = snapshots.map(s => s.text);
        const newText = await showVersionedEditDialog(snapshotTexts, currentIdx, currentText);
        if (!newText || newText === (snapshots[currentIdx]?.text || currentText)) return;
        await editMessageWithContent(messageId, newText);
    };

    // Switch version
    const handleVersionChange = async (messageId: string, newIndex: number) => {
        if (isGenerating) {
            alert('Espera a que termine de escribir antes de cambiar de versión');
            return;
        }
        const snapshots = versionSnapshots.get(messageId);
        if (!snapshots || newIndex < 0 || newIndex >= snapshots.length) return;
        const selected = snapshots[newIndex];
        if (!selected) return;

        console.log(`[Version change] ${messageId} to index ${newIndex} (version ${selected.versionNumber})`);

        // Actualizar inmediatamente el índice local para feedback visual
        setCurrentVersionIdx(prev => new Map(prev).set(messageId, newIndex));

        const numericMsgId = parseInt(messageId.replace('u-', ''));
        try {
            const res = await fetch(`${BASE_URL}/api/message/version`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    message_id: numericMsgId,
                    version_number: selected.versionNumber,
                    chat_id: activeId,
                }),
            });
            if (!res.ok) throw new Error('Failed to switch version');
            // Guardar en localStorage como respaldo
            localStorage.setItem(`chat_version_${activeId}_${messageId}`, newIndex.toString());
        } catch (err) {
            console.error('Error switching version:', err);
            alert('No se pudo cambiar a esa versión');
            // Revertir el cambio local si falla
            const snapshotsNow = versionSnapshots.get(messageId) || [];
            const currentVersion = currentVersionIdx.get(messageId) ?? 0;
            setCurrentVersionIdx(prev => new Map(prev).set(messageId, currentVersion));
        }
    };

    // Drag & drop
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); if (!isDragging) setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false); };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    };
    const addFiles = (list: FileList) => {
        const arr = Array.from(list);
        setFiles(prev => [...prev, ...arr.map(f => ({ id: Math.random().toString(36).slice(2), name: f.name, size: f.size, type: f.type }))]);
        setFileObjects(prev => [...prev, ...arr]);
    };
    const removeFile = (id: string) => {
        const target = files.find(f => f.id === id);
        if (!target) return;
        setFiles(prev => prev.filter(f => f.id !== id));
        setFileObjects(prev => prev.filter(f => !(f.name === target.name && f.size === target.size)));
    };
    const clearFiles = () => { setFiles([]); setFileObjects([]); };

    // --------------------------------------------------------
    // EDICIÓN DE MENSAJES (botones copiar/editar)
    // --------------------------------------------------------

    const handleUpdateMessage = (messageId: string, newText: string) => {
        setSessions(prev => prev.map(session => {
            if (session.id !== activeId) return session;
            return {
                ...session,
                messages: session.messages.map(message =>
                    message.id === messageId ? { ...message, text: newText } : message
                ),
            };
        }));
    };

    const handleUpdateAssistantMessage = (responseId: string, newText: string) => {
        setSessions(prev => prev.map(session => {
            if (session.id !== activeId) return session;
            return {
                ...session,
                messages: session.messages.map(message =>
                    message.id === responseId ? { ...message, text: newText } : message
                ),
            };
        }));
    };

    /** Tras editar un prompt, el backend borra turnos posteriores; alinear el estado local. */
    const handlePruneAfterEdit = (pruned: { prunedUserMessageIds: number[]; prunedResponseIds: number[] }) => {
        const removeIds = new Set<string>([
            ...pruned.prunedUserMessageIds.map(id => `u-${id}`),
            ...pruned.prunedResponseIds.map(id => `a-${id}`),
        ]);
        setSessions(prev => prev.map(session => {
            if (session.id !== activeId) return session;
            return {
                ...session,
                messages: session.messages.filter(m => !removeIds.has(String(m.id))),
            };
        }));
    };

    // --------------------------------------------------------
    // ENVÍO DE MENSAJE
    // --------------------------------------------------------


    const handleSend = async () => {
        if ((!inputText.trim() && fileObjects.length === 0) || isDisabled) return;
        setIsTyping(true);
        setHasStartedTyping(false);
        const currentText = inputText;
        const userMsgId = `u-${Date.now()}`;
        setSessions(prev => prev.map(s => {
            if (s.id !== activeId) return s;
            return { ...s, messages: [...s.messages, { id: userMsgId, text: currentText, sender: 'user' as const, attachments: files.map(f => f.name) }] };
        }));
        setInputText('');
        clearFiles();
        try {
            const formData = new FormData();
            formData.append('message', currentText);
            formData.append('chat_id', activeId!.toString());
            fileObjects.forEach(f => formData.append('files', f));
            const res = await fetch(`${BASE_URL}/api/upload`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Server error');
            setSessions(prev => prev.map(s => {
                if (s.id !== activeId) return s;
                return {
                    ...s,
                    messages: s.messages.map(m =>
                        m.id === userMsgId ? { ...m, id: `u-${data.messageId}`, attachments: data.files.map((f: any) => f.name), attachmentIds: data.files.map((f: any) => f.id), attachmentsMeta: data.files.map((f: any) => ({ size: f.size, lines: f.lines, words: f.words })) } : m
                    ),
                };
            }));
            if (data.messageId && activeId) {
                const title = currentText.slice(0, 40) + (currentText.length > 40 ? '…' : '');
                markChatUsed(activeId, title);
            }
        } catch (error) {
            console.error('Send error:', error);
            setSessions(prev => prev.map(s => {
                if (s.id !== activeId) return s;
                return { ...s, messages: s.messages.filter(m => m.id !== userMsgId) };
            }));
            setIsTyping(false);
            setHasStartedTyping(false);
        }
    };

    return (
        <div className="spell-chat-container" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            <style>{dndStyles}</style>
            {isDragging && (
                <div className="drag-overlay">
                    <div className="drag-drop-zone">
                        <div className="drag-zone-corner dzc-tl" /><div className="drag-zone-corner dzc-tr" />
                        <div className="drag-zone-corner dzc-bl" /><div className="drag-zone-corner dzc-br" />
                        <div style={{ fontSize: '48px', filter: 'drop-shadow(0 0 20px rgba(251,191,36,0.6))' }}>📜</div>
                        <div style={{ fontFamily: 'Cinzel,serif', fontSize: '18px', fontWeight: 700, color: 'rgba(251,191,36,0.9)', letterSpacing: '3px', textAlign: 'center' }}>SUELTA TU PERGAMINO</div>
                        <div style={{ fontFamily: 'Cinzel,serif', fontSize: '11px', color: 'rgba(251,191,36,0.45)', letterSpacing: '2px', textAlign: 'center' }}>El grimorio absorberá el conocimiento</div>
                    </div>
                </div>
            )}
            <Sidebar sidebarOpen={sidebarOpen} sessions={sessions} activeId={activeId} loadingChats={loadingChats} user={user} onSelectChat={setActiveId} onNewChat={handleNewChat} onDeleteChat={handleDeleteChat} />
            {sidebarOpen && <OrnateDivider />}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative', overflow: 'hidden' }}>
                <div className="parchment-watermark">⚔</div>
                <div style={{ padding: '12px 24px 12px 60px', borderBottom: '1px solid rgba(251,191,36,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(8,5,3,0.7)', backdropFilter: 'blur(14px)', flexShrink: 0, position: 'relative', zIndex: 5 }}>
                    <button onClick={() => setSidebarOpen(o => !o)} style={{ position: 'absolute', left: '14px', width: '34px', height: '34px', background: 'rgba(17,13,8,0.85)', border: '1px solid rgba(251,191,36,0.28)', borderRadius: '7px', cursor: 'pointer', color: 'rgba(251,191,36,0.65)', fontSize: '12px' }}>{sidebarOpen ? '◀' : '▶'}</button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'Cinzel,serif', fontSize: '10px', color: 'rgba(251,191,36,0.45)', letterSpacing: '1px' }}>📜 {activeSession?.title ?? 'Sin conjuro activo'}</span>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isTyping ? '#fbbf24' : '#10b981', boxShadow: isTyping ? '0 0 6px rgba(251,191,36,0.8)' : '0 0 6px rgba(16,185,129,0.8)' }} />
                    </div>
                    <div className="crest-border">⚔ &nbsp;SpellNet Oracle&nbsp; ⚔</div>
                    <div style={{ fontSize: '9px', color: 'rgba(251,191,36,0.2)', letterSpacing: '2px' }}>◆ D&amp;D AI ◆</div>
                </div>
                {!activeSession && !loadingChats ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px' }}>
                        <div style={{ fontSize: '64px', opacity: 0.12 }}>📜</div>
                        <div style={{ fontFamily: 'Cinzel, serif', fontSize: '11px', letterSpacing: '3px', color: 'rgba(251,191,36,0.25)', textAlign: 'center' }}>NINGÚN CONJURO ACTIVO<br /><span style={{ fontSize: '9px' }}>Selecciona o crea un nuevo conjuro</span></div>
                        <button onClick={handleNewChat} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, rgba(92,40,9,0.5), rgba(120,53,9,0.5))', border: '1px solid rgba(251,191,36,0.28)', borderRadius: '8px', color: 'rgba(251,191,36,0.75)', fontFamily: 'Cinzel, serif', fontSize: '10px', letterSpacing: '2px', cursor: 'pointer' }}>✦ NUEVO CONJURO</button>
                    </div>
                ) : loadingMessages ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
                        <div className="loading-spinner" style={{ width: '40px', height: '40px' }} />
                        <span style={{ fontFamily: 'Cinzel, serif', fontSize: '11px', letterSpacing: '2px', color: 'rgba(251,191,36,0.45)' }}>CARGANDO CONJUROS...</span>
                    </div>
                ) : (

                    <div ref={scrollContainerRef} style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                        <MessageList
                            messages={activeSession?.messages ?? []}
                            isTyping={isTyping}
                            hasStartedTyping={hasStartedTyping}
                            userName={user?.name ?? 'Aventurero'}
                            onStopGeneration={stopGeneration}
                            isGenerating={isGenerating}
                            onEditUserMessage={handleEditUserMessageWithVersions}
                            versionSnapshots={versionSnapshots}
                            currentVersionIdx={currentVersionIdx}
                            onVersionChange={handleVersionChange}
                        />
                        {showScrollButton && (
                            <button onClick={scrollToBottom} className="scroll-to-bottom-rune" title="Bajar al final" style={{ position: 'fixed', bottom: '100px', right: '24px', width: '44px', height: '44px', background: 'rgba(20,14,6,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(251,191,36,0.5)', borderRadius: '50%', cursor: 'pointer', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s ease', zIndex: 200, boxShadow: '0 0 15px rgba(251,191,36,0.3)' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                        )}
                    </div>
                )}
                <InputArea inputText={inputText} setInputText={setInputText} files={files} onSend={handleSend} onAddFiles={addFiles} onRemoveFile={removeFile} onClearFiles={clearFiles} isDisabled={isDisabled} isTyping={isTyping} activeSessionExists={!!activeSession} planBlocked={planBlocked} />
            </main>
            <style>{`
        .version-edit-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 10000; display: flex; align-items: center; justify-content: center; }
        .version-edit-modal { background: linear-gradient(135deg, #1e150c, #120d07); border: 1px solid rgba(251,191,36,0.4); border-radius: 16px; width: 500px; max-width: 90vw; }
        .version-edit-header { display: flex; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid rgba(251,191,36,0.2); font-family: 'Cinzel', serif; color: #fbbf24; }
        .version-close-btn { background: none; border: none; color: #fbbf24; cursor: pointer; font-size: 18px; }
        .version-textarea { width: calc(100% - 32px); background: rgba(10,7,4,0.9); border: 1px solid rgba(251,191,36,0.3); border-radius: 8px; padding: 12px; margin: 16px; color: #e4d2aa; font-family: 'Cormorant Garamond', serif; font-size: 1rem; resize: vertical; }
        .version-controls { display: flex; justify-content: center; align-items: center; gap: 16px; margin: 8px 16px 16px; }
        .version-controls button { background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.3); border-radius: 20px; padding: 4px 12px; color: #fbbf24; cursor: pointer; font-family: 'Cinzel', serif; font-size: 12px; }
        .version-controls button:disabled { opacity: 0.3; cursor: not-allowed; }
        .version-counter { font-family: 'Cinzel', serif; color: #fbbf24; }
        .version-actions { display: flex; justify-content: flex-end; gap: 12px; padding: 12px 16px; border-top: 1px solid rgba(251,191,36,0.1); }
        .version-actions button { padding: 6px 16px; border-radius: 6px; font-family: 'Cinzel', serif; cursor: pointer; }
        .version-cancel { background: transparent; border: 1px solid rgba(251,191,36,0.3); color: #fbbf24; }
        .version-save { background: rgba(251,191,36,0.2); border: 1px solid rgba(251,191,36,0.6); color: #fbbf24; }
      `}</style>
        </div>
    );
};

export default Chat;