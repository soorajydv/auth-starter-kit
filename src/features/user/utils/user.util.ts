
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../models/user.model';

export const applyUserHooks = async(schema: Schema<IUser>) => {
    // Password hashing
    schema.pre('save', async function (next) {
        if (!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password as string, salt);
        next();
    });
};


export const applyUserMethods = (schema: Schema<IUser>) => {
    // Compare password
    schema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
        return await bcrypt.compare(candidatePassword, this.password);
    };

    // Soft delete method
    schema.methods.softDelete = async function (): Promise<boolean> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            this.deletedAt = new Date();
            this.email = `${this.email}+${this.deletedAt.toISOString()}`;
            await this.save({ session });

            await mongoose.model('Profile').updateOne(
                { user: this._id },
                { deletedAt: this.deletedAt },
                { session }
            );

            await mongoose.model('UserSubscription').updateMany(
                { user: this._id },
                { deletedAt: this.deletedAt },
                { session }
            );

            await mongoose.model('ApiKey').deleteOne(
                { user: this._id },
                { session }
            );

            await session.commitTransaction();
            return true;
        } catch (error: any) {
            await session.abortTransaction();
            console.error(`Soft delete failed: ${error.message}`);
            return false;
        } finally {
            session.endSession();
        }
    };
};

export const applyUserTransforms = (schema: Schema<IUser>) => {
    schema.set('toJSON', {
        transform: (_doc, ret, _options) => {
            delete ret.password;
            delete ret.refreshToken;
           
            delete ret.OTP;
            delete ret.OTPExpiresAt;
            delete ret.verificationToken;
            delete ret.verificationTokenExpires;
            delete ret.resetPasswordToken;
            delete ret.resetPasswordTokenExpires;
            delete ret.fcmToken;
            delete ret.createdAt;
            delete ret.updatedAt;
            return ret;
        },
    });

    schema.set('toObject', {
        transform: (_doc, ret, _options) => {
            delete ret.password;
            delete ret.refreshToken;
           
            delete ret.OTP;
            delete ret.OTPExpiresAt;
            delete ret.verificationToken;
            delete ret.verificationTokenExpires;
            delete ret.resetPasswordToken;
            delete ret.resetPasswordTokenExpires;
            delete ret.fcmToken;
            delete ret.createdAt;
            delete ret.updatedAt;
            return ret;
        },
    });
};
