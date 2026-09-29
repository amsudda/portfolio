import type { Metadata } from "next";
import { asc, desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { ProjectsManager } from "./projects-manager";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const [projects, clients] = await Promise.all([
    db.select().from(schema.projects).orderBy(asc(schema.projects.sortOrder), desc(schema.projects.updatedAt)),
    db
      .select({ id: schema.clients.id, name: schema.clients.name, sector: schema.clients.sector })
      .from(schema.clients)
      .orderBy(asc(schema.clients.name)),
  ]);
  return <ProjectsManager projects={projects} clients={clients} />;
}
