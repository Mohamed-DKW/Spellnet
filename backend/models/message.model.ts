import { Model } from "objection";
import chat from "./chat.model";
import file from "./file.model";

export default class message extends Model {
    static get tableName() {
        return "message";
    }

    static get idColumn() {
        return "message_id";
    }

    message_id!: number;
    content!: string;
    date!: Date;
    chat_id!: number;
    user_id!: number;
    plan_id!: number;

    $beforeInsert() {
        this.date = new Date();
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["content", "chat_id", "user_id", "plan_id"],
            properties: {
                content: { type: "string" },
                chat_id: { type: "integer" },
                user_id: { type: "integer" },
                plan_id: { type: "integer" },
            },
        };
    }

    static relationMappings = {
        chat: {
            relation: Model.BelongsToOneRelation,
            modelClass: chat,
            join: {
                from: "message.chat_id",
                to: "chat.chat_id",
            },
        },
        files: {
            relation: Model.HasManyRelation,
            modelClass: file,
            join: {
                from: "message.message_id",
                to: "file.message_id",
            },
        },
    };
}