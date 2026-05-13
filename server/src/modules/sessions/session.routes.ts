import express from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { createSession, endSession, getSession, getSessionById } from './session.controller.js';

const router = express.Router();

router.use(authMiddleware);
router.post('/sessions',createSession);
router.get('/sessions',getSession);
router.get('/sessions/:id',getSessionById);
router.patch('/sessions/:id',endSession);

export default router;