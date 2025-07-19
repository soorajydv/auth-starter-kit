import type { Response } from "express";
import asyncHandler from "express-async-handler";
import { sendSuccess, sendBadRequest } from "../../../utils/responseUtil";
import { AuthRequest } from "../../../middleware/auth";
import ProfileService from "../services/profile.service";
import { deleteAvatar, updateAvatar } from "../../../configs/multer.config";

export const createProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  
  if(req.user?.profile) return sendBadRequest(res,"Profile already exists");

  const profileData = { ...req.body, user: req.user?.id };
  const files = req.files as any;

  if (!files || !files.avatar) return sendBadRequest(res, "Avatar is required");

  const avatarPath = await updateAvatar(undefined, files?.avatar?.[0]);
  profileData.avatarUrl = avatarPath;

  const result = await ProfileService.createProfile(profileData);

  if (!result.success) {
    return sendBadRequest(res, result.message);
  }

  return sendSuccess(res, "Profile created successfully", result.data);
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return sendBadRequest(res, "User ID not provided");

  const result = await ProfileService.getProfile(userId);

  if (!result.success) {
    return sendBadRequest(res, result.message);
  }

  return sendSuccess(res, "Profile retrieved successfully", result.data);
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const files = req.files as any;

  if (!userId) return sendBadRequest(res, "User ID not provided");
  const profile = await ProfileService.getProfile(req.user?.id as string);
  if (files?.avatar?.[0]) {
    const avatarPath = await updateAvatar(profile.data?.avatarUrl, files?.avatar?.[0]);
    req.body.avatarUrl = avatarPath;
  }

  const result = await ProfileService.updateProfile(userId, req.body);

  if (!result.success) {
    return sendBadRequest(res, result.message);
  }

  return sendSuccess(res, "Profile updated successfully", result.data);
});

export const deleteProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return sendBadRequest(res, "User ID not provided");

  const result = await ProfileService.deleteProfile(userId);

  if (!result.success) {
    return sendBadRequest(res, result.message);
  }

  const profile = await ProfileService.getProfile(userId);
  await deleteAvatar(profile.data?.avatarUrl as string)
  return sendSuccess(res, "Profile deleted successfully");
});