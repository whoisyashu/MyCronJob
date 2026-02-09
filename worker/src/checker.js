import fetch from "node-fetch";
import { sendDownAlert, sendRecoveryAlert } from "./mailer.js";
import { StatusLog, Website } from "./models/index.js";
import { emitEventToBackend } from "./socketEmitter.js";



async function pingWebsite(url) {
  const start = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal
    });

    clearTimeout(timeout);

    return {
      status: response.ok ? "UP" : "DOWN",
      statusCode: response.status,
      responseTimeMs: Date.now() - start
    };
  } catch (err) {
    return {
      status: "DOWN",
      statusCode: null,
      responseTimeMs: Date.now() - start
    };
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function checkWebsite(website) {
  console.log(`➡️ Checking website: ${website.url}`);

  let result = await pingWebsite(website.url);

  if (result.status === "DOWN") {
    console.log(`🔁 Retry check for ${website.url} in 5s`);
    await sleep(5000);
    result = await pingWebsite(website.url);
  }

  const newStatus = result.status;
  const prevStatus = website.currentStatus;

  await StatusLog.create({
    websiteId: website._id,
    status: newStatus,
    statusCode: result.statusCode,
    responseTimeMs: result.responseTimeMs
  });

  if (prevStatus !== newStatus) {
    website.currentStatus = newStatus;
    website.lastStatusChangeAt = new Date();

    if (prevStatus === "UP" && newStatus === "DOWN") {
        await sendDownAlert(website);

        await emitEventToBackend({
          userId: website.userId,
          event: "WEBSITE_DOWN",
          payload: {
            websiteId: website._id,
            url: website.url,
            time: new Date()
          }
        });

    }

    if (prevStatus === "DOWN" && newStatus === "UP") {
        await sendRecoveryAlert(website);

        await emitEventToBackend({
          userId: website.userId,
          event: "WEBSITE_RECOVERED",
          payload: {
            websiteId: website._id,
            url: website.url,
            time: new Date()
          }
        });
    }

  }

  website.lastCheckedAt = new Date();
  await website.save();

}

