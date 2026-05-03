import express from "express";
import {
  createSlot,
  getAllSlots,
  getSlotsByDoctor,
  bookSlot,
  updateSlotStatus,
  cancelSlot,
  deleteSlot,
} from "../controller/booking.controller";
import { checkAuth } from "../../../middlewares/checkAuth";
import checkAccess from "../../../middlewares/checkAccess";
import tryCatch from "../../../utils/tryCatch";

const router = express.Router();

router.post("/", checkAuth, checkAccess("admin"), createSlot);
router.get("/", checkAuth, checkAccess("admin"), getAllSlots);
router.delete("/:doctorSlotId", checkAuth, checkAccess("admin"), deleteSlot);

// admin + doctor
router.patch(
  "/:doctorSlotId/status/:timeSlotId",
  checkAuth,
  checkAccess("admin", "doctor"),
  updateSlotStatus,
);

// patient
router.get("/doctor/:doctorId", checkAuth, getSlotsByDoctor);
router.post(
  "/:doctorSlotId/book/:timeSlotId",
  checkAuth,
  checkAccess("patient"),
  bookSlot,
);

// patient + admin
router.patch("/:doctorSlotId/cancel/:timeSlotId", checkAuth, cancelSlot);

export default router;
