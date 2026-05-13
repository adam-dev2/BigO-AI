import { Router, type Request, type Response } from 'express';
import passport from 'passport';
import { githubAuthenticate, githubCallback, googleAuthenticate, googleCallback, login, logout, me, register } from './auth.controllers.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

const FailureRedirect = (provider:string) => {
   return passport.authenticate(provider, {
        failureRedirect: '/login',
        session:false
    })
}


router.get('/google', googleAuthenticate);
router.get('/google/callback',() => {FailureRedirect('google')},googleCallback);
router.get('/github',githubAuthenticate);
router.get('/github/callback',() => {FailureRedirect('github')},githubCallback);
router.post('/register',register);
router.post('/login',login);
router.get('/me',me);
router.post('/logout',logout);
router.post('/test',authMiddleware,(req:Request,res:Response) => {
    return res.status(200).json({
        success:true,
        userId:req.user?.userId
    })
})

export default router;