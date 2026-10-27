import 'dotenv/config';
import express from "express";
import User from "../../models/user.model";
import Plan from "../../models/plan.model";
import bcrypt from "bcryptjs"
import jwt, { SignOptions } from "jsonwebtoken"
import axios from "axios";
import crypto from "crypto"
const API = process.env.BACKEND_URL || 'http://localhost:3001';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be set to a random value of at least 32 characters');
}
const TOKEN_EXP = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }
    try {
        const user = await User.query().where('email', email).first();
        const match = user ? await bcrypt.compare(password, user.password) : false;
        if (!user || !match) {
            return res.status(401).json({ error: "Usuario o contraseña incorrecta" });
        }
        const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: TOKEN_EXP });
        return res.json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});
router.post('/register', async (req, res) => {
    try {

        let { nameUser, email, password, returnPassword, plan } = req.body;
        if (password !== returnPassword) return res.status(400).json({ error: "Las contraseñas no coinciden" });
        const existingUser = await User.query().where('email', email).first();
        if (existingUser) return res.status(400).json({ error: "El email ya está registrado" });

        let messageLimitPlan: number = 0;
        let fileLimit: number = 0;
        let price: number = 0;

        if (plan.toLowerCase() === 'goblin') {
            plan = 'Goblin';
            messageLimitPlan = 10;
            fileLimit = 5;
            price = 0;
        } else if (plan.toLowerCase() === 'wizard') {
            plan = 'Wizard';
            messageLimitPlan = 30;
            fileLimit = 10;
            price = 20;
        } else if (plan.toLowerCase() === 'elder-dragon') {
            plan = 'Elder_dragon';
            messageLimitPlan = 9999999;
            fileLimit = 9999999;
            price = 50;
        }
        const planData = new Plan();
        planData.name = plan;
        planData.message_limit = messageLimitPlan;
        planData.file_limit = fileLimit;
        planData.price = price;
        await planData.$query().insert();

        const user = new User();
        if (nameUser && email && password) {
            user.name = nameUser;
            user.email = email;
            user.password = await bcrypt.hash(password, 10);
            user.plan_id = planData.plan_id;
            await user.$query().insert();
            const loginRes = await axios.post(`${API}/api/auth/login`, { email, password });
            return res.json({ token: loginRes.data.token });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al registrar el usuario" });
    }

});
router.get('/google', async (req, res) => {
    const url = "https://accounts.google.com/o/oauth2/v2/auth?" +
        new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            redirect_uri: `${process.env.BACKEND_URL}/api/auth/google/callback`,
            response_type: "code",
            scope: "profile email",
            access_type: "offline",
            prompt: "consent"
        });
    res.redirect(url);
})
router.get('/google/callback', async (req, res) => {
    const code = req.query.code;
    const tokenOauth = 'https://oauth2.googleapis.com/token';
    const oauthUserInfo = "https://www.googleapis.com/oauth2/v2/userinfo";
    try{
        const tokenRes = await axios.post(
            tokenOauth,
            {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: `${process.env.BACKEND_URL}/api/auth/google/callback`,
                grant_type: "authorization_code"
            }
        );
        const { access_token } = tokenRes.data;

        const userRes = await axios.get(
            oauthUserInfo, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        );

        const googleUser = userRes.data;

        let user = await User.query().findOne({ email: googleUser.email})
        let token;
        if(!user){
            const plan = new Plan();
            plan.name = 'Goblin'
            plan.message_limit = 10;
            plan.file_limit = 5;
            plan.price = 0;

            await plan.$query().insert();
            const newPassword = crypto.randomBytes(16).toString('hex')
            const password = await bcrypt.hash(newPassword, 10)
            user = await User.query().insert({
                name: googleUser.name,
                email: googleUser.email,
                password,
                plan_id: plan.plan_id
            })
        }
        token = jwt.sign(
            { userId: user.user_id },
            JWT_SECRET,
            { expiresIn: '1h'}
        );

        res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
    }catch(error){
        console.error(error);
    }
});

export default router;
