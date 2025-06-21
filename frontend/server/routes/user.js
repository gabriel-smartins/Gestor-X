import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import {createUser, listUsers, removeUser, fetchUser, modifyUser} from '../controllers/userController.js';


const router = express.Router();

router.post('/add', authMiddleware, createUser);
router.get('/', authMiddleware, listUsers); 
router.get('/:id', authMiddleware, fetchUser);
router.put('/:id', modifyUser);
router.delete('/:id', authMiddleware, removeUser);

export default router;