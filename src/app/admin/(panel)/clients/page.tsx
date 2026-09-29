import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { ClientsManager } from "./clients-manager";

export const metadata: Metadata = { title: "Clients" };

export default async function ClientsPage() {
  const clients = await db
    .select()
    .from(schema.clients)
    .orderBy(asc(schema.clients.sortOrder), asc(schema.clients.name));
  return <ClientsManager clients={clients} />;
}
