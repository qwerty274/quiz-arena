import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import authRoutes from './Routes/authRoutes.js';
import { initSocket } from './services/socketService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Initialize Sockets
initSocket(io);

// API Routes
app.use('/api/auth', authRoutes);

// Static Files (Serve Frontend)
const frontendPath = path.join(__dirname, '../Frontend/dist');
app.use(express.static(frontendPath));

// Fallback for SPA - use middleware instead of app.get('*') to avoid path-to-regexp issues
app.use((req, res, next) => {
  // If it's an API route that wasn't found, don't serve index.html
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API Route Not Found' });
  }
  
  // For all other routes, serve the frontend index.html
  // Only for GET requests
  if (req.method === 'GET') {
    return res.sendFile(path.join(frontendPath, 'index.html'));
  }
  
  next();
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
