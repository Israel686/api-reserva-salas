import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app.error.js";

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Dados inválidos",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ message: "JSON inválido no corpo da requisição" });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Erro interno do servidor" });
};
