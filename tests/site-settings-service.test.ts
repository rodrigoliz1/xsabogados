import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const database = vi.hoisted(() => ({
  findUnique: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/db", () => ({
  db: {
    siteSettings: {
      findUnique: database.findUnique,
    },
  },
}));

import {
  defaultPublicSiteSettings,
  getPublicSiteSettings,
} from "@/server/services/site-settings-service";

describe("configuración pública del sitio", () => {
  beforeEach(() => {
    database.findUnique.mockReset();
    vi.stubEnv("DATABASE_URL", "postgresql://example.test/xs");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("mantiene disponible el sitio público si la base de datos falla", async () => {
    database.findUnique.mockRejectedValue(new Error("database unavailable"));
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(getPublicSiteSettings()).resolves.toEqual(
      defaultPublicSiteSettings,
    );
    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining('"event":"public-site-settings.defaulted"'),
    );
  });
});
