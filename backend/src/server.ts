import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route';
import chatRoutes from './routes/chat.route';
import userRoutes from './routes/user.route';
import contactFormRoutes from './routes/contactForm.route';
import planRoutes from './routes/plan.route';
import statsRoutes from './routes/stats.route';
import paymentRoutes from './routes/payment.route';
import messageRoutes from './routes/message.route';
import fileRoutes from './routes/file.route';
import { Server } from "socket.io";
import { createServer } from "node:http";

import uploadRoutes from './routes/upload.route';
import './db';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 🔥 CORS abierto para desarrollo (permite cualquier origen)
const corsOptions = {
  origin: true,               // refleja el origen de la solicitud
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const server = createServer(app);
export const io = new Server(server, {
  cors: corsOptions
});

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado:", socket.id);
  socket.on("join-user", (userId) => {
    socket.join(`user-${userId}`);
    console.log(`Socket ${socket.id} unido a user-${userId}`);
  });
  socket.on("join-chat", (chatId) => {
    socket.join(`chat-${chatId}`);
    console.log(`Socket ${socket.id} unido a chat-${chatId}`);
  });
  socket.on("disconnect", () => {
    console.log("Usuario desconectado:", socket.id);
  });
});

app.set('io', io);

// ── Middleware CORS para Express ──
app.use(cors(corsOptions));
app.use(express.json());

// ── Rutas ──
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Spellnet API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    message: '¡Backend funcionando!',
    endpoints: ['/api/health', '/api/test']
  });
});

app.use('/api', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactFormRoutes);
app.use('/api/plan', planRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/file', fileRoutes);

server.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});