import express from "express";
import authRoutes from "./routes/auth.routes.js";
import websiteRoutes from "./routes/website.routes.js";
import statusRoutes from "./routes/status.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cors from "cors";

const app = express();

app.use(cors());


app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/websites", websiteRoutes);
app.use("/api/status", statusRoutes);

app.use(errorMiddleware);

export default app;
