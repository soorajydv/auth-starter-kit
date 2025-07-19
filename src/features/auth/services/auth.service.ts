import { sendEmail, sendEmailVerification } from "../../../helpers/email.helper"
import Profile from "../../profile/models/profile.model"
import crypto from "crypto"
import User from "../../user/models/user.model"
import { FRONTEND_URL } from "../../../configs/env.cofig"
import { generateRefreshToken, generateToken } from "../../../utils/jwt.utils"

class AuthService {
    async register(body: any) {
        const { email, role } = body

        const existingUser = await User.findOne({ email })
        if (existingUser) return { success: false, message: "Email already in use" }

        const user = await User.create({ ...body, role })

        const accessToken = await generateToken(user);

        return { success: true, data: { user, accessToken } }
    }

    async login(body: any) {
        const { email, password } = body

        const user = await User.findOne({ email }).select("+password +apiKey")
        if (!user) return { success: false, message: "User of this email doesn't exist" } 

        if (user.password) {
            const isPasswordCorrect = await user.comparePassword(password)
            if (!isPasswordCorrect) return { success: false, message: "Invalid password" }
        }

        if(!user.isVerified) return { success:false, message:"User not verified. Please verify your email first" }
        
        const accessToken = await generateToken(user);
        const refreshToken = await generateRefreshToken(user);
        user.refreshToken = refreshToken
        await user.save()

        return { success: true, data: { user, accessToken, refreshToken }}
    }

    async getCurrentUser(userId: string) {
        const user = await User.findById(userId).select("+apiKey")
        if (!user) return { success: false, message: "User not found" }
        
        const profile = await Profile.findOne({ user: userId })

        return { success: true, data: { user, profile: profile ? profile: null } }
    }

    async verifyEmail(verificationToken: string) {
        const user = await User.findOne({ verificationToken });
      
        if (!user) return { success: false, message: "Invalid or expired verificationToken" };
      
        if (user.isVerified) return { success: false, message: "Email is already verified" };
      
        if (!user.verificationTokenExpires || user.verificationTokenExpires.getTime() < Date.now()) 
            return { success: false, message: "Verification token has expired" };
      
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();
      
        return { success: true, message: "Email verified successfully" };
      }      

    async resendEmailVerification(email: string) {
        const user = await User.findOne({ email });
        if (!user) return { success: false, message: "Email not found" };

        if (user.isVerified) return { success: false, message: "Email is already verified" };

        const { verificationToken, verificationTokenExpires } = await sendEmailVerification(email);
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = verificationTokenExpires as any;
        await user.save();
        return { success: true, message: "Verification email resent" };
    }

    async forgotPassword(email: string) {
        
        const user = await User.findOne({ email });
        if (!user) return { success: false, message: "Email not found" };

        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = new Date(Date.now() + 3600000); // 1 hour
        const resetPasswordUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
        const data = {
            subject: "Reset Your Password",
            html: `<p style="font-family: Arial, sans-serif; font-size: 16px; color: #333333; line-height: 1.5;">
                    To reset your password, click the link below:<br>
                    <a href="${resetPasswordUrl}" style="color: #007BFF; text-decoration: none;">
                        Reset Password
                    </a>
                   </p>`
        }
        console.log("reset PasswordUrl", resetPasswordUrl);
        
        await sendEmail(email, data);
        await user.save();

        return { success: true, message: "Password reset email sent" };
    }

    async resetPassword(token: string, newPassword: string) {
        const user = await User.findOne({resetPasswordToken: token, resetPasswordExpiresAt: { $gt: new Date() }});

        if (!user) {
            return { success: false, message: "Invalid or expired token" };
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        return { success: true, message: "Password reset successful" };
    }

    async refreshToken(refreshToken: string) {
        const user = await User.findOne({ refreshToken });

        if (!user) return { success: false, message: 'Invalid refresh token' };
        
        const token = await generateToken(user)
        const newRefreshToken = await generateRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();

        return { success: true, token, refreshToken: newRefreshToken };
    }

    async newToken(refreshToken: string) {
        const user = await User.findOne({ refreshToken });
        if (!user) return { success: false, message: "Invalid refresh token" };

        const newAccessToken = generateToken(user);
        return { success: true, data: { token: newAccessToken }};
    }

    async logout(refreshToken: string) {
        const user = await User.findOne({ refreshToken });
        if (!user) return { success: false, message: "User not found" };

        user.refreshToken = undefined;
        await user.save();

        return { success: true, message: "Logged out successfully" };
    }
}

export default new AuthService()
