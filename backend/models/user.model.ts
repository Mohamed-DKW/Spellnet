import { Model } from "objection";
import plan from "./plan.model";
import chat from "./chat.model";
import file from "./file.model";

export default class user extends Model {
    static get tableName() {
        return "user";
    }

    static get idColumn() {
        return "user_id";
    }

    user_id!: number;
    name!: string;
    email!: string;
    password!: string;
    plan_id!: number;

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name", "email", "password", "plan_id"],
            properties: {
                name: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
                plan_id: { type: "integer" },
            },
        };
    }

    static relationMappings = {
        plan: {
            relation: Model.BelongsToOneRelation,
            modelClass: plan,
            join: {
                from: "user.plan_id",
                to: "plan.plan_id",
            },
        },

        chats: {
            relation: Model.HasManyRelation,
            modelClass: chat,
            join: {
                from: "user.user_id",
                to: "chat.user_id",
            },
        },

        files: {
            relation: Model.HasManyRelation,
            modelClass: file,
            join: {
                from: "user.user_id",
                to: "file.user_id",
            },
        },
    };
}