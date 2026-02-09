import {
  getStatusLogs,
  getStatusSummary
} from "../services/status.service.js";

export async function fetchStatusLogs(req, res, next) {
  try {
    const { websiteId } = req.params;
    const limit = Number(req.query.limit) || 50;

    const logs = await getStatusLogs(req.user.id, websiteId, limit);
    res.json(logs);
  } catch (error) {
    next(error);
  }
}

export async function fetchStatusSummary(req, res, next) {
  try {
    const { websiteId } = req.params;

    const summary = await getStatusSummary(req.user.id, websiteId);
    res.json(summary);
  } catch (error) {
    next(error);
  }
}
