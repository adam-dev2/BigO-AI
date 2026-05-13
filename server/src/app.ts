import express, { type Request, type Response } from 'express';
import cors from 'cors';
import passport from 'passport';
import authRoutes from './modules/auth/auth.routes.js'
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));

app.get('/',(req:Request,res:Response) => {
    return res.status(200).json({
        success:true,
        message:"Server is healthy"
    })
})

app.use(express.json());
app.use(passport.initialize());
app.use('/api/auth',authRoutes);

app.use(errorMiddleware);

export default app;