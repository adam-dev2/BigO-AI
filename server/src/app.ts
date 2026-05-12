import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { SESSION_SECRET } from './config/env.js';
import passport from 'passport';
import authRoutes from './modules/auth/auth.routes.js'
import { errorMiddleware } from './middlewares/error.middleware.js';
import { testDB } from './config/db.js';

const app = express();
testDB();

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));
app.use(express.json());
app.use(session({
    secret:SESSION_SECRET!,
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:false,
        httpOnly:true,
        maxAge:1000 * 60 * 60 * 24
    }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/auth',authRoutes);

app.use(errorMiddleware);

export default app;