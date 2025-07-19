import type { Request, Response, NextFunction } from "express"
import User, { IUser } from "../features/user/models/user.model"
import { sendBadRequest, sendForbidden, sendNotFound } from "../utils/responseUtil"
import { verifyToken } from "../utils/jwt.utils"

export interface AuthRequest extends Request {
  user?: Partial<IUser>
}

// Authenticate user with JWT
export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers?.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendBadRequest(res, "Token not provided");
  }

  const token = authHeader.split(" ")[1];

  // Reject invalid token values
  if (!token || token === "null" || token === "undefined") {
    return sendBadRequest(res, "Token not provided");
  }

  try {
    const decoded = await verifyToken(token) as any;
    if (!decoded) return sendBadRequest(res, "Token could not be verified");

    const user = await User.findById(decoded.user._id);
    if (!user) return sendNotFound(res, "User not found");

    if (!user.isVerified) {
      return sendBadRequest(res, "User not verified, please verify your email first");
    }

    req.user = user;

    next();
  } catch (err) {
    console.error("JWT Error:", err);
    return sendBadRequest(res, "Invalid or malformed token");
  }
};

// Authorize roles
export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role as string)) {
      return sendForbidden(res, "Not authorized to access this route")
    }
    next()
  }
}

// Authorize admin access
export const authorizeAdmin:any = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") {
    return sendForbidden(res, "Not authorized to access this route")
  }
  next()
}