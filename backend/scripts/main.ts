import dotenv from "dotenv";
import path from "path";
import readline from "readline";
import { Ollama } from "ollama";
import "../src/db";
import DocumentChunk from "../models/document_chunk.model";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MODEL_NAME = "gemma2:2b";
const TOP_K = 3;

interface RankedChunk {
    content: string;
    similarity: number;
    source_file: string;
}

function cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function searchRelevantChunks(query: string, ollama: Ollama): Promise<RankedChunk[]> {
    const queryEmbedding = await ollama.embeddings({ model: MODEL_NAME, prompt: query });
    const allChunks = await DocumentChunk.query().select("content", "embedding", "source_file");

    if (allChunks.length === 0) {
        console.error("❌ No hay chunks en la BD. Ejecuta primero 'npm run ingest'");
        process.exit(1);
    }

    const ranked: RankedChunk[] = allChunks.map((row) => ({
        content: row.content,
        source_file: row.source_file,
        similarity: cosineSimilarity(queryEmbedding.embedding, JSON.parse(row.embedding)),
    }));

    ranked.sort((a, b) => b.similarity - a.similarity);
    return ranked.slice(0, TOP_K);
}

async function generateAnswer(query: string, chunks: RankedChunk[], ollama: Ollama): Promise<string> {
    const context = chunks.map((c, i) => c.content).join("\n\n");

    const prompt = `Instrucciones: Eres un asistente preciso. Extrae exclusivamente la información solicitada del contexto. 
Si te preguntan un nombre, responde solo el nombre. Si te preguntan una edad, responde solo el número.
No saludes, no des explicaciones ni repitas el texto original.

CONTEXTO:
${context}

PREGUNTA DEL USUARIO: ${query}

RESPUESTA DIRECTA:`;

    console.log("\n🤖 Generando respuesta...\n");

    let fullReply = "";
    const response = await ollama.generate({
        model: MODEL_NAME,
        prompt,
        stream: true,
        options: {
            temperature: 0.1,
        }
    });

    for await (const chunk of response) {
        process.stdout.write(chunk.response);
        fullReply += chunk.response;
    }

    console.log("\n");
    return fullReply;
}

async function main(): Promise<void> {
    console.log("🧙 Spellnet — RAG con Ollama + MySQL");
    console.log("=====================================\n");

    const ollama = new Ollama({ host: "http://localhost:11434" });
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    const ask = (): void => {
        rl.question("💬 Tu pregunta (o 'salir' para terminar): ", async (query) => {
            if (query.toLowerCase() === "salir" || query.toLowerCase() === "exit") {
                console.log("\n👋 ¡Hasta luego!\n");
                rl.close();
                return;
            }

            if (!query.trim()) { ask(); return; }

            try {
                console.log("\n🔍 Buscando información relevante...");
                const relevant = await searchRelevantChunks(query, ollama);

                console.log("\n📄 Chunks relevantes:");
                relevant.forEach((c, i) => {
                    console.log(`\n[${i + 1}] (${c.source_file} | ${(c.similarity * 100).toFixed(2)}%)`);
                    console.log(`"${c.content.substring(0, 150)}${c.content.length > 150 ? "..." : ""}"`);
                });

                await generateAnswer(query, relevant, ollama);

            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : String(err);
                console.error("\n❌ Error:", message);
            }

            console.log("\n" + "─".repeat(60) + "\n");
            ask();
        });
    };

    ask();
}

main().catch((err) => {
    console.error("❌ Error fatal:", err);
    process.exit(1);
});