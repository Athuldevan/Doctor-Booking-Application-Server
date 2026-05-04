import mongoose, { Types } from "mongoose";
import { AppError } from "../../../utils/AppError";
import Slot from "../model/slot.model";
import { ISlot, ITimeSlot } from "../types/slot";

// ─── Create Slot ──────────────────────────────────────────────────────────────
export const createSlotService = async (body: Partial<ISlot>) => {
  const slot = await Slot.create({ ...body });
  return slot;
};

export const getAllSlotsService = async () => {
  return Slot.find({ isDeleted: false })
    .populate({
      path: "doctorId",
      populate: {
        path: "user",
        select: "name email",
      },
    })
    .populate("timeSlots.patient", "name email phone")
    .sort({ date: -1 });
};

export const getSlotByDoctorService = async (
  doctorId: string,
  date?: string
) => {
  const filter: any = {
    doctorId,
    isDeleted: false,
  };

  if (date) {
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }

  return Slot.find(filter)
    .populate("timeSlots.patient", "name email phone")
    .sort({ date: 1 });
};

export const bookSlotService = async (
  doctorSlotId: string | Types.ObjectId,
  timeSlotId: string,
  patientId: string
) => {
  const patientObjectId = new Types.ObjectId(patientId);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const slot = await Slot.findOneAndUpdate(
      {
        _id: doctorSlotId,
        isDeleted: false,
        "timeSlots._id": timeSlotId,
        "timeSlots.status": "available",
      },
      {
        $set: {
          "timeSlots.$.status": "pending",
          "timeSlots.$.patient": patientObjectId,
        },
      },
      { session, new: true }
    );

    if (!slot) {
      throw new AppError("Slot not available or not found", 400);
    }

    await session.commitTransaction();
    return slot;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const updateSlotStatusService = async (
  doctorSlotId: string | Types.ObjectId,
  timeSlotId: string,
  status: ITimeSlot["status"]
) => {
  const slotDoc = await Slot.findOne(
    {
      _id: doctorSlotId,
      isDeleted: false,
      "timeSlots._id": timeSlotId,
    },
    {
      timeSlots: { $elemMatch: { _id: timeSlotId } },
    }
  );

  if (!slotDoc || !slotDoc.timeSlots?.length) {
    throw new AppError("Slot not found", 404);
  }

  const currentSlot = slotDoc.timeSlots[0];
  const currentStatus = currentSlot.status;

  const allowedTransitions: Partial<
    Record<ITimeSlot["status"], ITimeSlot["status"][]>
  > = {
    available: ["pending", "blocked"],
    pending: ["confirmed", "cancelled"],
    confirmed: ["completed", "cancelled"],
  };

  const nextAllowedStatuses = allowedTransitions[currentStatus] ?? [];
  if (!nextAllowedStatuses.includes(status)) {
    throw new AppError(
      `Invalid status transition from ${currentStatus} to ${status}`,
      400
    );
  }

  if (status === "confirmed" && !currentSlot.patient) {
    throw new AppError(
      "Cannot confirm slot without a patient assignment",
      400
    );
  }

  const slot = await Slot.findOneAndUpdate(
    {
      _id: doctorSlotId,
      isDeleted: false,
      "timeSlots._id": timeSlotId,
    },
    {
      $set: {
        "timeSlots.$.status": status,
      },
    },
    { new: true }
  );

  if (!slot) {
    throw new AppError("Slot not found", 404);
  }

  return slot;
};

export const cancelSlotService = async (
  doctorSlotId: string | Types.ObjectId,
  timeSlotId: string,
  cancelledBy: "patient" | "doctor" | "admin",
  cancelReason?: string
) => {
  const slot = await Slot.findOneAndUpdate(
    {
      _id: doctorSlotId,
      isDeleted: false,
      "timeSlots._id": timeSlotId,
      "timeSlots.status": { $in: ["pending", "confirmed"] },
    },
    {
      $set: {
        "timeSlots.$.status": "cancelled",
        "timeSlots.$.cancelledBy": cancelledBy,
        "timeSlots.$.cancelReason": cancelReason || null,
      },
    },
    { new: true }
  );

  if (!slot) {
    throw new AppError("Slot not found or already cancelled", 400);
  }

  return slot;
};

export const deleteSlotService = async (
  doctorSlotId: string | Types.ObjectId
) => {
  const slot = await Slot.findOneAndUpdate(
    { _id: doctorSlotId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );

  if (!slot) throw new AppError("Slot not found", 404);
  return slot;
};

export const updateSlotGroupService = async (
  id: string,
  data: Partial<ISlot>
) => {
  const slot = await Slot.findByIdAndUpdate(id, data, { new: true });
  if (!slot) throw new AppError("Slot not found", 404);
  return slot;
};

export const getPatientHistoryService = async (patientId: string) => {
  const slots = await Slot.find({
    isDeleted: false,
    "timeSlots.patient": patientId,
  })
    .populate({
      path: "doctorId",
      populate: {
        path: "user",
        select: "name email",
      },
    })
    .sort({ date: -1 });

  return slots.map((doc) => ({
    ...doc.toObject(),
    timeSlots: doc.timeSlots.filter(
      (ts) => ts.patient?.toString() === patientId
    ),
  }));
};