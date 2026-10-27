import fs from "fs-extra";
import path from "path";
import dotenv from "dotenv";
import { Ollama } from "ollama";
import "../src/db";
import DocumentChunk from "../models/document_chunk.model";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdf = require("pdf-parse");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const DOCS_PATH = path.resolve(__dirname, "../uploads");
const MODEL_NAME = "gemma2:2b";
const CHUNK_SIZE = 500;

async function loadDocuments(): Promise<{ text: string; filename: string }[]> {
    const files = await fs.readdir(DOCS_PATH);
    const documents: { text: string; filename: string }[] = [];

    for (const file of files) {
        const filePath = path.join(DOCS_PATH, file);

        try {
            const buffer = await fs.readFile(filePath);

            // Intentamos leerlo como PDF (aunque no tenga extensión)
            try {
                const data = await pdf(buffer);
                if (data.text && data.text.trim().length > 10) {
                    documents.push({ text: data.text, filename: file });
                    continue; // Si funcionó como PDF, pasamos al siguiente
                }
            } catch (e) {
                // Si falla como PDF, intentamos como texto plano
                const text = await fs.readFile(filePath, "utf8");
                if (text.trim().length > 0) {
                    documents.push({ text, filename: file });
                }
            }
        } catch (err) {
            console.error(`Error procesando ${file}:`, err);
        }
    }
    return documents;
}

function splitTexts(docs: { text: string; filename: string }[]): { chunk: string; filename: string }[] {
    const result: { chunk: string; filename: string }[] = [];

    for (const { text, filename } of docs) {
        const paragraphs = text.split(/\n\n+/);
        for (const paragraph of paragraphs) {
            if (!paragraph.trim()) continue;
            if (paragraph.length <= CHUNK_SIZE) {
                result.push({ chunk: paragraph.trim(), filename });
            } else {
                const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
                let current = "";
                for (const sentence of sentences) {
                    if ((current + sentence).length <= CHUNK_SIZE) {
                        current += sentence;
                    } else {
                        if (current) result.push({ chunk: current.trim(), filename });
                        current = sentence;
                    }
                }
                if (current) result.push({ chunk: current.trim(), filename });
            }
        }
    }
    return result;
}

async function generateEmbeddings(
    chunks: { chunk: string; filename: string }[],
    ollama: Ollama
): Promise<number[][]> {
    const embeddings: number[][] = [];
    console.log(`🔢 Generando embeddings para ${chunks.length} chunks...`);

    for (let i = 0; i < chunks.length; i++) {
        const response = await ollama.embeddings({ model: MODEL_NAME, prompt: chunks[i].chunk });
        embeddings.push(response.embedding);
        if ((i + 1) % 5 === 0) console.log(`   Procesados ${i + 1}/${chunks.length}`);
    }
    return embeddings;
}

async function saveToDatabase(
    chunks: { chunk: string; filename: string }[],
    embeddings: number[][]
): Promise<void> {
    console.log("💾 Guardando en base de datos MySQL...");

    // Borrar todo antes de reingestar para no duplicar
    await DocumentChunk.query().delete();

    // MySQL no soporta batch insert con Objection → insertar fila por fila
    for (let i = 0; i < chunks.length; i++) {
        await DocumentChunk.query().insert({
            doc_id: `doc_${i}`,
            content: chunks[i].chunk,
            embedding: JSON.stringify(embeddings[i]),
            source_file: chunks[i].filename,
        });
        if ((i + 1) % 5 === 0) console.log(`   Guardados ${i + 1}/${chunks.length}`);
    }
}

async function ingest(): Promise<void> {
    console.log("📥 Cargando documentos desde", DOCS_PATH);
    const docs = await loadDocuments();

    if (docs.length === 0) {
        console.log(`⚠️  No hay documentos en ${DOCS_PATH}. Sube archivos PDF o TXT.`);
        return;
    }

    console.log(`✅ ${docs.length} archivo(s) encontrado(s)`);
    const chunks = splitTexts(docs);
    console.log(`✂️  ${chunks.length} chunks creados`);

    const ollama = new Ollama({ host: "http://localhost:11434" });
    const embeddings = await generateEmbeddings(chunks, ollama);
    await saveToDatabase(chunks, embeddings);

    console.log(`\n✅ Ingesta completada — ${chunks.length} chunks guardados en MySQL`);
}

ingest().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});