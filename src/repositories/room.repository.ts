import { prisma } from "../lib/prisma.js";
import type { Prisma, RoomType } from "../../generated/prisma/client.js";

export const roomRepository = {
  findAll() {
    return prisma.room.findMany({ orderBy: { id: "asc" } });
  },

  findById(id: number) {
    return prisma.room.findUnique({ where: { id } });
  },

  findByTypeAndNumber(type: RoomType, number: number) {
    return prisma.room.findUnique({ where: { type_number: { type, number } } });
  },

  countReservations(id: number) {
    return prisma.reservation.count({ where: { roomId: id } });
  },

  create(data: Prisma.RoomCreateInput) {
    return prisma.room.create({ data });
  },

  update(id: number, data: Prisma.RoomUpdateInput) {
    return prisma.room.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.room.delete({ where: { id } });
  },
};
