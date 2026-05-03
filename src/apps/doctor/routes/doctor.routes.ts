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

const router = express.Router();
router
  .route("/")
  .post(checkAuth, tryCatch(addDoctor))
  .get(checkAuth, checkAccess("admin", "patient"), tryCatch(getAllDoctor));

router
  .route("/:id")
  .get(checkAuth, checkAccess("admin", "patient"), tryCatch(getADoctor))
  .put(checkAuth, checkAccess("admin"), tryCatch(updateADoctor))
  .patch(checkAuth, checkAccess("admin"), tryCatch(deleteADoctor));
export default router;
