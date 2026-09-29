import "server-only";
import bcrypt from "bcryptjs";

const ROUNDS = 12;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

// Compared against when the email is unknown, so response timing doesn't reveal
// which accounts exist.
let dummyHash: Promise<string> | undefined;

export async function verifyPassword(plain: string, hash: string | null | undefined): Promise<boolean> {
  if (!hash) {
    dummyHash ??= bcrypt.hash(crypto.randomUUID(), ROUNDS);
    await bcrypt.compare(plain, await dummyHash);
    return false;
  }
  return bcrypt.compare(plain, hash);
}
