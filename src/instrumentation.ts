export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || !process.env.VERCEL_ENV) return;

  const [{ logger }, { validateRuntimeConfiguration }] = await Promise.all([
    import("@/lib/observability/logger"),
    import("@/lib/runtime-configuration"),
  ]);
  const report = validateRuntimeConfiguration();

  if (!report.valid) {
    logger.error("runtime.configuration.invalid", {
      stage: report.stage,
      missing: report.missing,
      invalid: report.invalid,
      warnings: report.warnings,
    });
  }
}
