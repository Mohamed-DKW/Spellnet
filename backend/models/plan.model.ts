import { Model } from "objection";
import User from "./user.model";

export default class plan extends Model {
    static get tableName() {
        return "plan";
    }

    static get idColumn() {
        return "plan_id";
    }

    plan_id!: number;
    name!: string;
    message_limit!: number;
    file_limit!: number;
    price!: number;

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name", "message_limit", "file_limit", "price"],
            properties: {
                name: { type: "string" },
                message_limit: { type: "integer" },
                file_limit: { type: "integer" },
                price: { type: "number" },
            },
        };
    }

    static relationMappings = {
        users: {
            relation: Model.HasManyRelation,
            modelClass: User,
            join: {
                from: "plan.plan_id",
                to: "user.plan_id",
            },
        },
    };
}