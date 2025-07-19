import express from "express";
import { authenticateUser } from "../../../middleware/auth";
import { validate } from "../../../middleware/validate";
import { createProfileValidator, updateProfileValidator } from "../validators/profile.validator";
import { createProfile, getProfile, updateProfile, deleteProfile } from "../controllers/profile.controller";
import { upload } from "../../../configs/multer.config";

const router = express.Router();

router.post("/", authenticateUser, upload.fields([{ name: 'avatar', maxCount: 1 }]),validate(createProfileValidator), createProfile);
router.get("/", authenticateUser, getProfile);
router.patch("/", authenticateUser, upload.fields([{ name: 'avatar', maxCount: 1 }]), validate(updateProfileValidator), updateProfile);
router.delete("/", authenticateUser, deleteProfile);

export default router;