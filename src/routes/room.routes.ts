import { Router } from "express";
import { roomController } from "../controllers/room.controller.js";

export const roomRoutes = Router();

roomRoutes.get("/", roomController.list);
roomRoutes.get("/:id", roomController.getById);
roomRoutes.post("/", roomController.create);
roomRoutes.patch("/:id", roomController.update);
roomRoutes.delete("/:id", roomController.remove);
