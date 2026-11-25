import { execFileSync } from "node:child_process";
import { Client } from "pg";


export default async function globalSetup() {
  const url = new URL(requireTestDatabaseUrl());
  const database = decodeURIComponent(url.pathname.slice(1));

  await createDatabaseIfMissing(url, database);

  execFileSync("npx", ["prisma", "migrate", "deploy"], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
}

function requireTestDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida. Crie um .env.test.");

  if (!url.includes("test")) {
    throw new Error(
      `Recusando rodar os testes contra "${url}": o nome do banco precisa conter "test".`,
    );
  }

  return url;
}

async function createDatabaseIfMissing(url: URL, database: string) {
  const maintenance = new URL(url.toString());
  maintenance.pathname = "/postgres";
  maintenance.search = "";

  const client = new Client({ connectionString: maintenance.toString() });
  await client.connect();

  try {
    const { rowCount } = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [
      database,
    ]);

    if (rowCount === 0) {
      await client.query(`CREATE DATABASE "${database.replace(/"/g, '""')}"`);
    }
  } finally {
    await client.end();
  }
}
