import dotenv from 'dotenv';

dotenv.config();

export const DATABASE_URL=process.env.DATABASE_URL;
export const PORT=process.env.PORT;
export const isProduction = process.env.NODE_ENV === 'production';
export const SESSION_SECRET=process.env.SESSION_SECRET;

export const GITHUB_CLIENT_ID=process.env.GITHUB_CLIENT_ID
export const GITHUB_CLIENT_SECRET=process.env.GITHUB_CLIENT_SECRET
export const GITHUB_CALLBACK_URL=process.env.GITHUB_CALLBACK_URL

export const GOOGLE_CLIENT_ID=process.env.GOOGLE_CLIENT_ID
export const GOOGLE_CLIENT_SECRET=process.env.GOOGLE_CLIENT_SECRET
export const GOOGLE_CALLBACK_URL=process.env.GOOGLE_CALLBACK_URL

export const JWT_SECRET = process.env.JWT_SECRET 