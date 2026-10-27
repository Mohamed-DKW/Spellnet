import { Model } from "objection";

export default class DocumentChunk extends Model {
    static get tableName() {
        return "document_chunk";
    }

    static get idColumn() {
        return "chunk_id";
    }

    chunk_id!: number;
    doc_id!: string;
    content!: string;
    embedding!: string;
    source_file!: string;
    created_at!: Date;

    static get jsonSchema() {
        return {
            type: "object",
            required: ["doc_id", "content", "embedding", "source_file"],
            properties: {
                doc_id: { type: "string" },
                content: { type: "string" },
                embedding: { type: "string" },
                source_file: { type: "string" },
            },
        };
    }
}