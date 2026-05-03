import { AppError } from "../../../utils/AppError";
import User from "../model/user.model";
import bcrypt from "bcrypt";
import { IUser, Role } from "../types/user.types";
import { generateAccessToken, generateRefreshToken } from "../../../utils/Jwt";
import RefreshToken from "../model/refereshToken.model";
import type { Response } from "express";
import { Types } from "mongoose";

export const registerService = async (body: Partial<IUser>) => {
  const password = body.password!;
  const hashedPassword = await bcrypt.hash(password, 8);
  const user = await User.create({ ...body, password: hashedPassword });
  return user;
};

export const loginService = async (
  email: string,
  password: string,
  role: Role,
) => {
  console.log(email, password, role);
  const user = await User.findOne({ email, role });
  if (!user) throw new AppError("No Such User found", 404);

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new AppError("Invalid Credentials", 401);
  }

  const payload = {
    userId: user._id.toString(),
    role: user.role as Role,
  };

  const token = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);
  await RefreshToken.create({ token: refreshToken, userId: user._id });

  const data = {
    accessToken: token,
    refreshToken,
  };
  return data;
};

export const logoutService = async (id: string) => {
  const res = await RefreshToken.findOneAndDelete({
    userId: new Types.ObjectId(id),
  });
  if (res) {
    return "success";
  }

  throw new AppError("id does not match", 401);
};

export const clearAuthCookie = (res: Response) => {
  ["accessToken", "refreshToken"].forEach((name) =>
    res.clearCookie(name, {
      httpOnly: true,
      secure: false,
      sameSite: "lax" as const,
    }),
  );
};

export const getAuthUser = async (
  query: Record<string, any> = {},
  role: Role,
) => {
  const user = await User.findOne({ ...query, isDeleted: false });
  return user
};
