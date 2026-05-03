import DoctorSlot from "../../booking/model/slot.model";
import Doctor from "../../doctor/models/doctor.model";
import User from "../../auth/model/user.model";

export const getDashboardMetricsService = async () => {
  // ── 1. Top-level counts ────────────────────────────────────────────────────
  const [totalDoctors, totalPatients, totalAdmins] = await Promise.all([
    Doctor.countDocuments({ isDeleted: false }),
    User.countDocuments({ role: "patient", isDeleted: false }),
    User.countDocuments({ role: "admin", isDeleted: false }),
  ]);

  // ── 2. Time-slot status breakdown + revenue aggregation ───────────────────
  // Unwind the embedded timeSlots array so we can group by status
  const slotStats: {
    _id: string;
    count: number;
  }[] = await DoctorSlot.aggregate([
    { $match: { isDeleted: false } },
    { $unwind: "$timeSlots" },
    {
      $group: {
        _id: "$timeSlots.status",
        count: { $sum: 1 },
      },
    },
  ]);

  const statusMap: Record<string, number> = {};
  let totalBookings = 0;
  for (const s of slotStats) {
    statusMap[s._id] = s.count;
    totalBookings += s.count;
  }

  // ── 3. Revenue = sum of consultationFee for every CONFIRMED booking ────────
  const revenueAgg: { totalRevenue: number }[] = await DoctorSlot.aggregate([
    { $match: { isDeleted: false } },
    { $unwind: "$timeSlots" },
    { $match: { "timeSlots.status": "confirmed" } },
    {
      $lookup: {
        from: "doctors",           // Mongoose model name → lowercase + "s"
        localField: "doctorId",
        foreignField: "_id",
        as: "doctor",
      },
    },
    { $unwind: "$doctor" },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$doctor.consultationFee" },
      },
    },
  ]);
  const totalRevenue = revenueAgg[0]?.totalRevenue ?? 0;

  // ── 4. Top doctors by confirmed bookings (with revenue) ───────────────────
  const topDoctors = await DoctorSlot.aggregate([
    { $match: { isDeleted: false } },
    { $unwind: "$timeSlots" },
    { $match: { "timeSlots.status": "confirmed" } },
    {
      $group: {
        _id: "$doctorId",
        confirmedBookings: { $sum: 1 },
      },
    },
    { $sort: { confirmedBookings: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "doctors",
        localField: "_id",
        foreignField: "_id",
        as: "doctor",
      },
    },
    { $unwind: "$doctor" },
    {
      $lookup: {
        from: "users",
        localField: "doctor.user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        doctorId: "$_id",
        name: "$user.name",
        specialization: "$doctor.specialization",
        consultationFee: "$doctor.consultationFee",
        confirmedBookings: 1,
        revenue: { $multiply: ["$doctor.consultationFee", "$confirmedBookings"] },
      },
    },
  ]);

  // ── 5. Recent bookings (last 10 confirmed/pending time-slots) ─────────────
  const recentBookings = await DoctorSlot.aggregate([
    { $match: { isDeleted: false } },
    { $unwind: "$timeSlots" },
    { $match: { "timeSlots.status": { $in: ["confirmed", "pending"] } } },
    { $sort: { "timeSlots._id": -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "doctors",
        localField: "doctorId",
        foreignField: "_id",
        as: "doctor",
      },
    },
    { $unwind: "$doctor" },
    {
      $lookup: {
        from: "users",
        localField: "doctor.user",
        foreignField: "_id",
        as: "doctorUser",
      },
    },
    { $unwind: "$doctorUser" },
    {
      $lookup: {
        from: "users",
        localField: "timeSlots.patient",
        foreignField: "_id",
        as: "patientUser",
      },
    },
    {
      $project: {
        _id: 0,
        date: "$date",
        startTime: "$timeSlots.startTime",
        endTime: "$timeSlots.endTime",
        status: "$timeSlots.status",
        doctorName: "$doctorUser.name",
        specialization: "$doctor.specialization",
        patientName: {
          $cond: {
            if: { $gt: [{ $size: "$patientUser" }, 0] },
            then: { $arrayElemAt: ["$patientUser.name", 0] },
            else: "—",
          },
        },
        consultationFee: "$doctor.consultationFee",
      },
    },
  ]);

  // ── 6. Booking trend – daily confirmed bookings for last 7 days ───────────
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const bookingTrend = await DoctorSlot.aggregate([
    { $match: { isDeleted: false, date: { $gte: sevenDaysAgo } } },
    { $unwind: "$timeSlots" },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        confirmed: {
          $sum: { $cond: [{ $eq: ["$timeSlots.status", "confirmed"] }, 1, 0] },
        },
        pending: {
          $sum: { $cond: [{ $eq: ["$timeSlots.status", "pending"] }, 1, 0] },
        },
        cancelled: {
          $sum: { $cond: [{ $eq: ["$timeSlots.status", "cancelled"] }, 1, 0] },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    overview: {
      totalDoctors,
      totalPatients,
      totalAdmins,
      totalBookings,
      totalRevenue,
    },
    slotStatusBreakdown: {
      available: statusMap["available"] ?? 0,
      pending: statusMap["pending"] ?? 0,
      confirmed: statusMap["confirmed"] ?? 0,
      cancelled: statusMap["cancelled"] ?? 0,
      completed: statusMap["completed"] ?? 0,
    },
    topDoctors,
    recentBookings,
    bookingTrend,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Admin: All Appointments (booked slots only, paginated + filterable)
// ─────────────────────────────────────────────────────────────────────────────
export const getAdminAppointmentsService = async (opts: {
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const { status, page = 1, limit = 20 } = opts;
  const skip = (page - 1) * limit;

  // Only show slots that have been acted on (not just "available")
  const statusFilter = status
    ? { "timeSlots.status": status }
    : { "timeSlots.status": { $in: ["pending", "confirmed", "cancelled", "completed"] } };

  const pipeline: any[] = [
    { $match: { isDeleted: false } },
    { $unwind: "$timeSlots" },
    { $match: statusFilter },
    // Lookup doctor
    {
      $lookup: {
        from: "doctors",
        localField: "doctorId",
        foreignField: "_id",
        as: "doctor",
      },
    },
    { $unwind: "$doctor" },
    // Lookup doctor's user (name/email)
    {
      $lookup: {
        from: "users",
        localField: "doctor.user",
        foreignField: "_id",
        as: "doctorUser",
      },
    },
    { $unwind: "$doctorUser" },
    // Lookup patient user
    {
      $lookup: {
        from: "users",
        localField: "timeSlots.patient",
        foreignField: "_id",
        as: "patientUser",
      },
    },
    {
      $project: {
        _id: 0,
        doctorSlotId: "$_id",
        timeSlotId: "$timeSlots._id",
        date: "$date",
        startTime: "$timeSlots.startTime",
        endTime: "$timeSlots.endTime",
        status: "$timeSlots.status",
        cancelledBy: "$timeSlots.cancelledBy",
        cancelReason: "$timeSlots.cancelReason",
        // Doctor info
        doctorId: "$doctor._id",
        doctorName: "$doctorUser.name",
        doctorEmail: "$doctorUser.email",
        specialization: "$doctor.specialization",
        consultationFee: "$doctor.consultationFee",
        // Patient info
        patientId: { $arrayElemAt: ["$patientUser._id", 0] },
        patientName: {
          $cond: {
            if: { $gt: [{ $size: "$patientUser" }, 0] },
            then: { $arrayElemAt: ["$patientUser.name", 0] },
            else: null,
          },
        },
        patientEmail: {
          $cond: {
            if: { $gt: [{ $size: "$patientUser" }, 0] },
            then: { $arrayElemAt: ["$patientUser.email", 0] },
            else: null,
          },
        },
        patientPhone: {
          $cond: {
            if: { $gt: [{ $size: "$patientUser" }, 0] },
            then: { $arrayElemAt: ["$patientUser.phone", 0] },
            else: null,
          },
        },
      },
    },
    { $sort: { date: -1, startTime: 1 } },
  ];

  // Run count + data in parallel
  const [countResult, appointments] = await Promise.all([
    DoctorSlot.aggregate([...pipeline, { $count: "total" }]),
    DoctorSlot.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]),
  ]);

  return {
    appointments,
    total: countResult[0]?.total ?? 0,
    page,
    limit,
    totalPages: Math.ceil((countResult[0]?.total ?? 0) / limit),
  };
};

