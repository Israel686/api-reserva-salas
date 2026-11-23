import { z } from "zod";
import { SalaTipo } from "../../generated/prisma/enums.js";

export const roomIdSchema = z.object({
  id: z.coerce
    .number({ error: "id deve ser um número" })
    .int("id deve ser um número inteiro")
    .positive("id deve ser maior que zero"),
});

export const createRoomSchema = z.object({
  numero: z
    .number({ error: "numero é obrigatório e deve ser um número" })
    .int("numero deve ser um número inteiro")
    .positive("numero deve ser maior que zero"),
  tipo: z.enum(SalaTipo, { error: "tipo deve ser LABORATORIO ou SALA" }),
  ativa: z.boolean({ error: "ativa deve ser true ou false" }).optional(),
});

export const updateRoomSchema = createRoomSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
