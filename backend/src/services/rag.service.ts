import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { OllamaEmbeddings } from '@langchain/ollama';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { Document } from '@langchain/core/documents';
import fs from 'fs';
import path from 'path';
import db from '../db';

export class RAGService {
    private embeddings: OllamaEmbeddings;
    private splitter: RecursiveCharacterTextSplitter;
    private chromaConfig: { host: string; port: number; ssl?: boolean };

    constructor() {
        this.embeddings = new OllamaEmbeddings({
            model: 'nomic-embed-text',
            baseUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
        });

        this.splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const url = new URL(process.env.CHROMA_URL || 'http://localhost:8000');
        this.chromaConfig = {
            host: url.hostname,
            port: parseInt(url.port) || 8000,
            ssl: url.protocol === 'https:',
        };
    }

    async processDocument(filePath: string, fileName: string, fileId: number, preExtractedText?: string) {
        console.log(`[RAG] Procesando documento: ${fileName}`);
        let text = preExtractedText;
        if (!text) {
            text = await this.extractText(filePath, fileName);
        }
        console.log(`[RAG] Texto extraído (${text.length} chars)`);

        const chunks = await this.splitter.splitText(text);
        console.log(`[RAG] Dividido en ${chunks.length} chunks`);

        const documents = chunks.map((chunk: string, i: number) => new Document({
            pageContent: chunk,
            metadata: { source: fileName, fileId, chunkIndex: i },
        }));

        await Chroma.fromDocuments(documents, this.embeddings, {
            collectionName: `file_${fileId}`,
            ...this.chromaConfig,
        });

        console.log(`[RAG] Guardado en ChromaDB (colección: file_${fileId})`);

        try {
            fs.unlinkSync(filePath);
        } catch (e) {
            console.warn(`[RAG] No se pudo eliminar el temporal: ${filePath}`);
        }

        return { chunksCount: chunks.length, extractedText: text };
    }

    async searchRelevantInFile(query: string, fileId: number, topK: number = 3): Promise<Document[]> {
        console.log(`[RAG] Buscando en archivo ${fileId}: "${query}"`);
        try {
            const vectorStore = await Chroma.fromExistingCollection(this.embeddings, {
                collectionName: `file_${fileId}`,
                ...this.chromaConfig,
            });
            const results = await vectorStore.similaritySearch(query, topK);
            console.log(`[RAG] Encontrados ${results.length} chunks relevantes`);
            return results;
        } catch (err) {
            console.log(`[RAG] Colección file_${fileId} no existe o error:`, err);
            return [];
        }
    }

    // Nuevo método: obtener todos los IDs de archivo asociados a un chat
    async getAllFileIdsInChat(chatId: number): Promise<number[]> {
        const files = await db('file')
            .join('message', 'file.message_id', 'message.message_id')
            .where('message.chat_id', chatId)
            .select('file.file_id');
        return files.map(f => f.file_id);
    }

    // Nuevo método: buscar en todos los archivos del chat
    async searchRelevantInChat(chatId: number, query: string, topK: number = 3): Promise<Document[]> {
        const fileIds = await this.getAllFileIdsInChat(chatId);
        if (fileIds.length === 0) return [];

        console.log(`[RAG] Buscando en ${fileIds.length} archivos del chat ${chatId}: "${query}"`);
        const allResults: Document[] = [];
        for (const fileId of fileIds) {
            const results = await this.searchRelevantInFile(query, fileId, topK);
            allResults.push(...results);
        }
        // Ordenar por similitud (si Chroma devuelve score, podríamos ordenar; por ahora solo limitamos)
        return allResults.slice(0, topK * 2);
    }

    async indexMessage(chatId: number, messageId: number, content: string, role: 'user' | 'assistant'): Promise<void> {
        console.log(`[Memory] Indexando mensaje — chat ${chatId}, rol ${role}, id ${messageId}`);
        const doc = new Document({
            pageContent: content,
            metadata: {
                chatId,
                messageId,
                role,
                timestamp: Date.now(),
            },
        });
        try {
            await Chroma.fromDocuments([doc], this.embeddings, {
                collectionName: `chat_${chatId}_messages`,
                ...this.chromaConfig,
            });
        } catch (err) {
            console.error('Error indexando mensaje:', err);
        }
    }

    async searchRelevantMessages(chatId: number, query: string, topK: number = 4): Promise<{ content: string; role: string; messageId: number }[]> {
        try {
            const vectorStore = await Chroma.fromExistingCollection(this.embeddings, {
                collectionName: `chat_${chatId}_messages`,
                ...this.chromaConfig,
            });
            const results = await vectorStore.similaritySearch(query, topK);
            return results.map(doc => ({
                content: doc.pageContent,
                role: doc.metadata.role as string,
                messageId: doc.metadata.messageId as number,
            }));
        } catch (err) {
            console.log(`[Memory] Colección chat_${chatId}_messages aún no existe`);
            return [];
        }
    }

    private async extractText(filePath: string, fileName: string): Promise<string> {
        const ext = path.extname(fileName).toLowerCase();

        if (ext === '.txt' || ext === '.md') {
            return fs.readFileSync(filePath, 'utf-8');
        }

        if (ext === '.pdf') {
            const pdfParse = require('pdf-parse');
            const buffer = fs.readFileSync(filePath);
            const data = await pdfParse(buffer);
            return data.text;
        }

        if (ext === '.docx') {
            const mammoth = require('mammoth');
            const buffer = fs.readFileSync(filePath);
            const result = await mammoth.extractRawText({ buffer });
            return result.value;
        }

        const textExtensions = ['.js', '.ts', '.html', '.css', '.json', '.yml', '.conf', '.php', '.py', '.java', '.cs', '.c', '.sh', '.bat'];
        if (textExtensions.includes(ext)) {
            return fs.readFileSync(filePath, 'utf-8');
        }

        return `[Archivo no soportado para extracción de texto: ${fileName}]`;
    }
}