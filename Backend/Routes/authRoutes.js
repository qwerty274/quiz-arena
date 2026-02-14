import express from 'express';
import { register, login } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getProfile } from "../controllers/authController.js";


const router = express.Router();

router.post('/register', register);
router.post('/login', login);


// 🔐 Protected profile route
router.get('/profile', authMiddleware, getProfile);

export default router;
