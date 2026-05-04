import express, { Express } from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";

import authRouter from "./apps/auth/routes/auth.routes";
import tokenRoutes from "./apps/auth/routes/token.routes";
import errorHandler from "./utils/errorHandler";
import doctorRoutes from "./apps/doctor/routes/doctor.routes";
import slotRoutes from "./apps/booking/routes/booking.routes";
import adminRoutes from "./apps/admin/routes/admin.routes";

const app: Express = express();
const db_url = process.env.DB_URL;
if (!db_url) {
  console.error("DB_URL not defined in env.");
  process.exit(1);
}
mongoose
  .connect(db_url)
  .then(() => console.info("Connected To MongoDb"))
  .catch((e) => console.error("Failed to Connect", e.stack));

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: "https://doctor-booking-application-client.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/token", tokenRoutes);

app.use("/api/doctors", doctorRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

export default app;
