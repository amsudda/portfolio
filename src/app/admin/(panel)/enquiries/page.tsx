import type { Metadata } from "next";
import { count, desc, gte, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { EnquiriesManager } from "./enquiries-manager";

export const metadata: Metadata = { title: "Enquiries" };

export default async function EnquiriesPage() {
  const [enquiries, [{ recent }]] = await Promise.all([
    db.select().from(schema.enquiries).orderBy(desc(schema.enquiries.createdAt)).limit(500),
    db
      .select({ recent: count() })
      .from(schema.enquiries)
      .where(gte(schema.enquiries.createdAt, sql`(unixepoch() - 30 * 86400) * 1000`)),
  ]);
  return <EnquiriesManager enquiries={enquiries} recentCount={recent} />;
}
