import { z } from "zod";
import { RoomType } from "../../generated/prisma/enums.js";

// Maior valor aceito pela coluna INT do PostgreSQL. Acima disso o banco
// recusa o valor (erro P2020) e a API responderia 500 em vez de 400.
export const MAX_INT = 2_147_483_647;

export const roomIdSchema = z.object({
  id: z.coerce
    .number({ error: "id deve ser um número" })
    .int("id deve ser um número inteiro")
    .positive("id deve ser maior que zero")
    .max(MAX_INT, `id deve ser no máximo ${MAX_INT}`),
});

export const createRoomSchema = z.object({
  number: z
    .number({ error: "number é obrigatório e deve ser um número" })
    .int("number deve ser um número inteiro")
    .positive("number deve ser maior que zero")
    .max(MAX_INT, `number deve ser no máximo ${MAX_INT}`),
  type: z.enum(RoomType, { error: "type deve ser LABORATORY ou CLASSROOM" }),
  active: z.boolean({ error: "active deve ser true ou false" }).optional(),
});

export const updateRoomSchema = createRoomSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar",
  });

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
