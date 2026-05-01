import { NextFunction, Request, Response } from "express";
import joi, { ObjectSchema } from "joi";
import { AppError } from "./AppError";

type ValidationType = "params" | "body" | "query";

interface ValidationInput {
  type: ValidationType;
  schema: ObjectSchema;
}

export const validate = ({ type, schema }: ValidationInput) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let data;
    switch (type) {
      case "params":
        data = req.params;
        break;
      case "body":
        data = req.body;
        break;
      case "query":
        data = req.query;
        break;
    }

    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
      console.log("error", error);
      return next(new AppError(error.message, 400));
    }
    switch (type) {
      case "params":
        req.params = value;
        break;
      case "body":
        req.body = value;
        break;
      case "query":
        req.query = value;
        break;
    }
    next();
  };
};