// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Global error:", err);

  // Joi validation error
  if (err?.isJoi) {
    return res.status(400).json({
      message: err.details?.[0]?.message || "Validation error",
    });
  }

  // Mongoose validation error
  if (err?.name === "ValidationError") {
    const firstError = Object.values(err.errors)[0] as any;

    return res.status(400).json({
      message: firstError?.message || "Validation error",
    });
  }

  // Mongo duplicate key error
  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];

    return res.status(400).json({
      message: `${field} already exists`,
    });
  }

  // Custom / normal error
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
};

export default errorHandler;