import { Model } from "objection";
import chat from "./chat.model";

export default class response_ia extends Model {
    static get tableName() {
        return "response_ia";
    }

    static get idColumn() {
        return "response_id";
    }

    response_id!: number;
    reply!: string;
    date!: Date;
    chat_id!: number;

    static get jsonSchema() {
        return {
            type: "object",
            required: ["reply", "chat_id"],
            properties: {
                reply: { type: "string" },
                date: { type: "string" },
                chat_id: { type: "integer" },
            },
        };
    }

    static relationMappings = {
        chat: {
            relation: Model.BelongsToOneRelation,
            modelClass: chat,
            join: {
                from: "response_ia.chat_id",
                to: "chat.chat_id",
            },
        },
    };
}