import express from 'express';
import {
  register,
  login,
  saveQuizResult,
  updateName,
  changePassword,
  getLeaderboard,
  getProfile,
  updateProfile,
  getQuizQuestions,
} from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/quiz-questions', getQuizQuestions);

router.get('/profile', authMiddleware, getProfile);
router.post('/quiz-result', authMiddleware, saveQuizResult);
router.put('/update-name', authMiddleware, updateName);
router.put('/change-password', authMiddleware, changePassword);
router.put('/update-profile', authMiddleware, updateProfile);

router.get('/leaderboard', getLeaderboard);

export default router;
