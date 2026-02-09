import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) throw new Error("No token");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;

      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", socket => {
    console.log("🔌 WebSocket connected:", socket.userId);

    socket.join(socket.userId); // user-specific room

    socket.on("disconnect", () => {
      console.log("🔌 WebSocket disconnected:", socket.userId);
    });
  });
}

export function emitToUser(userId, event, payload) {
  if (!io) return;
  io.to(userId.toString()).emit(event, payload);
}
