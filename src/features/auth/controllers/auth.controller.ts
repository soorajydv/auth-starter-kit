import { sendEmailVerification } from '../../../helpers/email.helper';
import type { NextFunction, Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { sendSuccess, sendBadRequest } from "../../../utils/responseUtil"
import AuthService from "../services/auth.service"
import { AuthRequest } from "../../../middleware/auth"
import { getUserByEmail } from '../../user/services/user.service';
import { FRONTEND_URL } from '../../../configs/env.cofig';

export const register = asyncHandler(async (req: Request, res: Response) => {
  let verificationToken: string;
  let verificationTokenExpires: number;

  const user = await getUserByEmail(req.body.email);
  if (user) return sendBadRequest(res, "User of this email already exists");

  try {
    const result = await sendEmailVerification(req.body.email);
    verificationToken = result.verificationToken;
    verificationTokenExpires = result.verificationTokenExpires;
  } catch (error: any) {
    return sendBadRequest(res, "Failed to send verification email", error.message);
  }

  req.body.verificationToken = verificationToken;
  req.body.verificationTokenExpires = verificationTokenExpires;

  const result = await AuthService.register(req.body);

  if (!result.success) {
    return sendBadRequest(res, result.message);
  }

  return sendSuccess(res, "User registered successfully", result.data);
});

export const login = asyncHandler(async (req: Request, res: Response) => {

  const result = await AuthService.login(req.body)

  if (!result.success) {
    return sendBadRequest(res, result.message)
  }

  res.cookie('accessToken', result.data?.accessToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/',
  });

  res.cookie('refreshToken', result.data?.refreshToken, {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  path: '/',
});

  return sendSuccess(res, "Login successful", result.data)
})

export const verifyEmail = async (req: AuthRequest, res: Response) => {
  const token = req.params.token;
  if (!token) return sendBadRequest(res, "Token not provided")

  const { success, message } = await AuthService.verifyEmail(token);

  if (!success) {
    return sendBadRequest(res, `${message}`);
  }

  return res.redirect(`${FRONTEND_URL}/signup?verify=success`)
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return sendBadRequest(res, "Refresh token is required");

  const result = await AuthService.refreshToken(refreshToken);

  if (!result.success) {
    return sendBadRequest(res, result.message);
  }

  return sendSuccess(res, 'Token refreshed successfully', {
    token: result.token,
    refreshToken: result.refreshToken,
  });
};

export const forgotPassword = async (req: Request, res: Response) => {

  const { email } = req.body;
  if (!email) return sendBadRequest(res, "Email is required");

  const result = await AuthService.forgotPassword(email);

  if (!result.success) {
    return sendBadRequest(res, result.message);
  }

  return sendSuccess(res, result.message);
};

export const resetPassword = async (req: Request, res: Response) => {

  const { token, newPassword, confirmNewPassword } = req.body;
  if (newPassword !== confirmNewPassword) return sendBadRequest(res, "Passwords do not match");

  const result = await AuthService.resetPassword(token, newPassword);

  if (!result.success) return sendBadRequest(res, result.message);

  return sendSuccess(res, `${result.message}`);
};

export const resendVerificationEmail = async (req: Request, res: Response) => {

  const { email } = req.body;
  if (!email) return sendBadRequest(res, "Email is required");

  const result = await AuthService.resendEmailVerification(email);

  if (!result.success) {
    return sendBadRequest(res, result.message);
  }

  return sendSuccess(res, 'Verification email resent');
};

export const newToken = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AuthService.newToken(id);
  if (!result.success) {
    return sendBadRequest(res, result.message);
  }
  return sendSuccess(res, "Generated new token", result.data?.token);
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  const { refreshToken } = req.body;
  try {
    if (refreshToken) await AuthService.logout(refreshToken);

    res.clearCookie('accessToken', { httpOnly: true, secure: true });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });

    // Destroy session (OAuth users)
    req.logout((err) => {
      if (err) return next(err);
      req.session?.destroy(() => {
        res.status(200).json({ message: 'Logged out successfully' });
      });
    });
  } catch (err) {
    next(err);
  }
};