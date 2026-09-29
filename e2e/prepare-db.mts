/** Resets the isolated e2e database and uploads, then migrates and seeds it. Run by the Playwright webServer. */
import { execSync } from "node:child_process";
import { rmSync } from "node:fs";

rmSync("data/e2e.db", { force: true });
rmSync("storage/e2e-uploads", { recursive: true, force: true });
execSync("npx tsx scripts/migrate.mts", { stdio: "inherit" });
execSync("npx tsx scripts/seed.mts --reset", { stdio: "inherit" });
