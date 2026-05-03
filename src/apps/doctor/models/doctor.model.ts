import mongoose, { Schema } from "mongoose";
import { IDoctor } from "../types/doctor.types";
import { string } from "joi";

export const doctorSchema = new mongoose.Schema<IDoctor>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    default: 1,
    min: [1, "At least Minimum 1 year experience is required"],
  },

  consultationFee: {
    type: Number,
    default: 0,
  },

  education: {
    type: String,
  },
  bio: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

export const Doctor = mongoose.model<IDoctor>("Doctor", doctorSchema);

export default Doctor;
