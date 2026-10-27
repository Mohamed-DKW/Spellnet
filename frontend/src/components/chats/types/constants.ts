import APIBack from '../../../services/api';
export const API = `${APIBack}/api/chat`;
export const UPLOAD_URL = `${APIBack}/api/upload`;
export const BASE_URL = `${APIBack}`;

import type { Message } from './props';

export const WELCOME_MESSAGE: Message = {
    id: 'welcome',
    text: 'Bienvenido, aventurero. Soy SpellNet, tu oraculo digital. En que puedo iluminarte hoy?',
    sender: 'assistant',
};

export const GOLD = (opacity: number) => `rgba(251,191,36,${opacity})`;