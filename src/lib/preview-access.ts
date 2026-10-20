export const PREVIEW_ACCESS_OWNER_URL = "https://www.ipunto.digital";

const ADMIN_WHATSAPP_NUMBER = "526692122543";
const ADMIN_WHATSAPP_MESSAGE =
  "Hola, deseo ponerme en contacto con administración para liberar el sitio de XS ABOGADOS.";
const MILLISECONDS_PER_DAY = 86_400_000;
const MAX_PREVIEW_DAYS = 3_650;

export const PREVIEW_ACCESS_WHATSAPP_URL = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(ADMIN_WHATSAPP_MESSAGE)}`;

export type PreviewAccessConfig =
  { enabled: false } | { enabled: true; durationDays: number };

export type PreviewTimeRemaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  expired: boolean;
};

export function parsePreviewAccessConfig(
  value: string | undefined,
): PreviewAccessConfig {
  const normalized = value?.trim().toLowerCase();

  if (!normalized || normalized === "false") return { enabled: false };

  const match = /^true(\d+)$/.exec(normalized);
  if (!match) return { enabled: false };

  const durationDays = Number(match[1]);
  if (
    !Number.isSafeInteger(durationDays) ||
    durationDays < 1 ||
    durationDays > MAX_PREVIEW_DAYS
  ) {
    return { enabled: false };
  }

  return { enabled: true, durationDays };
}

export function createPreviewAccessDeadline(
  durationDays: number,
  now = new Date(),
) {
  return new Date(now.getTime() + durationDays * MILLISECONDS_PER_DAY);
}

export function getPreviewAccessStorageKey(
  instanceKey: string,
  durationDays: number,
) {
  return `xs-preview-access:v1:${encodeURIComponent(instanceKey)}:${durationDays}`;
}

export function formatPreviewAccessDeadline(deadline: string | Date) {
  const date = deadline instanceof Date ? deadline : new Date(deadline);

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(date);
}

export function getPreviewTimeRemaining(
  expiresAt: string | Date,
  now = new Date(),
): PreviewTimeRemaining {
  const deadline = expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
  const difference = Math.max(0, deadline.getTime() - now.getTime());
  const totalSeconds = Math.floor(difference / 1000);

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
    totalSeconds,
    expired: totalSeconds === 0,
  };
}
