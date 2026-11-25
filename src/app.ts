import express from "express";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import { roomRoutes } from "./routes/room.routes.js";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/rooms", roomRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
