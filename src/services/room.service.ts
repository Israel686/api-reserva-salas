import { AppError } from "../errors/app.error.js";
import { roomRepository } from "../repositories/room.repository.js";
import type { CreateRoomInput, UpdateRoomInput } from "../schemas/room.schema.js";
import type { RoomType } from "../../generated/prisma/client.js";

async function findOrFail(id: number) {
  const room = await roomRepository.findById(id);
  if (!room) throw new AppError(404, "Sala não encontrada");

  return room;
}

async function ensureUnique(type: RoomType, number: number, ignoreId?: number) {
  const existing = await roomRepository.findByTypeAndNumber(type, number);
  if (existing && existing.id !== ignoreId) {
    throw new AppError(409, `Já existe ${type} com o número ${number}`);
  }
}

export const roomService = {
  list() {
    return roomRepository.findAll();
  },

  getById(id: number) {
    return findOrFail(id);
  },

  async create(data: CreateRoomInput) {
    await ensureUnique(data.type, data.number);

    return roomRepository.create(data);
  },

  async update(id: number, data: UpdateRoomInput) {
    const room = await findOrFail(id);
    await ensureUnique(data.type ?? room.type, data.number ?? room.number, id);

    return roomRepository.update(id, data);
  },

  async remove(id: number) {
    await findOrFail(id);

    const reservations = await roomRepository.countReservations(id);
    if (reservations > 0) {
      throw new AppError(409, "Sala possui reservas e não pode ser excluída");
    }

    await roomRepository.delete(id);
  },
};
