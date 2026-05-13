import type { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { ApiError } from "../../utils/ApiError.js";
import prisma from "../../lib/prisma.js";

export const createSession = asyncHandler(async(req:Request,res:Response) => {
    const userId = req.user?.userId!;
    const {difficulty,topic} = req.body;
    if(!difficulty || !topic) {
        throw new ApiError(400,'Difficulty and topics are required');
    };
    const newSession = await prisma.session.create({
        data:{
            userId:userId,
            difficulty:difficulty,
            topic:topic
        }
    });
    const sessionDetails = newSession
})

export const getSession = asyncHandler(async(req:Request,res:Response) => {

})

export const getSessionById = asyncHandler(async(req:Request,res:Response) => {

})

export const endSession = asyncHandler(async(req:Request,res:Response) => {

})