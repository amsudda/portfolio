import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { ShowreelManager } from "./showreel-manager";

export const metadata: Metadata = { title: "Showreel" };

export default async function ShowreelPage() {
  const [clips, clients, settings] = await Promise.all([
    db.select().from(schema.reelClips).orderBy(asc(schema.reelClips.position)),
    db.select({ id: schema.clients.id, name: schema.clients.name }).from(schema.clients).orderBy(asc(schema.clients.name)),
    getSettings(),
  ]);
  return (
    <ShowreelManager clips={clips} clients={clients} heroLoopUrl={settings.heroLoopUrl} heroPosterUrl={settings.heroPosterUrl} />
  );
}
