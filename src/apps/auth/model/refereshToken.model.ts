import mongoose, { Schema, Types } from "mongoose";

export interface IRefreshToken extends Document {
  token: string;
  userId: Types.ObjectId;
  createdAt?: Date;
}
const refreshTokenSchema = new Schema<IRefreshToken>({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

refreshTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });
refreshTokenSchema.index({ userId: 1 });

const RefreshToken = mongoose.model<IRefreshToken>(
  "refreshToken",
  refreshTokenSchema,
);
export default RefreshToken;
