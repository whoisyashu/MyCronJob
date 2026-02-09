import fetch from "node-fetch";
import { sendDownAlert, sendRecoveryAlert } from "./mailer.js";
import { StatusLog, Website } from "./models/index.js";

export default async function checkWebsite(website) {
  const startTime = Date.now();
  let newStatus = "DOWN";
  let statusCode = null;

  try {
    const response = await fetch(website.url, { timeout: 5000 });
    statusCode = response.status;
    newStatus = response.ok ? "UP" : "DOWN";
  } catch (err) {
    newStatus = "DOWN";
  }

  const responseTimeMs = Date.now() - startTime;

  await StatusLog.create({
    websiteId: website._id,
    status: newStatus,
    statusCode,
    responseTimeMs
  });

  const prevStatus = website.currentStatus;

  if (prevStatus !== newStatus) {
    website.currentStatus = newStatus;
    website.lastStatusChangeAt = new Date();

    if (prevStatus === "UP" && newStatus === "DOWN") {
        console.log("📨 SENDING DOWN ALERT TO:", website.alertEmail);
        await sendDownAlert(website);
    }

    if (prevStatus === "DOWN" && newStatus === "UP") {
        console.log("📨 SENDING RECOVERY ALERT TO:", website.alertEmail);
        await sendRecoveryAlert(website);
    }

  }

  website.lastCheckedAt = new Date();
  await website.save();
}
