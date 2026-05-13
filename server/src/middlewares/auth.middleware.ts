import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { JWT_SECRET } from '../config/env.js';
import { logger } from '../lib/logger.js';

interface User {
    userId:string,
    email:string,
    username:string
}

export const authMiddleware = async (req:Request,res:Response,next:NextFunction) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        throw new ApiError(403,'Invalid token');
    }
    
    const token = authHeader.split('Bearer ')[1];
    if(!token) {
        throw new ApiError(403,'Invalid token');
    }
    try {
        const decoded = jwt.verify(token,JWT_SECRET!);
        if(!decoded) {
            throw new ApiError(403,'Invalid token');
        }
        logger.info(decoded as string)
        req.user = decoded as User
        next();
    }catch(err:any) {
        throw new ApiError(403,'Invalid token')
    }
}