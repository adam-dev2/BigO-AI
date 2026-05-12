import { Router } from 'express';
import passport from 'passport';
import { githubAuthenticate, githubCallback, googleAuthenticate, googleCallback, login, logout, me, register } from './auth.controllers.js';

const router = Router();

const googleFailureRedirect = () => {
    passport.authenticate('google', {
        failureRedirect: '/login',
    })
}

const githubFailureRedirect = () => {
    passport.authenticate('github', {
        failureRedirect: '/login',
    })
}

router.get('/google', googleAuthenticate);
router.get('/google/callback',googleFailureRedirect,googleCallback);
router.get('/github',githubAuthenticate);
router.get('/github/callback',githubFailureRedirect,githubCallback);
router.post('/sign-in',register);
router.post('/login',login);
router.get('/me',me);
router.post('/logout',logout);

export default router;