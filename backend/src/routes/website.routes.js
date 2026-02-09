import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createWebsite,
  getWebsites,
  removeWebsite
} from "../controllers/website.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createWebsite);
router.get("/", getWebsites);
router.delete("/:id", removeWebsite);

export default router;
