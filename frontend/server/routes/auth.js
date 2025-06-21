import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import { authenticateUser, confirmUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authenticateUser );
router.get('/verify',authMiddleware, confirmUser)

export default router
