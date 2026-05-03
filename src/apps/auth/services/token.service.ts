import mongoose from "mongoose";
import { AppError } from "../../../utils/AppError";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../utils/Jwt";
import RefreshToken from "../model/refereshToken.model";
import { IPayload } from "../types/auth.types";
import { getAuthUser } from "./auth.service";

export const refreshTokenService = async (token: string) => {
  const payload: IPayload = await verifyRefreshToken(token);
  const tokenDoc = await RefreshToken.findOne({
    userId: payload.userId,
  });

  if (!tokenDoc) throw new AppError("Invalid refresh token", 401);
  const user = await getAuthUser({ _id: payload.userId }, payload.role);
  if (!user) throw new AppError("No Such User Found", 404);

  const newPayload = {
    userId: user._id.toString(),
    role: user.role,
  };
  const newAccessToken = await generateAccessToken(newPayload);
  const newRefreshToken = await generateRefreshToken(newPayload);
  tokenDoc.token = newRefreshToken;
  await tokenDoc.save();
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const removeToken = async (id: string) => {
  const response = await RefreshToken.findOneAndDelete({
    userId: new mongoose.Types.ObjectId(id),
  });
  if (response) {
    return "success";
  }
  throw new AppError("id does not match", 401);
};
