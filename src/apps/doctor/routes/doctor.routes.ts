import express from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import tryCatch from "../../../utils/tryCatch";
import {
  addDoctor,
  deleteADoctor,
  getADoctor,
  getAllDoctor,
  updateADoctor,
} from "../controllers/doctor.controller";
import checkAccess from "../../../middlewares/checkAccess";
import { validate } from "../../../utils/JoiValidatiojn";
import {
  addDoctorValidation,
  updateDoctorValidation,
} from "../validations/doctor.validation";

const router = express.Router();
router
  .route("/")
  .post(
    checkAuth,
    checkAccess("admin"),
    validate({ type: "body", schema: addDoctorValidation }),
    tryCatch(addDoctor),
  )
  .get(checkAuth, checkAccess("admin", "patient"), tryCatch(getAllDoctor));

router
  .route("/:id")
  .get(checkAuth, checkAccess("admin", "patient"), tryCatch(getADoctor))
  .put(
    checkAuth,
    checkAccess("admin"),
    validate({ type: "body", schema: updateDoctorValidation }),
    tryCatch(updateADoctor),
  )
  .patch(checkAuth, checkAccess("admin"), tryCatch(deleteADoctor));
export default router;
