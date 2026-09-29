import "server-only";
import { createClient, type Client as LibsqlClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { libsql?: LibsqlClient };

function createLibsqlClient() {
  return createClient({
    url: process.env.DATABASE_URL ?? "file:./data/idearigs.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
}

// Reuse one connection across hot reloads in development.
const client = globalForDb.libsql ?? createLibsqlClient();
if (process.env.NODE_ENV !== "production") globalForDb.libsql = client;

export const db = drizzle(client, { schema });
export { schema };
