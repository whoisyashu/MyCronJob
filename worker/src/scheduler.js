import cron from "node-cron";
import { Website } from "./models/index.js";
import checkWebsite from "./checker.js";

export default function startScheduler() {
  
  console.log("⏱ Worker scheduler started");

  cron.schedule("*/10 * * * *", async () => {

    const websites = await Website.find();

    for (const website of websites) {
      await checkWebsite(website);
    }
  });
  
}
