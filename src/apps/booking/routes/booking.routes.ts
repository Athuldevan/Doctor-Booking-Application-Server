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
import { validate } from "../../../utils/JoiValidatiojn";
import {
  bookSlotValidation,
  cancelSlotValidation,
  createSlotValidation,
  updateSlotStatusValidation,
  updateSlotGroupValidation,
} from "../validations/booking.validation";

const router = express.Router();

router.post(
  "/",
  checkAuth,
  checkAccess("admin"),
  validate({ type: "body", schema: createSlotValidation }),
  tryCatch(createSlot),
);
router.get("/", checkAuth, checkAccess("admin", "patient"), getAllSlots);
router.get("/patient/history", checkAuth, checkAccess("patient"), getPatientHistory);
router.delete("/:doctorSlotId", checkAuth, checkAccess("admin"), deleteSlot);
router.patch(
  "/:doctorSlotId",
  checkAuth,
  checkAccess("admin"),
  validate({ type: "body", schema: updateSlotGroupValidation }),
  tryCatch(updateSlotGroup),
);

router.patch(
  "/:doctorSlotId/status/:timeSlotId",
  checkAuth,
  checkAccess("admin", "doctor"),
  validate({ type: "body", schema: updateSlotStatusValidation }),
  tryCatch(updateSlotStatus),
);

router.get("/doctor/:doctorId", checkAuth, getSlotsByDoctor);
router.post(
  "/:doctorSlotId/book/:timeSlotId",
  checkAuth,
  checkAccess("patient"),
  validate({ type: "body", schema: bookSlotValidation }),
  tryCatch(bookSlot),
);

router.patch(
  "/:doctorSlotId/cancel/:timeSlotId",
  checkAuth,
  validate({ type: "body", schema: cancelSlotValidation }),
  tryCatch(cancelSlot),
);

export default router;
