import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app.error.js";

const PRISMA_ERRORS: Record<string, { status: number; message: string }> = {
  P2002: { status: 409, message: "Já existe um registro com esses dados" },
  P2003: {
    status: 409,
    message: "Registro está vinculado a outros registros e não pode ser alterado ou excluído",
  },
  P2025: { status: 404, message: "Registro não encontrado" },
};

function prismaError(err: unknown) {
  if (typeof err !== "object" || err === null) return undefined;

  const code = (err as { code?: unknown }).code;
  return typeof code === "string" ? PRISMA_ERRORS[code] : undefined;
}

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
  
  const knownPrismaError = prismaError(err);
  if (knownPrismaError) {
    res.status(knownPrismaError.status).json({ message: knownPrismaError.message });
    return;
  }

  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ message: "JSON inválido no corpo da requisição" });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Erro interno do servidor" });
};
