import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import prisma from "../../lib/prisma.js";
import { PLAN_LIMITS } from "../../config/env.js";

export const createSession = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId!;
    const { difficulty, topic } = req.body;
    if (!difficulty || !topic) {
      throw new ApiError(400, "Difficulty and topics are required");
    }

    const user = await prisma.session.findUnique({
      where: {
        id: userId,
      },
    });
    const limit = PLAN_LIMITS[user?.planAtTime!].sessionsPerDay;
    const today = new Date();
    today.setHours(0,0,0,0);
    const usage = await prisma.usageTracking.upsert({
        where:{
            userId_date:{
                userId:userId,
                date:today
            }
        },
        update:{},
        create:{
            userId:userId,
            date:today,
            sessionsCount:0
        }
    });

    if(usage.sessionsCount >= limit) {
        throw new ApiError(429,`Daily limit of ${limit} sessions reached`);
    }
    const [newSession] = await prisma.$transaction([
        prisma.session.create({
            data:{userId,difficulty,topic}
        }),
        prisma.usageTracking.update({
            where:{userId_date:{userId,date:today}},
            data:{sessionsCount:{increment:1}}
        })
    ])
    return res.status(201).json({
      success: true,
      session: {
          sessionId: newSession.id,
          status: newSession.status
      },
    });
  },
);

export const getSession = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId!;
  const getAllSessions = await prisma.session.findMany({
    where: {
      userId: userId,
    },
  });
  const parsedSessionDetails = getAllSessions.map((session) => ({
    audioUrl: session.audioUrl,
    createdAt: session.createdAt,
    difficulty: session.difficulty,
    durationSeconds: session.durationSeconds,
    endedAt: session.endedAt,
    problemTitle: session.problemTitle,
    startedAt: session.startedAt,
    topic: session.topic,
  }));
  return res.status(200).json({
    success: true,
    total: parsedSessionDetails.length,
    sessions: parsedSessionDetails,
  });
});

export const getSessionById = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId!;
    const sessionId = req.params.id as string;
    if (!sessionId) {
      throw new ApiError(400, "Session ID missing");
    }
    const getSession = await prisma.session.findFirst({
      where: {
        userId: userId,
        id: sessionId,
      },
    });
    if (!getSession) {
      throw new ApiError(404, "Session with this id not found");
    }
    const parseSessionDetails = {
      audioUrl: getSession.audioUrl,
      createdAt: getSession.createdAt,
      difficulty: getSession.difficulty,
      durationSeconds: getSession.durationSeconds,
      endedAt: getSession.endedAt,
      problemTitle: getSession.problemTitle,
      startedAt: getSession.startedAt,
      topic: getSession.topic,
    };
    return res.status(200).json({
      success: true,
      session: parseSessionDetails,
    });
  },
);

export const endSession = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId!;
  const sessionId = req.params.id as string;
  const findSession = await prisma.session.findFirst({
    where: {
      id: sessionId,
      userId: userId,
    },
  });
  if (!findSession) {
    throw new ApiError(400, "no session found witht that id");
  }
  const sessionStartedAt = findSession.startedAt!;
  const durationSeconds = sessionStartedAt
    ? Math.floor((Date.now() - new Date(sessionStartedAt).getTime()) / 1000)
    : 0;
  const updateSession = await prisma.session.update({
    where: {
      id: sessionId,
      userId: userId,
    },
    data: {
      status: "completed",
      durationSeconds: durationSeconds,
      endedAt: new Date(),
    },
  });
  return res.status(200).json({
    success: true,
    durationSeconds: updateSession.durationSeconds,
    endedAt: updateSession.endedAt,
  });
});
