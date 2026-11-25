import type { Request, Response } from "express";
import { createRoomSchema, roomIdSchema, updateRoomSchema } from "../schemas/room.schema.js";
import { roomService } from "../services/room.service.js";

export const roomController = {
  async list(_req: Request, res: Response) {
    const rooms = await roomService.list();
    res.status(200).json(rooms);
  },

  async getById(req: Request, res: Response) {
    const { id } = roomIdSchema.parse(req.params);
    const room = await roomService.getById(id);
    res.status(200).json(room);
  },

  async create(req: Request, res: Response) {
    const data = createRoomSchema.parse(req.body ?? {});
    const room = await roomService.create(data);
    res.status(201).json(room);
  },

  async update(req: Request, res: Response) {
    const { id } = roomIdSchema.parse(req.params);
    const data = updateRoomSchema.parse(req.body ?? {});
    const room = await roomService.update(id, data);
    res.status(200).json(room);
  },

  async remove(req: Request, res: Response) {
    const { id } = roomIdSchema.parse(req.params);
    await roomService.remove(id);
    res.status(204).send();
  },
};
