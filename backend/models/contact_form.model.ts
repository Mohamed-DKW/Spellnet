import { Model } from "objection";

export default class contact_form extends Model {
    static get tableName() {
        return "contact_form";
    }

    static get idColumn() {
        return "contact_form_id";
    }

    contact_form_id!: number;
    name!: string;
    subject!: string;
    email!: string;
    message!: string;
    date!: Date;

    $beforeInsert() {
        this.date = new Date();
    }

    static get jsonSchema() {
        return {
            type: "object",
            required: ["name", "subject", "email", "message"],
            properties: {
                name: { type: "string" },
                subject: { type: "string" },
                email: { type: "string" },
                message: { type: "string" },
            },
        };
    }
}
