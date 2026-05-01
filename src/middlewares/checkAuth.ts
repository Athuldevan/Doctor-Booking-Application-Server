import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { IPayload } from "../apps/auth/types/auth.types";

export interface AuthRequest extends Request {
  user?: IPayload;
  role?: IPayload;
}

export const checkAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  let token = req.cookies.accessToken;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  const jwtSecretKey = process.env.JWT_SECRET as string;

  if (!token) return next(new AppError("Unauthorized", 401));

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as IPayload;
    if (!decoded) return next(new AppError("Token Invalid or expired", 401));
    req.user = decoded;
  } catch (err) {
    return next(new AppError("Token invalid or expired", 401));
  }
};
