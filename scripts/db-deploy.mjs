// Runs during `npm run build`, before `next build`.
//
// If DATABASE_URL is set (e.g. on Vercel with env vars configured), apply
// pending migrations and seed demo data so a fresh deployment comes up working.
//
// If DATABASE_URL is NOT set (e.g. a local `npm run build` with no .env, or a
// preview build without a database), skip both steps with a warning instead of
// failing — the app's pages are `dynamic = "force-dynamic"`, so `next build`
// never touches the database and still succeeds.

import { execSync } from "node:child_process";

const url = process.env.DATABASE_URL;

if (!url || url.trim() === "") {
  console.warn(
    "\n[db-deploy] DATABASE_URL is not set — skipping `prisma migrate deploy` and seed.\n" +
      "[db-deploy] The build will still complete. Set DATABASE_URL (and redeploy) to\n" +
      "[db-deploy] provision the database and load demo data.\n"
  );
  process.exit(0);
}

function run(cmd) {
  console.log(`[db-deploy] $ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

try {
  run("npx prisma migrate deploy");
  run("npx prisma db seed");
  console.log("[db-deploy] Database is migrated and seeded.\n");
} catch (err) {
  console.error("\n[db-deploy] Database setup failed:", err.message);
  process.exit(1);
}
