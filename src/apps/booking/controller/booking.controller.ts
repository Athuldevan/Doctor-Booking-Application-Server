import { Response } from "express";
import tryCatch from "../../../utils/tryCatch";
import { bookSlotService, cancelSlotService, createSlotService, deleteSlotService, getAllSlotsService, getSlotByDoctorService, updateSlotStatusService } from "../service/slot.service";
import { AuthRequest } from "../../../middlewares/checkAuth";


export const createSlot = tryCatch(async (req: AuthRequest, res: Response) => {
  const slot = await createSlotService(req.body);
  return res.status(201).json({
    status: "success",
    message: "Slot created successfully",
    data: slot,
  });
});

export const getAllSlots = tryCatch(async (req: AuthRequest, res: Response) => {
  const slots = await getAllSlotsService();
  return res.status(200).json({
    status: "success",
    message: "Slots fetched",
    data: slots,
  });
});

export const getSlotsByDoctor = tryCatch(
  async (req: AuthRequest, res: Response) => {
    const { doctorId } = req.params as { doctorId: string };
    const { date } = req.query as { date?: string };

    const slots = await getSlotByDoctorService(doctorId, date);
    return res.status(200).json({
      status: "success",
      message: "Slots fetched",
      data: slots,
    });
  }
);

export const bookSlot = tryCatch(async (req: AuthRequest, res: Response) => {
  const { doctorSlotId, timeSlotId } = req.params as {
    doctorSlotId: string;
    timeSlotId: string;
  };
  const patientId = req.user?.userId as string;

  const slot = await bookSlotService(doctorSlotId, timeSlotId, patientId);
  return res.status(200).json({
    status: "success",
    message: "Slot booked successfully",
    data: slot,
  });
});

export const updateSlotStatus = tryCatch(
  async (req: AuthRequest, res: Response) => {
    const { doctorSlotId, timeSlotId } = req.params as {
      doctorSlotId: string;
      timeSlotId: string;
    };
    const { status } = req.body;

    const slot = await updateSlotStatusService(doctorSlotId, timeSlotId, status);
    return res.status(200).json({
      status: "success",
      message: "Slot status updated",
      data: slot,
    });
  }
);

export const cancelSlot = tryCatch(async (req: AuthRequest, res: Response) => {
  const { doctorSlotId, timeSlotId } = req.params as {
    doctorSlotId: string;
    timeSlotId: string;
  };
  const { cancelReason } = req.body;
  const cancelledBy = req.user?.role as "patient" | "doctor" | "admin";

  const slot = await cancelSlotService(
    doctorSlotId,
    timeSlotId,
    cancelledBy,
    cancelReason
  );
  return res.status(200).json({
    status: "success",
    message: "Slot cancelled",
    data: slot,
  });
});

export const deleteSlot = tryCatch(async (req: AuthRequest, res: Response) => {
  const { doctorSlotId } = req.params as { doctorSlotId: string };

  const slot = await deleteSlotService(doctorSlotId);
  return res.status(200).json({
    status: "success",
    message: "Slot deleted",
    data: slot,
  });
});