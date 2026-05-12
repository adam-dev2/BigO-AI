import type { NextFunction, Request, Response } from "express"
import passport from "passport"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js"
import pool from "../../config/db.js"
import { logger } from "../../lib/logger.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { isProduction, JWT_SECRET } from "../../config/env.js"

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

    try {
        const findUser = await pool.query('SELECT * FROM users WHERE email = $1',[email]);
        if(findUser.rowCount === 0) {
            throw new ApiError(400,'Email already exists');
        }
        const password_hash = await bcrypt.hash(password,10);

        const createUser = (await pool.query('INSERT INTO users (username, email, password_hash) VALUES($1,$2,$3)',[username,email,password_hash]));
        const userDetails = {
            username:createUser.rows[0].username,
            email:createUser.rows[0].email
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
    const findUser = await pool.query('SELECT * FROM users WHERE email = $1',[email]);
    if (findUser.rowCount === 0) {
        throw new ApiError(401,'Invalid Creds');
    }
    const verifyPass = await bcrypt.compare(password,findUser.rows[0].password_hash);
    if(!verifyPass) {
        throw new ApiError(401,'Invalid Creds');
    }
    const userDetails = {
        username:findUser.rows[0].username,
        email:findUser.rows[0].email
    }
    const tokenContent = {
        email:userDetails.email,
        username:userDetails.username
    }
    const token = jwt.sign(tokenContent,JWT_SECRET!,{
        expiresIn:'7d'
    }); 
    res.cookie('token',token,{
        httpOnly: true,
        secure: isProduction,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7
    })
    return res.status(200).json({
        success:true,
        user:userDetails
    })
})

export const logout = (req:Request, res:Response,next:NextFunction) => {
  req.logout((err:any) => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({
        message: 'Logged out',
      });
    });
  });
}

export const me = (req:Request, res:Response) => {
  res.json(req.user);
}