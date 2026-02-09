import {
  addWebsite,
  listWebsites,
  deleteWebsite
} from "../services/website.service.js";

export async function createWebsite(req, res, next) {
  try {
    const { url, alertEmail } = req.body;

    if (!url || !alertEmail) {
        return res.status(400).json({
            message: "Website URL and alert email are required"
        });
    }

    const website = await addWebsite(req.user.id, url, alertEmail);
    res.status(201).json(website);
  } catch (error) {
    next(error);
  }
}

export async function getWebsites(req, res, next) {
  try {
    const websites = await listWebsites(req.user.id);
    res.json(websites);
  } catch (error) {
    next(error);
  }
}

export async function removeWebsite(req, res, next) {
  try {
    await deleteWebsite(req.user.id, req.params.id);
    res.json({ message: "Website deleted successfully" });
  } catch (error) {
    next(error);
  }
}
