import { spawnSync } from "node:child_process";
import path from "node:path";

const prismaCli = path.join(
  process.cwd(),
  "node_modules/prisma/build/index.js",
);
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://xs_build_placeholder:xs_build_placeholder@127.0.0.1:5433/xs_build_placeholder?schema=public";

const result = spawnSync(process.execPath, [prismaCli, "generate"], {
  env: { ...process.env, DATABASE_URL: databaseUrl },
  stdio: "inherit",
});

process.exit(result.status ?? 1);
