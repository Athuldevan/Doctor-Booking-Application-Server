import express from "express";
import { checkAuth } from "../../../middlewares/checkAuth";
import checkAccess from "../../../middlewares/checkAccess";
import { getDashboardMetrics, getAdminAppointments } from "../controller/admin.controller";

const router = express.Router();

router.get("/dashboard", checkAuth, checkAccess("admin"), getDashboardMetrics);
router.get("/appointments", checkAuth, checkAccess("admin"), getAdminAppointments);

export default router;
