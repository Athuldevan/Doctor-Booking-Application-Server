import express from "express";
import {
  createSlot,
  getAllSlots,
  getSlotsByDoctor,
  bookSlot,
  updateSlotStatus,
  cancelSlot,
  deleteSlot,
  updateSlotGroup,
  getPatientHistory,
} from "../controller/booking.controller";
import { checkAuth } from "../../../middlewares/checkAuth";
import checkAccess from "../../../middlewares/checkAccess";
import tryCatch from "../../../utils/tryCatch";

const router = express.Router();

router.post("/", checkAuth, checkAccess("admin"), createSlot);
router.get("/", checkAuth, checkAccess("admin", "patient"), getAllSlots);
router.get("/patient/history", checkAuth, checkAccess("patient"), getPatientHistory);
router.delete("/:doctorSlotId", checkAuth, checkAccess("admin"), deleteSlot);
router.patch("/:doctorSlotId", checkAuth, checkAccess("admin"), updateSlotGroup);

router.patch(
  "/:doctorSlotId/status/:timeSlotId",
  checkAuth,
  checkAccess("admin", "doctor"),
  updateSlotStatus,
);

router.get("/doctor/:doctorId", checkAuth, getSlotsByDoctor);
router.post(
  "/:doctorSlotId/book/:timeSlotId",
  checkAuth,
  checkAccess("patient"),
  bookSlot,
);

router.patch("/:doctorSlotId/cancel/:timeSlotId", checkAuth, cancelSlot);

export default router;
