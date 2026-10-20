import { afterEach, describe, expect, it, vi } from "vitest";

import { register } from "@/instrumentation";

describe("instrumentación de runtime", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("reporta una configuración inválida sin impedir que la función inicie", async () => {
    vi.stubEnv("NEXT_RUNTIME", "nodejs");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("AUTH_SECRET", "");
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("DIRECT_URL", "");
    vi.stubEnv("EMAIL_PROVIDER", "mock");
    vi.stubEnv("CALENDAR_PROVIDER", "mock");
    vi.stubEnv("STORAGE_PROVIDER", "local");
    vi.stubEnv("FILE_SCANNER_PROVIDER", "mock");
    vi.stubEnv("RATE_LIMIT_PROVIDER", "memory");
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(register()).resolves.toBeUndefined();

    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('"event":"runtime.configuration.invalid"'),
    );
  });
});
