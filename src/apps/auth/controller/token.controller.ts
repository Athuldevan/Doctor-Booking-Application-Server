import { Request, Response } from "express";
import { AppError } from "../../../utils/AppError";
import { refreshTokenService } from "../services/token.service";
import { setAuthCookie } from "../../../utils/Jwt";

export const tokenController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) throw new AppError("Unauthorized.Please Login", 404);

  const newToken = await refreshTokenService(refreshToken);
  setAuthCookie(res, newToken.accessToken, newToken.refreshToken);
  return res
    .status(200)
    .json({ status: "success", message: "created new token" });
};
