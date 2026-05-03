import type { NextFunction, Request, Response } from "express";
import { Role } from "../apps/auth/types/user.types";
import { AuthRequest } from "./checkAuth";
import { AppError } from "../utils/AppError";

const checkAccess =
  (...roles: Role[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(userRole as Role)) {
      throw new AppError("Access Denied", 401)
    }

    next();
  };

export default checkAccess;
