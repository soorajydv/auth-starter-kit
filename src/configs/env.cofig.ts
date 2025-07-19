import dotenv from "dotenv"
import path from "path"

// Determine which .env file to load
const envFile = path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`)
dotenv.config({ path: envFile })

export const BASE_PATH = process.env.BASE_PATH as string
export const FRONTEND_URL = process.env.FRONTEND_URL as string
export const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL as string
export const JWT_SECRET = process.env.JWT_SECRET as string
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string
export const MONGODB_URI = process.env.MONGODB_URI as string
export const NODE_ENV = process.env.NODE_ENV as string
export const PORT = process.env.PORT || 5000
export const SMS_API_KEY = process.env.SMS_API_KEY as string
export const EMAIL_FROM = process.env.EMAIL_FROM;

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN as string

export const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL as string
export const PUBLIC_DIR = process.env.PUBLIC_DIR as string
export const DEFAULT_API_LIMIT = process.env.DEFAULT_API_LIMIT as string