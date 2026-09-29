import { count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/shell";
import { destroySession, requireUser } from "@/lib/auth/session";
import { db, schema } from "@/lib/db";

async function logout() {
  "use server";
  await destroySession();
  redirect("/admin/login");
}

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireUser();
  const [{ n }] = await db
    .select({ n: count() })
    .from(schema.enquiries)
    .where(eq(schema.enquiries.status, "new"));

  return (
    <AdminShell user={{ name: user.name, title: user.title }} newEnquiries={n} logout={logout}>
      {children}
    </AdminShell>
  );
}
