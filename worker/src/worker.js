import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import startScheduler from "./scheduler.js";

async function startWorker() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 Worker connected to MongoDB");
    console.log("EMAIL:", process.env.ALERT_EMAIL);
    console.log("PASS EXISTS:", !!process.env.ALERT_EMAIL_PASSWORD);


    startScheduler();
  } catch (error) {
    console.error("🔴 Worker failed to start", error);
    process.exit(1);
  }
}

startWorker();
