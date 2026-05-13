import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { createSession, endSession, getSession, getSessionById } from './session.controller.js';

const router = express.Router();

router.use(authMiddleware);
router.post('/session',createSession);
router.get('/session',getSession);
router.get('/session/:id',getSessionById);
router.patch('/session/:id',endSession);

export default router;