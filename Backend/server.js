import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import authRoutes from './Routes/authRoutes.js';
import { initSocket } from './services/socketService.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Initialize Sockets
initSocket(io);

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API Running');
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} (Accessible on local network)`);
});
