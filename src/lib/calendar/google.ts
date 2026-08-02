import type {
  CalendarEventInput,
  CalendarProvider,
} from "@/lib/calendar/types";

type GoogleCalendarConfig = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  calendarId: string;
};

export class GoogleCalendarProvider implements CalendarProvider {
  readonly name = "google" as const;

  constructor(private readonly config: GoogleCalendarConfig) {}

  private async accessToken() {
    const body = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      refresh_token: this.config.refreshToken,
      grant_type: "refresh_token",
    });
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    if (!response.ok)
      throw new Error("No fue posible autenticar el calendario configurado.");
    const payload = (await response.json()) as { access_token?: string };
    if (!payload.access_token)
      throw new Error("Google no devolvió un token de calendario.");
    return payload.access_token;
  }

  private async request(path: string, init: RequestInit) {
    const token = await this.accessToken();
    return fetch(`https://www.googleapis.com/calendar/v3${path}`, {
      ...init,
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        ...init.headers,
      },
      cache: "no-store",
    });
  }

  async getBusyIntervals(startsAt: Date, endsAt: Date) {
    const response = await this.request("/freeBusy", {
      method: "POST",
      body: JSON.stringify({
        timeMin: startsAt.toISOString(),
        timeMax: endsAt.toISOString(),
        items: [{ id: this.config.calendarId }],
      }),
    });
    if (!response.ok)
      throw new Error(
        "No fue posible consultar la disponibilidad del calendario.",
      );
    const payload = (await response.json()) as {
      calendars?: Record<
        string,
        { busy?: Array<{ start: string; end: string }> }
      >;
    };
    return (payload.calendars?.[this.config.calendarId]?.busy ?? []).map(
      (item) => ({
        startsAt: new Date(item.start),
        endsAt: new Date(item.end),
      }),
    );
  }

  async createEvent(input: CalendarEventInput) {
    const response = await this.request(
      `/calendars/${encodeURIComponent(this.config.calendarId)}/events`,
      {
        method: "POST",
        body: JSON.stringify({
          summary: `Consulta XS ABOGADOS · ${input.practiceAreaName}`,
          description: `Referencia interna: ${input.reference}. No contiene la descripción del asunto.`,
          start: {
            dateTime: input.startsAt.toISOString(),
            timeZone: input.timezone,
          },
          end: {
            dateTime: input.endsAt.toISOString(),
            timeZone: input.timezone,
          },
          attendees: [
            { email: input.attendeeEmail, displayName: input.attendeeName },
          ],
          extendedProperties: { private: { xsReference: input.reference } },
        }),
      },
    );
    if (!response.ok)
      throw new Error(
        "No fue posible sincronizar la cita con Google Calendar.",
      );
    const payload = (await response.json()) as { id?: string };
    if (!payload.id)
      throw new Error(
        "Google Calendar no devolvió un identificador de evento.",
      );
    return { externalEventId: payload.id };
  }

  async cancelEvent(externalEventId: string) {
    const response = await this.request(
      `/calendars/${encodeURIComponent(this.config.calendarId)}/events/${encodeURIComponent(
        externalEventId,
      )}`,
      { method: "DELETE" },
    );
    if (!response.ok && response.status !== 404 && response.status !== 410) {
      throw new Error("No fue posible cancelar el evento de Google Calendar.");
    }
  }
}
