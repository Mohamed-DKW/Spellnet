import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API } from '../constants';
import type { ChatSession, Message } from '../types/props';

const ensureString = (text: any): string => {
    if (text === null || text === undefined) return '';
    if (typeof text === 'string') return text;
    if (typeof text === 'object') {
        if ('$$typeof' in text) return '';
        if (text.answer) return String(text.answer);
        if (text.text) return String(text.text);
        try { return JSON.stringify(text); } catch { return ''; }
    }
    return String(text);
};

const makeWelcome = (): Message => ({
    id: `welcome-${Date.now()}-${Math.random()}`,
    text: '¡Bienvenido, aventurero! Soy SpellNet, tu oráculo digital. ¿En qué puedo iluminarte hoy?',
    sender: 'assistant',
});

export const useChat = (user: any, token: string | null) => {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [planBlocked] = useState(false);

    const activeIdRef = useRef<number | null>(null);
    const setActiveIdSafe = (id: number | null) => {
        activeIdRef.current = id;
        setActiveId(id);
    };

    const createChatOnServer = async (): Promise<ChatSession | null> => {
        try {
            const res = await fetch(API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: 'Nuevo conjuro…',
                    user: { user_id: user?.user_id },
                }),
            });
            const data = await res.json();
            const chatId = data?.chat?.chat_id ?? data?.chat_id ?? data?.id ?? null;
            if (!chatId) return null;
            return {
                id: chatId,
                title: 'Nuevo conjuro…',
                messages: [makeWelcome()],
                loaded: true,
                isEmpty: true,
            };
        } catch (e) {
            console.error('Error creando chat:', e);
            return null;
        }
    };

    const loadMessages = async (chatId: number) => {
        if (!token) return;
        setLoadingMessages(true);
        try {
            const res = await axios.get(`${API}/${chatId}/messages`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            let messages: Message[] = res.data.messages?.length ? res.data.messages : [];
            if (messages.length === 0) messages = [makeWelcome()];
            setSessions(prev => prev.map(s =>
                s.id === chatId ? { ...s, messages, loaded: true } : s
            ));
        } catch (err) {
            console.error('Error cargando mensajes:', err);
            setSessions(prev => prev.map(s =>
                s.id === chatId ? { ...s, messages: [makeWelcome()], loaded: true } : s
            ));
        } finally {
            setLoadingMessages(false);
        }
    };

    const reloadMessages = (chatId: number) => {
        if (activeIdRef.current === chatId) loadMessages(chatId);
    };

    useEffect(() => {
        if (!user?.user_id || !token) return;
        setLoadingChats(true);

        axios.get(`${API}/${user.user_id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async ({ data }) => {
                const fetched: ChatSession[] = (data.chats ?? [])
                    .filter((c: any) => !(c.Name === 'Nuevo conjuro…' && c.message_count === 0))
                    .map((c: any) => ({
                        id: c.chat_id,
                        title: ensureString(c.Name ?? c.name ?? 'Sin título'),
                        messages: [],
                        loaded: false,
                        isEmpty: false,
                    }));

                const newSession = await createChatOnServer();
                if (newSession) {
                    setSessions([newSession, ...fetched]);
                    setActiveIdSafe(newSession.id);
                    await loadMessages(newSession.id);
                } else if (fetched.length > 0) {
                    setSessions(fetched);
                    setActiveIdSafe(fetched[0].id);
                    await loadMessages(fetched[0].id);
                } else {
                    setSessions([]);
                    setActiveIdSafe(null);
                }
            })
            .catch(async (e) => {
                console.error('Error cargando chats:', e);
                const newSession = await createChatOnServer();
                if (newSession) {
                    setSessions([newSession]);
                    setActiveIdSafe(newSession.id);
                    await loadMessages(newSession.id);
                }
            })
            .finally(() => setLoadingChats(false));
    }, [user?.user_id]);

    useEffect(() => {
        if (activeId && token) {
            const session = sessions.find(s => s.id === activeId);
            if (session && !session.loaded) loadMessages(activeId);
        }
    }, [activeId, token]);

    const handleNewChat = async () => {
        if (!user?.user_id) return;
        const newSession = await createChatOnServer();
        if (newSession) {
            setSessions(prev => [newSession, ...prev]);
            setActiveIdSafe(newSession.id);
            await loadMessages(newSession.id);
        }
    };

    const handleDeleteChat = async (id: number) => {
        setSessions(prev => {
            const rest = prev.filter(s => s.id !== id);
            if (id === activeIdRef.current) {
                const nextId = rest.length > 0 ? rest[0].id : null;
                setTimeout(() => setActiveIdSafe(nextId), 0);
            }
            return rest;
        });
        try {
            await axios.delete(`${API}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (e) {
            console.error('Error eliminando chat:', e);
        }
    };

    const markChatUsed = async (id: number, title: string) => {
        setSessions(prev =>
            prev.map(s => s.id === id ? { ...s, isEmpty: false, title: ensureString(title) } : s)
        );
        try {
            await axios.patch(`${API}/${id}`, { name: title }, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (e) {
            console.error('Error actualizando título:', e);
        }
    };

    return {
        sessions, setSessions,
        activeId, setActiveId: setActiveIdSafe,
        loadingChats,
        loadingMessages,
        isTyping, setIsTyping,
        planBlocked,
        handleNewChat,
        handleDeleteChat,
        markChatUsed,
        reloadMessages,
    };
};