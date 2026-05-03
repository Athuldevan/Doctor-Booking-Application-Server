import { Document, Types } from "mongoose";

export interface ITimeSlot {
  _id?: Types.ObjectId;
  startTime: string;
  endTime: string;
  status:
    | "available"
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed"
    | "blocked";
  patient?: Types.ObjectId | null;
  reason?: string | null;
  notes?: string | null;
  cancelledBy?: "patient" | "doctor" | "admin" | null;
  cancelReason?: string | null;
}

export interface ISlot extends Document {
  doctorId: Types.ObjectId;
  date: Date;
  slotDuration: number;
  timeSlots: ITimeSlot[];
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
