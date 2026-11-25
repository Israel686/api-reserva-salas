import { afterAll, beforeEach } from "vitest";
import { prisma } from "../../src/lib/prisma.js";
import { resetFactoryCounters } from "../helpers/factories.js";


beforeEach(async () => {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "Reservation", "Room", "User" RESTART IDENTITY CASCADE',
  );
  resetFactoryCounters();
});

afterAll(async () => {
  await prisma.$disconnect();
});
