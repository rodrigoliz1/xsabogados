import { describe, expect, it } from "vitest";

import {
  createPreviewAccessDeadline,
  formatPreviewAccessDeadline,
  getPreviewAccessStorageKey,
  getPreviewTimeRemaining,
  parsePreviewAccessConfig,
  PREVIEW_ACCESS_WHATSAPP_URL,
} from "@/lib/preview-access";

describe("acceso temporal de vista previa", () => {
  it.each([undefined, "", "false", "true", "true0", "true-15", "otro"])(
    "permanece desactivado con el valor %s",
    (value) => {
      expect(parsePreviewAccessConfig(value)).toEqual({ enabled: false });
    },
  );

  it("activa el aviso y extrae los días de true{x}", () => {
    expect(parsePreviewAccessConfig(" true15 ")).toEqual({
      enabled: true,
      durationDays: 15,
    });
  });

  it("crea una ventana de exactamente los días configurados", () => {
    const startedAt = new Date("2026-10-20T10:47:28-06:00");
    const deadline = createPreviewAccessDeadline(15, startedAt);

    expect(getPreviewTimeRemaining(deadline, startedAt)).toMatchObject({
      days: 15,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: false,
    });
    expect(formatPreviewAccessDeadline(deadline)).toContain(
      "4 de noviembre de 2026",
    );
  });

  it("se detiene en cero al concluir el acceso", () => {
    expect(
      getPreviewTimeRemaining(
        new Date("2026-11-04T10:47:28-06:00"),
        new Date("2026-11-05T10:47:28-06:00"),
      ),
    ).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      expired: true,
    });
  });

  it("separa el vencimiento por deployment y duración", () => {
    expect(getPreviewAccessStorageKey("deployment-a", 15)).not.toBe(
      getPreviewAccessStorageKey("deployment-b", 15),
    );
    expect(getPreviewAccessStorageKey("deployment-a", 15)).not.toBe(
      getPreviewAccessStorageKey("deployment-a", 30),
    );
  });

  it("dirige al número mexicano de administración", () => {
    expect(PREVIEW_ACCESS_WHATSAPP_URL).toContain("wa.me/526692122543");
  });
});
