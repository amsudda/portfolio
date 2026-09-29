import type { Metadata } from "next";
import { asc, desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { GalleryManager } from "./gallery-manager";

export const metadata: Metadata = { title: "Studio gallery" };

export default async function GalleryPage() {
  const [assets, clients] = await Promise.all([
    db.select().from(schema.mediaAssets).orderBy(asc(schema.mediaAssets.sortOrder), desc(schema.mediaAssets.createdAt)),
    db.select({ id: schema.clients.id, name: schema.clients.name }).from(schema.clients).orderBy(asc(schema.clients.name)),
  ]);
  return <GalleryManager assets={assets} clients={clients} />;
}
