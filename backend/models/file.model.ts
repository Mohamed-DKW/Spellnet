import { Model } from "objection";
import user from "./user.model";
import message from "./message.model";

export default class file extends Model {
    static get tableName() {
        return "file";
    }

    static get idColumn() {
        return "file_id";
    }

    file_id!: number;
    name!: string;
    path!: string;
    user_id!: number;
    message_id!: number;
    plan_id!: number;
    content?: string;   // ← propiedad añadida

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name", "path", "user_id", "message_id", "plan_id"],
            properties: {
                name: { type: "string" },
                path: { type: "string" },
                user_id: { type: "integer" },
                message_id: { type: "integer" },
                plan_id: { type: "integer" },
                content: { type: "string" },
            },
        };
    }

    static relationMappings = {
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: user,
            join: {
                from: "file.user_id",
                to: "user.user_id",
            },
        },
        message: {
            relation: Model.BelongsToOneRelation,
            modelClass: message,
            join: {
                from: "file.message_id",
                to: "message.message_id",
            },
        },
    };
}