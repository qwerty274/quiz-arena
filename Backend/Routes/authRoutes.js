import express from 'express';
import { register, login, saveQuizResult, updateName, changePassword, getLeaderboard } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getProfile } from "../controllers/authController.js";


const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// 🔐 Protected routes
router.get('/profile', authMiddleware, getProfile);
router.post('/quiz-result', authMiddleware, saveQuizResult);
router.put('/update-name', authMiddleware, updateName);
router.put('/change-password', authMiddleware, changePassword);

// 📊 Public leaderboard
router.get('/leaderboard', getLeaderboard);

export default router;
