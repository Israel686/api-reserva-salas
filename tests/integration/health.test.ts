import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/app.js";

describe("GET /health", () => {
  it("responde 200 com status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});

describe("rota inexistente", () => {
  it("responde 404 com mensagem padronizada", async () => {
    const response = await request(app).get("/nao-existe");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Rota não encontrada" });
  });
});

describe("corpo malformado", () => {
  it("responde 400 quando o JSON é inválido", async () => {
    const response = await request(app)
      .post("/rooms")
      .set("Content-Type", "application/json")
      .send("{ isso nao e json");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "JSON inválido no corpo da requisição" });
  });
});
