import 'dotenv/config';
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be set to a random value of at least 32 characters');
}

export interface AuthRequest extends Request {
    userId?: number;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: "Invalid authorization header" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId?: number };
        if (typeof decoded.userId !== 'number') return res.status(401).json({ error: "Invalid token payload" });
        req.userId = decoded.userId;
        next();
    }catch(error){
        return res.status(401).json({error: "Token invalido"})
    }
}
