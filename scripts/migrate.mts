import { migrate } from "drizzle-orm/libsql/migrator";
import { client, db } from "./db.mts";

await migrate(db, { migrationsFolder: "./drizzle" });
console.log("✓ Database migrated");
client.close();
