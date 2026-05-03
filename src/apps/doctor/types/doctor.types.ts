import { Types } from "mongoose";

export interface IDoctor {
  user: Types.ObjectId;
  specialization: string;
  experience: number;
  consultationFee: number;
  education : string
  bio: string;
  createdAt?: string;
  updatedAt?: string;
  isVerified: boolean;
  isDeleted: boolean;
}
