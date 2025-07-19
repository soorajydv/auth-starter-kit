import User from "../models/user.model";

export const getUserByEmail = async (email: string) => await User.findOne({ email, deletedAt: { $exists: false } });