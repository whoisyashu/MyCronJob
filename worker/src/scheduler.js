import cron from "node-cron";
import { Website } from "./models/index.js";
import checkWebsite from "./checker.js";

export default function startScheduler() {
  
  console.log("⏱ Worker scheduler started");

  cron.schedule("*/1 * * * *", async () => {
    console.log("🔄 Running website checks...");

    const websites = await Website.find();
    console.log(`🌐 Found ${websites.length} websites to check`);

    for (const website of websites) {
      await checkWebsite(website);
    }
  });
  
}
