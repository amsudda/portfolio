/** Standalone DB handle for CLI scripts (the app's db module is server-only). */
import { mkdirSync } from "node:fs";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../src/lib/db/schema";

process.loadEnvFile?.(".env.local");

const url = process.env.DATABASE_URL ?? "file:./data/idearigs.db";
if (url.startsWith("file:")) mkdirSync("data", { recursive: true });

export const client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
export const db = drizzle(client, { schema });
export { schema };
