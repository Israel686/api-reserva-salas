import "dotenv/config";
import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/lib/password.js";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de ambiente ${name} é obrigatória para o seed`);

  return value;
}

async function seedAdmin() {
  const email = requireEnv("ADMIN_EMAIL");
  const password = requireEnv("ADMIN_PASSWORD");
  const name = process.env.ADMIN_NAME ?? "Administrador";

  // update vazio pois rodar o seed de novo não sobrescreve a senha de um admin em uso.
  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, role: "ADMIN", passwordHash: await hashPassword(password) },
  });

  console.log(`Admin disponível: ${admin.email} (id ${admin.id})`);
}

seedAdmin()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
