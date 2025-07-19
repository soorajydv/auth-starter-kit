import express from "express"
import authRoutes from "../features/auth/routes/auth.route"
import profileRoutes from "../features/profile/routes/profile.route"

const router = express.Router()

// Mount routes
router.use("/auth", authRoutes)
router.use("/profile", profileRoutes)

export default router
