import { prisma } from "../../src/lib/prisma.js";
import { hashPassword } from "../../src/lib/password.js";
import type { Prisma } from "../../generated/prisma/client.js";

let roomNumber = 0;
let userCount = 0;

export function resetFactoryCounters() {
  roomNumber = 0;
  userCount = 0;
}

export function createRoom(overrides: Partial<Prisma.RoomCreateInput> = {}) {
  roomNumber += 1;

  return prisma.room.create({
    data: { number: roomNumber, type: "CLASSROOM", ...overrides },
  });
}

export async function createUser(overrides: Partial<Prisma.UserCreateInput> = {}) {
  userCount += 1;

  return prisma.user.create({
    data: {
      name: `Usuário ${userCount}`,
      email: `usuario${userCount}@exemplo.com`,
      passwordHash: await hashPassword("senha-de-teste"),
      ...overrides,
    },
  });
}

export async function createReservation(overrides: Partial<Prisma.ReservationCreateInput> = {}) {
  const [user, room] = await Promise.all([createUser(), createRoom()]);

  return prisma.reservation.create({
    data: {
      user: { connect: { id: user.id } },
      room: { connect: { id: room.id } },
      start: new Date("2026-01-01T08:00:00Z"),
      end: new Date("2026-01-01T10:00:00Z"),
      ...overrides,
    },
  });
}
