import Joi from "joi";

export const addDoctorValidation = Joi.object({
  user: Joi.string().required().hex().length(24).messages({
    "string.base": "User ID must be a string",
    "string.empty": "User ID is required",
    "string.hex": "User ID must be a valid hex string",
    "string.length": "User ID must be 24 characters long",
  }),
  specialization: Joi.string().required().min(2).max(100),
  experience: Joi.number().required().min(0).max(60),
  consultationFee: Joi.number().required().min(0),
  education: Joi.string().required().min(2).max(200),
  bio: Joi.string().required().min(10).max(1000),
});

export const updateDoctorValidation = Joi.object({
  specialization: Joi.string().min(2).max(100),
  experience: Joi.number().min(0).max(60),
  consultationFee: Joi.number().min(0),
  education: Joi.string().min(2).max(200),
  bio: Joi.string().min(10).max(1000),
  isVerified: Joi.boolean(),
});
