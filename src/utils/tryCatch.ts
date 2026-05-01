import { Request, Response, NextFunction } from "express";

type ControllerFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

const tryCatch =
  (controller: ControllerFunction) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await controller(req, res, next);
    } catch (error: any) {
      console.log("tryCatch error", error.message);
      next(error);
    }
  };

export default tryCatch;
