import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const MAX_PASSWORD_BYTES = 72;

export function assertPasswordLength(password: string) {
  if (Buffer.byteLength(password, "utf8") > MAX_PASSWORD_BYTES) {
    throw new Error(`A senha não pode ter mais de ${MAX_PASSWORD_BYTES} bytes`);
  }
}

export function hashPassword(password: string) {
  assertPasswordLength(password);

  return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
