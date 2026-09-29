import type { Metadata } from "next";
import { asc, desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { MetaAdsManager } from "./meta-ads-manager";

export const metadata: Metadata = { title: "Meta ads data" };

export default async function MetaAdsPage() {
  const [records, clients] = await Promise.all([
    db.select().from(schema.adRecords).orderBy(desc(schema.adRecords.updatedAt)),
    db.select({ id: schema.clients.id, name: schema.clients.name }).from(schema.clients).orderBy(asc(schema.clients.name)),
  ]);
  return <MetaAdsManager records={records} clients={clients} />;
}
