import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  fetchStatusLogs,
  fetchStatusSummary
} from "../controllers/status.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/:websiteId", fetchStatusLogs);
router.get("/:websiteId/summary", fetchStatusSummary);

export default router;
