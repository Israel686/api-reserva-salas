import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/app.js";
import { prisma } from "../../src/lib/prisma.js";
import { createReservation, createRoom } from "../helpers/factories.js";

describe("GET /rooms", () => {
  it("devolve lista vazia quando não há salas", async () => {
    const response = await request(app).get("/rooms");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("devolve as salas ordenadas por id", async () => {
    await createRoom({ number: 10 });
    await createRoom({ number: 5 });

    const response = await request(app).get("/rooms");

    expect(response.status).toBe(200);
    expect(response.body.map((room: { number: number }) => room.number)).toEqual([10, 5]);
  });
});

describe("GET /rooms/:id", () => {
  it("devolve a sala existente", async () => {
    const room = await createRoom({ number: 101, type: "LABORATORY" });

    const response = await request(app).get(`/rooms/${room.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ id: room.id, number: 101, type: "LABORATORY" });
  });

  it("responde 404 quando a sala não existe", async () => {
    const response = await request(app).get("/rooms/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Sala não encontrada" });
  });

  it("responde 400 quando o id não é numérico", async () => {
    const response = await request(app).get("/rooms/abc");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Dados inválidos");
    expect(response.body.errors).toContainEqual({
      field: "id",
      message: "id deve ser um número",
    });
  });

  it("responde 400 quando o id é negativo", async () => {
    const response = await request(app).get("/rooms/-1");

    expect(response.status).toBe(400);
  });
});

describe("POST /rooms", () => {
  it("cria a sala e responde 201", async () => {
    const response = await request(app).post("/rooms").send({ number: 201, type: "CLASSROOM" });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ number: 201, type: "CLASSROOM", active: true });
    expect(response.body.id).toEqual(expect.any(Number));

    await expect(prisma.room.count()).resolves.toBe(1);
  });

  it("respeita o active enviado", async () => {
    const response = await request(app)
      .post("/rooms")
      .send({ number: 202, type: "LABORATORY", active: false });

    expect(response.status).toBe(201);
    expect(response.body.active).toBe(false);
  });

  it("preenche createdAt e updatedAt", async () => {
    const response = await request(app).post("/rooms").send({ number: 203, type: "CLASSROOM" });

    expect(Date.parse(response.body.createdAt)).not.toBeNaN();
    expect(Date.parse(response.body.updatedAt)).not.toBeNaN();
  });

  it("responde 409 ao repetir o par type + number", async () => {
    await createRoom({ number: 301, type: "CLASSROOM" });

    const response = await request(app).post("/rooms").send({ number: 301, type: "CLASSROOM" });

    expect(response.status).toBe(409);
    expect(response.body.message).toMatch(/Já existe/);
    await expect(prisma.room.count()).resolves.toBe(1);
  });

  it("permite o mesmo número em tipos diferentes", async () => {
    await createRoom({ number: 301, type: "CLASSROOM" });

    const response = await request(app).post("/rooms").send({ number: 301, type: "LABORATORY" });

    expect(response.status).toBe(201);
  });

  it("responde 400 quando faltam campos obrigatórios", async () => {
    const response = await request(app).post("/rooms").send({});

    expect(response.status).toBe(400);
    expect(response.body.errors.map((error: { field: string }) => error.field)).toEqual(
      expect.arrayContaining(["number", "type"]),
    );
  });

  it("responde 400 quando o type não é um valor do enum", async () => {
    const response = await request(app).post("/rooms").send({ number: 1, type: "AUDITORIO" });

    expect(response.status).toBe(400);
  });

  it("responde 400 quando o number não é inteiro positivo", async () => {
    const response = await request(app).post("/rooms").send({ number: -3, type: "CLASSROOM" });

    expect(response.status).toBe(400);
  });

  it("ignora campos desconhecidos em vez de persisti-los", async () => {
    const response = await request(app)
      .post("/rooms")
      .send({ number: 400, type: "CLASSROOM", id: 999, hackeado: true });

    expect(response.status).toBe(201);
    expect(response.body.id).not.toBe(999);
    expect(response.body).not.toHaveProperty("hackeado");
  });
});

describe("PATCH /rooms/:id", () => {
  it("atualiza apenas os campos enviados", async () => {
    const room = await createRoom({ number: 10, type: "CLASSROOM", active: true });

    const response = await request(app).patch(`/rooms/${room.id}`).send({ active: false });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ number: 10, type: "CLASSROOM", active: false });
  });

  it("responde 400 quando o corpo está vazio", async () => {
    const room = await createRoom();

    const response = await request(app).patch(`/rooms/${room.id}`).send({});

    expect(response.status).toBe(400);
    expect(response.body.errors[0].message).toBe("Informe ao menos um campo para atualizar");
  });

  it("responde 404 quando a sala não existe", async () => {
    const response = await request(app).patch("/rooms/999").send({ active: false });

    expect(response.status).toBe(404);
  });

  it("responde 409 ao colidir com outra sala", async () => {
    await createRoom({ number: 1, type: "CLASSROOM" });
    const alvo = await createRoom({ number: 2, type: "CLASSROOM" });

    const response = await request(app).patch(`/rooms/${alvo.id}`).send({ number: 1 });

    expect(response.status).toBe(409);
  });

  it("permite reenviar os próprios valores sem conflitar consigo mesma", async () => {
    const room = await createRoom({ number: 7, type: "CLASSROOM" });

    const response = await request(app)
      .patch(`/rooms/${room.id}`)
      .send({ number: 7, type: "CLASSROOM" });

    expect(response.status).toBe(200);
  });
});

describe("DELETE /rooms/:id", () => {
  it("remove a sala e responde 204", async () => {
    const room = await createRoom();

    const response = await request(app).delete(`/rooms/${room.id}`);

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
    await expect(prisma.room.count()).resolves.toBe(0);
  });

  it("responde 404 quando a sala não existe", async () => {
    const response = await request(app).delete("/rooms/999");

    expect(response.status).toBe(404);
  });

  it("responde 409 quando a sala tem reservas", async () => {
    const reservation = await createReservation();

    const response = await request(app).delete(`/rooms/${reservation.roomId}`);

    expect(response.status).toBe(409);
    expect(response.body.message).toMatch(/possui reservas/);
    await expect(prisma.room.count()).resolves.toBe(1);
  });
});

describe("PUT /rooms/:id", () => {
  it("não está implementado, pois a atualização é parcial", async () => {
    const room = await createRoom();

    const response = await request(app).put(`/rooms/${room.id}`).send({ active: false });

    expect(response.status).toBe(404);
  });
});
