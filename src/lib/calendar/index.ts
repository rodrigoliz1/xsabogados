import "server-only";

import { GoogleCalendarProvider } from "./google";
import { MockCalendarProvider } from "./mock";

export * from "./dates";
export * from "./slots";
export * from "./types";

export function getCalendarProvider() {
  const provider = process.env.CALENDAR_PROVIDER?.toLowerCase() || "mock";
  if (provider === "mock") {
    if (
      process.env.NODE_ENV === "production" &&
      process.env.VERCEL_ENV !== "preview"
    ) {
      throw new Error(
        "CALENDAR_PROVIDER=mock no está permitido en producción.",
      );
    }
    return new MockCalendarProvider();
  }

  if (provider === "google") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    if (!clientId || !clientSecret || !refreshToken || !calendarId) {
      throw new Error("La configuración de Google Calendar está incompleta.");
    }
    return new GoogleCalendarProvider({
      clientId,
      clientSecret,
      refreshToken,
      calendarId,
    });
  }

  throw new Error(`Proveedor de calendario no soportado: ${provider}`);
}
