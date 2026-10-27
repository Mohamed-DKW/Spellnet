import express from "express";
import Plan from "../../models/plan.model";
import User from "../../models/user.model";
const router = express.Router();
import { io } from "../server";
import cron from 'node-cron';

function getPlanDataByName(namePlane : string){
    let data : object;
    if (namePlane === 'goblin') {
        data = {
            name: 'Goblin',
            message_limit: 10,
            file_limit: 5,
            price: 0
        };
    } else if (namePlane === 'wizard') {
        data = {
            name: 'Wizard',
            message_limit: 30,
            file_limit: 10,
            price: 20
        };
    } else {
        data = {
            name: 'Elder_dragon',
            message_limit: 9999999,
            file_limit: 9999999,
            price: 50
        };
    }
    return data;
}
router.get('/search/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const plan = await Plan.query().findById(id);
        if (!plan) {
            res.status(404).json({ error: "Plan no encontrado" });
            return;
        }
        if (plan.message_limit > 0) {
            return res.json({ plan });
        } else {
            return res.status(403).json({ error: "Límite de mensajes agotado" });
        }
    } catch (error) {
        console.error('Error al obtener los planes:', error);
        res.status(500).json({ error: 'Error al obtener los planes' });
    }
});
router.post('/change-plain', async (req, res) => {
    const { user_id, name } = req.body
    try {
        const user = await User.query().findById(user_id)
        if (user) {
            const plan = await Plan.query().findById(user.plan_id) as Plan;
            const namePlane = name.toLowerCase();
            const data = getPlanDataByName(namePlane);
            await plan.$query().patch(data)
        }
    } catch (error) {
        console.error(error)
    }
    return res.json({ message: 'Plan actualizado' })
});
router.patch('/message/:id', async (req, res) => {
    const id = req.params.id;
    const { user_id } = req.body;
    try {
        const plan = await Plan.query().findById(id) as Plan;
        if (!plan) return res.status(404).json({ error: "Plan no encontrado" });

        plan.message_limit -= 1;
        await plan.$query().patch({ message_limit: plan.message_limit });

        // Notificar solo al usuario que envió el mensaje
        if (plan.message_limit <= 0 && user_id) {
            io.to(`user-${user_id}`).emit("plan-limit-reached", {
                message: "Se acabaron los intentos"
            });
        }

        res.json({ message: 'Límite actualizado', message_limit: plan.message_limit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error actualizando el plan' });
    }
});
cron.schedule('0 0 * * *', async () => {
    try{
        const users = await User.query();
        for(let user of users){
            const plan = await Plan.query().findById(user.plan_id) as Plan

            const data = getPlanDataByName(plan.name.toLowerCase());

            await plan.$query().patch(data);
        }
    }catch(error){
        console.error(error)
    }
}, {
    timezone: "Europe/Madrid"
})


export default router;