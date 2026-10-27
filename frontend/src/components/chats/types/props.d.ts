export interface Message {
    id: string | number;
    text: string;
    sender: 'user' | 'assistant';
    attachments?: string[];
    attachmentIds?: number[];
    attachmentsMeta?: { lines?: number; chars?: number; words?: number; size?: number }[];
    attachmentContents?: string[];
}

export interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
}

export interface ChatSession {
    id: number;
    title: string;
    messages: Message[];
    loaded: boolean;
    isEmpty?: boolean;
}

export interface MessageVersion {
    version_id: number;
    message_id: number;
    content: string;
    version_number: number;
    created_at: string;
}