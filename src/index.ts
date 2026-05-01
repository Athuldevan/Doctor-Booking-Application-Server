import express, { Express } from "express";
import cookieParser from 'cookie-parser'
import mongoose from "mongoose";

import authRouter from "./apps/auth/routes/auth.routes"
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

  app.use(cookieParser())
  app.use(express.json({ limit: "10mb" }));

  
  app.use("/api/auth", authRouter)

export default app;
