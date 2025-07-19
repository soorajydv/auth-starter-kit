import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter: Transporter = nodemailer.createTransport({
  service: process.env.EMAIL_HOST === "gmail" ? "gmail" : undefined,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const SMTP_USER = process.env.SMTP_USER as string
export const EMAIL_CC_RECIPIENT = process.env.EMAIL_CC_RECIPIENT as string