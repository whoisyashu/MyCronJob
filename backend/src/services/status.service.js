import StatusLog from "../models/statusLog.model.js";
import Website from "../models/websites.model.js";

export async function getStatusLogs(userId, websiteId, limit = 50) {
  const website = await Website.findOne({
    _id: websiteId,
    userId
  });

  if (!website) {
    throw new Error("Website not found");
  }

  return StatusLog.find({ websiteId })
    .sort({ checkedAt: -1 })
    .limit(limit);
}

export async function getStatusSummary(userId, websiteId) {
  const website = await Website.findOne({
    _id: websiteId,
    userId
  });

  if (!website) {
    throw new Error("Website not found");
  }

  const totalChecks = await StatusLog.countDocuments({ websiteId });
  const upChecks = await StatusLog.countDocuments({
    websiteId,
    status: "UP"
  });

  const uptimePercentage =
    totalChecks === 0 ? 0 : ((upChecks / totalChecks) * 100).toFixed(2);

  return {
    totalChecks,
    upChecks,
    downtimeCount: totalChecks - upChecks,
    uptimePercentage: Number(uptimePercentage)
  };
}
