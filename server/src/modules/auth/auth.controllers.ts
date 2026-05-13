import type { NextFunction, Request, Response } from "express"
import passport from "passport"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import pool from "../../config/db.js"
import { logger } from "../../lib/logger.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { isProduction, JWT_SECRET } from "../../config/env.js"
import prisma from '../../lib/prisma.js';

interface ICookieOptions {
    httpOnly:boolean,
    secure:boolean,
    sameSite:'none' | 'lax' | 'strict' | boolean,
    maxAge:number
}

const CookieOptions:ICookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7
}

export const googleAuthenticate = () => {
     passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
}

export const githubAuthenticate = () => {
     passport.authenticate('github', {
        scope: ['user:email'],
    })
}

export const googleCallback = (req:Request, res:Response) => {
    res.redirect('http://localhost:5173');
}

export const githubCallback = (req:Request, res:Response) => {
    res.redirect('http://localhost:5173');
}

export const register = asyncHandler(async (req, res) => {
    const {username,email,password} = req.body;
    if(!email || !password || !username) {
        throw new ApiError(400,'All fields are required');
    }

    const findUser = await prisma?.user.findUnique({
        where:{
            email
        }
    });
    if(findUser) {
        throw new ApiError(400,'Email already exists');
    }
    try {
        const password_hash = await bcrypt.hash(password,10);
        const createUser = await prisma?.user.create({
            data:{
                username:username,
                email:email,
                passwordHash:password_hash
            }
        })
        const userDetails = {
            userId:createUser.id,
            username:createUser?.username,
            email:createUser?.email
        }
        return res.status(201).json({
            successs:true,
            user:userDetails
        })
    }catch(err) {
        logger.error(err as string)
        throw new ApiError(500,'Internal Server error')
    }
    
})

export const login = asyncHandler(async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password) {
        throw new ApiError(400,'creds are required');
    }
    const findUser = await prisma.user.findUnique({
        where:{
            email:email
        }
    })
    if (!findUser) {
        throw new ApiError(401,'Invalid Creds');
    }
    const verifyPass = await bcrypt.compare(password,findUser.passwordHash);
    if(!verifyPass) {
        throw new ApiError(401,'Invalid Creds');
    }
    const tokenContent = {
        userId:findUser.id,
        email:findUser.email,
        username:findUser.username
    }
    const token = jwt.sign(tokenContent,JWT_SECRET!,{
        expiresIn:'7d'
    }); 
    res.cookie('token',token,CookieOptions)
    return res.status(200).json({
        success:true,
        user:tokenContent.username,
        token
    })
})

export const logout = asyncHandler(async(req:Request,res:Response) => {
    res.clearCookie('token',CookieOptions);
    return res.status(200).json({
        success:true
    })
})

export const me = (req:Request, res:Response) => {
  res.json(req.user);
}