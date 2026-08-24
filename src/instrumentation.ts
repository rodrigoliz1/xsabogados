export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || !process.env.VERCEL_ENV) return;
  const { assertRuntimeConfiguration } =
    await import("@/lib/runtime-configuration");
  assertRuntimeConfiguration();
}
