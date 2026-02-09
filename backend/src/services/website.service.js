import Website from "../models/websites.model.js";
import User from "../models/user.model.js";

export async function addWebsite(userId, url, alertEmail) {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const websiteCount = await Website.countDocuments({ userId });

  if (user.plan === "FREE" && websiteCount >= 3) {
    throw new Error("Free plan allows only 3 websites");
  }

  const website = await Website.create({
    userId,
    url,
    alertEmail
  });

  return website;
}

export async function listWebsites(userId) {
  return Website.find({ userId }).sort({ createdAt: -1 });
}

export async function deleteWebsite(userId, websiteId) {
  const website = await Website.findOne({
    _id: websiteId,
    userId
  });

  if (!website) {
    throw new Error("Website not found");
  }

  await website.deleteOne();
}
