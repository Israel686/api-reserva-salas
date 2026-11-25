import { z } from "zod";
import { RoomType } from "../../generated/prisma/enums.js";

export const roomIdSchema = z.object({
  id: z.coerce
    .number({ error: "id deve ser um número" })
    .int("id deve ser um número inteiro")
    .positive("id deve ser maior que zero"),
});

export const createRoomSchema = z.object({
  number: z
    .number({ error: "number é obrigatório e deve ser um número" })
    .int("number deve ser um número inteiro")
    .positive("number deve ser maior que zero"),
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
