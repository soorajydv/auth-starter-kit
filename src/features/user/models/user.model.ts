import mongoose, { type Document, Schema } from 'mongoose';
import { softDeletePlugin } from '../../../configs/database';
import { applyUserHooks, applyUserMethods, applyUserTransforms } from '../utils/user.util';
import { USER_ROLES, UserRole } from '../../../constants/constants';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password?: string;
  newEmail?: string;
  isOauth?: boolean;
  oauthProvider: string;
  oauthId: string;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
  refreshToken?: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  deletedAt?: Date;
  fcmToken?: string;
  OTP?: string;
  OTPExpiresAt?: Date;
  resetPasswordExpiresAt?: Date;
  profile?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  softDelete(): Boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  generateRefreshToken(): string;
  generateApiKey(): string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, unique: true, trim: true },
    password: { type: String, minlength: 6, select: false },
    role: { type: String, enum: Object.values(USER_ROLES), default: USER_ROLES.BUYER },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    OTP: { type: String },
    OTPExpiresAt: { type: Date },
    newEmail: { type: String },
    isOauth: { type: Boolean, default: false },
    oauthProvider: String,
    oauthId: String,
    verificationToken: { type: String },
    verificationTokenExpires: Date,
    resetPasswordExpiresAt: Date,
    resetPasswordToken: { type: String },
    refreshToken: { type: String },
    fcmToken: { type: String },
    deletedAt: { type: Date },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  },
  { timestamps: true }
);

// Apply hooks, methods, and transformations
applyUserHooks(UserSchema);
applyUserMethods(UserSchema);
applyUserTransforms(UserSchema);

// Apply plugin
UserSchema.plugin(softDeletePlugin);

// Indexes for better search performance
UserSchema.index({ role: 1 });

const User = mongoose.model<IUser>('User', UserSchema);
export default User;