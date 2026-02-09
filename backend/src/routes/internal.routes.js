import express from "express";
import { emitToUser } from "../socket.js";

const router = express.Router();

// Simple shared secret for internal calls
router.post("/events", (req, res) => {
  const secret = req.headers["x-internal-secret"];

  if (secret !== process.env.INTERNAL_SECRET) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { userId, event, payload } = req.body;

  emitToUser(userId, event, payload);

  res.json({ success: true });
});

export default router;
