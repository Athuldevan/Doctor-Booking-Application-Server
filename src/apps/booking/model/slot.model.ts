import mongoose, { Types } from "mongoose";
import { ISlot, ITimeSlot } from "../types/slot";

export const TimeSlotSchema = new mongoose.Schema<ITimeSlot>(
  {
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "available",
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "blocked",
      ],
      default: "available",
    },

    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { _id: true },
);

const doctorSlotSchema = new mongoose.Schema<ISlot>(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Doctor",
    },

    date: {
      type: Date,
      required: true,
    },

    slotDuration: {
      type: Number,
      required: true,
    },

    timeSlots: {
      type: [TimeSlotSchema],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

doctorSlotSchema.index({ doctorId: 1, date: 1 }, { unique: true });

const DoctorSlot = mongoose.model<ISlot>("doctorSlots", doctorSlotSchema);

export default DoctorSlot;
