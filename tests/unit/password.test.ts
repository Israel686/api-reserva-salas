import { describe, expect, it } from "vitest";
import { MAX_PASSWORD_BYTES, hashPassword, verifyPassword } from "../../src/lib/password.js";

describe("hashPassword", () => {
  it("não devolve a senha em texto plano", async () => {
    const hash = await hashPassword("senha-secreta");

    expect(hash).not.toBe("senha-secreta");
    expect(hash).toMatch(/^\$2[aby]\$/);
  });

  it("gera hashes diferentes para a mesma senha", async () => {
    const [first, second] = await Promise.all([hashPassword("mesma"), hashPassword("mesma")]);

    expect(first).not.toBe(second);
  });

  it("rejeita senha acima do limite do bcrypt em vez de truncar", async () => {
    const tooLong = "a".repeat(MAX_PASSWORD_BYTES + 1);

    await expect(hashPassword(tooLong)).rejects.toThrow(/não pode ter mais de/);
  });

  it("conta o limite em bytes, não em caracteres", async () => {
  
    const multibyte = "é".repeat(37);

    expect(multibyte.length).toBeLessThanOrEqual(MAX_PASSWORD_BYTES);
    await expect(hashPassword(multibyte)).rejects.toThrow(/não pode ter mais de/);
  });
});

describe("verifyPassword", () => {
  it("aceita a senha correta", async () => {
    const hash = await hashPassword("senha-correta");

    await expect(verifyPassword("senha-correta", hash)).resolves.toBe(true);
  });

  it("rejeita a senha errada", async () => {
    const hash = await hashPassword("senha-correta");

    await expect(verifyPassword("senha-errada", hash)).resolves.toBe(false);
  });
});
