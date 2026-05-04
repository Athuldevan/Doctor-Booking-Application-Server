import Joi from "joi";

export const createSlotValidation = Joi.object({
  doctorId: Joi.string().required().hex().length(24),
  date: Joi.date().iso().required(),
  slotDuration: Joi.number().required().valid(15, 30, 45, 60),
  timeSlots: Joi.array().items(
    Joi.object({
      startTime: Joi.string().required().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      endTime: Joi.string().required().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      status: Joi.string().valid("available", "pending", "confirmed", "cancelled", "completed", "blocked").default("available"),
    })
  ).required().min(1),
});

export const updateSlotStatusValidation = Joi.object({
  status: Joi.string().required().valid("available", "pending", "confirmed", "cancelled", "completed", "blocked"),
});

export const bookSlotValidation = Joi.object({
  reason: Joi.string().max(200).optional(),
});

export const cancelSlotValidation = Joi.object({
  cancelReason: Joi.string().max(200).required(),
});

export const updateSlotGroupValidation = Joi.object({
  date: Joi.date().iso(),
  slotDuration: Joi.number().valid(15, 30, 45, 60),
  isDeleted: Joi.boolean(),
});
