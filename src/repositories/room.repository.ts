import { prisma } from "../lib/prisma.js";
import type { Prisma, SalaTipo } from "../../generated/prisma/client.js";

export const roomRepository = {
  findAll() {
    return prisma.sala.findMany({ orderBy: { id: "asc" } });
  },

  findById(id: number) {
    return prisma.sala.findUnique({ where: { id } });
  },

  findByTypeAndNumber(tipo: SalaTipo, numero: number) {
    return prisma.sala.findUnique({ where: { tipo_numero: { tipo, numero } } });
  },

  countReservations(id: number) {
    return prisma.reserva.count({ where: { idSala: id } });
  },

  create(data: Prisma.SalaCreateInput) {
    return prisma.sala.create({ data });
  },

  update(id: number, data: Prisma.SalaUpdateInput) {
    return prisma.sala.update({ where: { id }, data });
  },

  delete(id: number) {
    return prisma.sala.delete({ where: { id } });
  },
};
