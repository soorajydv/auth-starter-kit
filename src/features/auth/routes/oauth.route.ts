import { Router, Request, Response } from 'express';
import passport from 'passport';
import { FRONTEND_URL } from '../../../configs/env.cofig';
import { generateRefreshToken, generateToken } from '../../../utils/jwt.utils';
const router = Router();

// Google OAuth login
router.get('/google', passport.authenticate('google', 
  { 
    scope: [
      'profile', 
      'email',
      // 'https://www.googleapis.com/auth/user.birthday.read',
      // 'https://www.googleapis.com/auth/user.gender.read',
      // 'https://www.googleapis.com/auth/user.addresses.read',
    ] }));

// Google callback
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/failure' }),
  async (req: Request, res: Response) => {
    console.log("[DEBUG] /google/callback hit");

    const user = req.user as any;

    try {
      console.log("[DEBUG] Received user from passport:", user);

      if (!user) throw new Error("No user returned from Passport");

      if (!user.isVerified) {
        console.log("[DEBUG] User is not verified. Updating...");
        user.isVerified = true;
      }

      const newUser = await user.save();
      console.log("[DEBUG] User saved:", newUser);

      const accessToken = await generateToken(newUser);
      const refreshToken = await generateRefreshToken(newUser);

      console.log("[DEBUG] Tokens generated");

      console.log("[DEBUG] assigned free plans");

      res.cookie('accessToken', accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      console.log("[DEBUG] Cookies set");
      console.log("[DEBUG] Redirecting to:",`${FRONTEND_URL}/oauth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);

      return res.redirect(`${FRONTEND_URL}/oauth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);

    } catch (err: any) {
      console.error("[ERROR] OAuth callback error:", err.message);
      console.error("[STACK TRACE]", err.stack);

      // Optionally, send an alert or write to a persistent log file
      return res.redirect(`${FRONTEND_URL}/signup`);
    }
  }
);

export default router;
