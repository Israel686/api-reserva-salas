-- Renames every domain object from Portuguese to English, preserving existing data.

-- Enums
ALTER TYPE "Papel" RENAME TO "Role";
ALTER TYPE "Role" RENAME VALUE 'USUARIO' TO 'USER';

ALTER TYPE "StatusReserva" RENAME TO "ReservationStatus";
ALTER TYPE "ReservationStatus" RENAME VALUE 'ATIVA' TO 'ACTIVE';
ALTER TYPE "ReservationStatus" RENAME VALUE 'CANCELADA' TO 'CANCELLED';

ALTER TYPE "SalaTipo" RENAME TO "RoomType";
ALTER TYPE "RoomType" RENAME VALUE 'LABORATORIO' TO 'LABORATORY';
ALTER TYPE "RoomType" RENAME VALUE 'SALA' TO 'CLASSROOM';

-- Usuario -> User
ALTER TABLE "Usuario" RENAME TO "User";
ALTER TABLE "User" RENAME COLUMN "nome" TO "name";
ALTER TABLE "User" RENAME COLUMN "senhaHash" TO "passwordHash";
ALTER TABLE "User" RENAME COLUMN "papel" TO "role";

ALTER TABLE "User" RENAME CONSTRAINT "Usuario_pkey" TO "User_pkey";
ALTER INDEX "Usuario_email_key" RENAME TO "User_email_key";
ALTER SEQUENCE "Usuario_id_seq" RENAME TO "User_id_seq";

-- Sala -> Room
ALTER TABLE "Sala" RENAME TO "Room";
ALTER TABLE "Room" RENAME COLUMN "numero" TO "number";
ALTER TABLE "Room" RENAME COLUMN "tipo" TO "type";
ALTER TABLE "Room" RENAME COLUMN "ativa" TO "active";

ALTER TABLE "Room" RENAME CONSTRAINT "Sala_pkey" TO "Room_pkey";
ALTER INDEX "Sala_tipo_numero_key" RENAME TO "Room_type_number_key";
ALTER SEQUENCE "Sala_id_seq" RENAME TO "Room_id_seq";

-- Reserva -> Reservation
ALTER TABLE "Reserva" RENAME TO "Reservation";
ALTER TABLE "Reservation" RENAME COLUMN "idUsuario" TO "userId";
ALTER TABLE "Reservation" RENAME COLUMN "idSala" TO "roomId";
ALTER TABLE "Reservation" RENAME COLUMN "inicio" TO "start";
ALTER TABLE "Reservation" RENAME COLUMN "fim" TO "end";

ALTER TABLE "Reservation" RENAME CONSTRAINT "Reserva_pkey" TO "Reservation_pkey";
ALTER TABLE "Reservation" RENAME CONSTRAINT "Reserva_idUsuario_fkey" TO "Reservation_userId_fkey";
ALTER TABLE "Reservation" RENAME CONSTRAINT "Reserva_idSala_fkey" TO "Reservation_roomId_fkey";
ALTER SEQUENCE "Reserva_id_seq" RENAME TO "Reservation_id_seq";
