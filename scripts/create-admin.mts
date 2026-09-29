/**
 * Creates or resets an admin account.
 *   npm run admin:create -- --email you@idearigs.lk --name "Ishara W." --title "Creative Director"
 * The password is read from ADMIN_PASSWORD or generated and printed once.
 */
import { parseArgs } from "node:util";
import bcrypt from "bcryptjs";
import { client, db, schema } from "./db.mts";

const { values } = parseArgs({
  options: {
    email: { type: "string" },
    name: { type: "string", default: "Admin" },
    title: { type: "string", default: "Team" },
  },
});

const email = values.email?.trim().toLowerCase();
if (!email || !email.includes("@")) {
  console.error('Usage: npm run admin:create -- --email you@idearigs.lk [--name "Name"] [--title "Role"]');
  process.exit(1);
}

const generated = !process.env.ADMIN_PASSWORD;
const password = process.env.ADMIN_PASSWORD ?? crypto.randomUUID().replace(/-/g, "").slice(0, 20);
if (password.length < 12) {
  console.error("ADMIN_PASSWORD must be at least 12 characters.");
  process.exit(1);
}

const passwordHash = await bcrypt.hash(password, 12);
await db
  .insert(schema.users)
  .values({ email, name: values.name!, title: values.title!, passwordHash })
  .onConflictDoUpdate({
    target: schema.users.email,
    set: { name: values.name!, title: values.title!, passwordHash, updatedAt: new Date() },
  });

console.log(`✓ Admin ready: ${email}`);
if (generated) console.log(`  Password (shown once): ${password}`);
client.close();
