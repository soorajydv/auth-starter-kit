import express from "express"
import { register, login, verifyEmail, forgotPassword, resendVerificationEmail, resetPassword, refreshToken, logout } from "../controllers/auth.controller"
import { validate } from "../../../middleware/validate"
import { emailValidator, loginValidator, refreshTokenValidator, signupValidator } from "../validators/auth.validator"
import { resetPasswordValidator } from "../validators/password.validator"
import oauthRoutes from "./oauth.route"

const router = express.Router()

router.post("/register",validate(signupValidator), register)
router.post("/login",validate(loginValidator),login)
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', validate(emailValidator),forgotPassword);
router.post('/reset-password', validate(resetPasswordValidator), resetPassword);
router.post('/refresh-token', validate(refreshTokenValidator), refreshToken);
router.post('/resend-email-verification', validate(emailValidator), resendVerificationEmail);
router.post("/logout", logout)
router.use("/",oauthRoutes);

export default router
