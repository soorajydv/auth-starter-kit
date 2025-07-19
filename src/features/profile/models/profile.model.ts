import mongoose, { Schema, type Document } from "mongoose"
import { GENDER, Gender } from "../../../constants/constants"

export interface IProfile extends Document {
  user: mongoose.Types.ObjectId | string
  dob: string
  address: string
  phone: string
  gender: Gender
  timezone: string
  avatarUrl?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

const ProfileSchema = new Schema<IProfile>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dob: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: Object.values(GENDER), required: true },
    timezone: { type: String },
    avatarUrl: { type: String },
    deletedAt: { type: Date },
  },
  { timestamps: true }
)

const Profile = mongoose.model<IProfile>("Profile", ProfileSchema)
export default Profile
