import { IPayload } from "../apps/auth/types/auth.types";
import jwt from "jsonwebtoken";
import type { Response } from "express";

export const generateAccessToken = async (payload: IPayload) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRET! as string, {
    expiresIn: "1h",
  });
  return token;
};

export const generateRefreshToken = async (payload: IPayload) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRET! as string, {
    expiresIn: "7d",
  });
  return token;
};

export const verifyRefreshToken = async (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET! as string) as IPayload;
};

export const setAuthCookie = async (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: none,
    maxAge: 60 * 60 * 1000,
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
