import Profile, { IProfile } from "../../profile/models/profile.model";
import User from "../../user/models/user.model";

class ProfileService {
  async createProfile(body: any) {
    const userId  = body.user;

    const user = await User.findById(userId);
    if (!user) return { success: false, message: "User not found" };

    const profile = await Profile.create(body);
    user.profile = profile.id;
    user.generateApiKey();
    await user.save();
    return { success: true, data: profile };
  }

  async getProfile(userId: string) {
    const profile = await Profile.findOne({ user: userId }).populate("user");
    if (!profile) {
      return { success: false, message: "Profile not found" };
    }
    return { success: true, data: profile };
  }

  async updateProfile(userId: string, body: Partial<IProfile>) {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return { success: false, message: "Profile not found" };
    }

    Object.assign(profile, body);
    await profile.save();
    return { success: true, data: profile };
  }

  async deleteProfile(userId: string) {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      return { success: false, message: "Profile not found" };
    }
    profile.deletedAt = new Date();
    await profile.save();
    return { success: true, message: "Profile deleted successfully" };
  }
}

export default new ProfileService();