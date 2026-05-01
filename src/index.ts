import express, { Express } from "express";
import mongoose from "mongoose";

const app: Express = express();

const db_url = process.env.DB_URL;
if (!db_url) {
  console.error("DB_URL not defined in env.");
  process.exit(1);
}
mongoose
  .connect(db_url)
  .then(() => console.info("Connected To MongoDb"))
  .catch((e) => console.error("Failed to Connect", e.message));

export default app;
