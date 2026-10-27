import { Model } from "objection";
import user from "./user.model";
import message from "./message.model";
import response_ia from "./response_ia.model";

export default class chat extends Model {
    static get tableName() {
        return "chat";
    }

    static get idColumn() {
        return "chat_id";
    }

    chat_id!: number;
    Name!: string; 
    user_id!: number;

    static get jsonSchema() {
        return {
            type: "object",
            required: ["Name", "user_id"],
            properties: {
                Name: { type: "string" },
                user_id: { type: "integer" },
            },
        };
    }

    static relationMappings = {
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: user,
            join: {
                from: "chat.user_id",
                to: "user.user_id",
            },
        },

        messages: {
            relation: Model.HasManyRelation,
            modelClass: message,
            join: {
                from: "chat.chat_id",
                to: "message.chat_id",
            },
        },

        responsesIA: {
            relation: Model.HasManyRelation,
            modelClass: response_ia,
            join: {
                from: "chat.chat_id",
                to: "response_ia.chat_id",
            },
        },
    };
}