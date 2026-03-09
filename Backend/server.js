import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './Routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = 4000;

// Middleware
app.use(cors({
  origin: 'https://quiz-arena-eta.vercel.app/', 
}));
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('API Running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
