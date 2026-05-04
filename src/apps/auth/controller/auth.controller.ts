import { Request, Response } from "express";
import {
  clearAuthCookie,
  loginService,
  logoutService,
  registerService,
} from "../services/auth.service";
import { setAuthCookie } from "../../../utils/Jwt";
import { AuthRequest } from "../../../middlewares/checkAuth";

export const register = async (req: Request, res: Response) => {
  const user = await registerService(req.body);
  return res.status(201).json({
    status: "success",
    message: "Successfully fully created a User",
    data: user,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  const data = await loginService(email, password, role);
  setAuthCookie(res, data.accessToken, data.refreshToken);

  return res.status(200).json({
    status: "success",
    message: "Login successful",
    data: data.user,
  });
};

export const logout = async (req: AuthRequest, res: Response) => {
  const id = req.user?.userId;
  if (!id) return res.status(401).json({ message: "Unauthorized" });
  await logoutService(id);
  clearAuthCookie(res);
};
