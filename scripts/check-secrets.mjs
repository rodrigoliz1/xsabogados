import { readFileSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";

const tracked = spawnSync(
  "git",
  ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
  {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  },
);
if (tracked.status !== 0) {
  console.error("No fue posible enumerar los archivos candidatos a versión.");
  process.exit(1);
}

const files = tracked.stdout.split("\0").filter(Boolean);
const forbiddenEnvironmentFiles = files.filter(
  (file) =>
    /(^|\/)\.env(?:\..+)?$/.test(file) &&
    !file.endsWith(".env.example") &&
    !file.endsWith(".env.test.example"),
);
const patterns = [
  ["AWS access key", /AKIA[0-9A-Z]{16}/g],
  ["GitHub token", /gh[pousr]_[A-Za-z0-9_]{30,}/g],
  ["Brevo API key", /xkeysib-[A-Za-z0-9_-]{40,}/g],
  ["Stripe live key", /sk_live_[A-Za-z0-9]{20,}/g],
  ["Private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
];
const findings = forbiddenEnvironmentFiles.map((file) => ({
  file,
  kind: "archivo de entorno real versionado",
}));

for (const file of files) {
  let stats;
  try {
    stats = statSync(file);
  } catch {
    continue;
  }
  if (!stats.isFile() || stats.size > 1_000_000) continue;
  let content;
  try {
    content = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  if (content.includes("\0")) continue;
  for (const [kind, pattern] of patterns) {
    pattern.lastIndex = 0;
    if (pattern.test(content)) findings.push({ file, kind });
  }
}

if (findings.length) {
  console.error("Se detectaron posibles secretos (no se muestran valores):");
  for (const finding of findings) {
    console.error(`- ${finding.file}: ${finding.kind}`);
  }
  process.exit(1);
}

console.log(
  `Escaneo local: ${files.length} archivos versionados o candidatos, sin hallazgos de alta confianza.`,
);
