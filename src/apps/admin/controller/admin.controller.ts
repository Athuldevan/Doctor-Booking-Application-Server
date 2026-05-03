import { Response } from "express";
import tryCatch from "../../../utils/tryCatch";
import { AuthRequest } from "../../../middlewares/checkAuth";
import { getDashboardMetricsService, getAdminAppointmentsService } from "../service/admin.service";

export const getDashboardMetrics = tryCatch(
  async (_req: AuthRequest, res: Response) => {
    const metrics = await getDashboardMetricsService();
    return res.status(200).json({
      status: "success",
      message: "Dashboard metrics fetched",
      data: metrics,
    });
  },
);

export const getAdminAppointments = tryCatch(
  async (req: AuthRequest, res: Response) => {
    const { status, page, limit } = req.query as Record<string, string>;
    const result = await getAdminAppointmentsService({
      status: status || undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
    return res.status(200).json({
      status: "success",
      message: "Appointments fetched",
      data: result,
    });
  },
);
