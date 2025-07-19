import jwt from 'jsonwebtoken';
import { IUser } from '../features/user/models/user.model';
import { JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_SECRET } from '../configs/env.cofig';

export const generateToken = async(user:Partial<IUser>) => {
  return jwt.sign({ user }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
};

export const generateRefreshToken = async(user:Partial<IUser>) => {
  return jwt.sign({ user }, JWT_REFRESH_SECRET, { expiresIn:JWT_REFRESH_EXPIRES_IN as any});
};

export const verifyToken = async(token:string) => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = async(token:string) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};