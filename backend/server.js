import dotenv from "dotenv";
dotenv.config();

import http from "http";
import mongoose from "mongoose";
import app from "./src/app.js";
import { initSocket } from "./src/socket.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize WebSocket server
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`🚀 Server + WebSocket running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start", error);
    process.exit(1);
  }
}

startServer();
