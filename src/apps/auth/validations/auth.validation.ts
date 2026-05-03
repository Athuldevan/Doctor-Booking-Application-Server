import Joi from "joi";

export const registerValidation = Joi.object({
  name: Joi.string().required().min(2).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  role: Joi.string().valid("admin", "patient").required(),
  phone : Joi.number().required(),
});

export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().messages({
    "string.base": "Password must be a string",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
  role: Joi.string().valid("admin", "patient").required(),
});
