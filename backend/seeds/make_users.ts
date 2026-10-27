import { Knex } from "knex";

import User from '../models/user.model';
import Plan from "../models/plan.model";
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    Plan.knex(knex);
    User.knex(knex);

    await User.query().delete();
    await Plan.query().delete();

    const p = new Plan();

    p.name = "Goblin";

    p.message_limit = 10;

    p.file_limit = 0;

    p.price = 0;

    await p.$query().insert();

    const u = new User();

    u.name = "Pepito"

    u.email = "hola@gmail.com"

    u.password = await bcrypt.hash('password', 10);
    
    u.plan_id = p.plan_id;


    await u.$query().insert();
};
