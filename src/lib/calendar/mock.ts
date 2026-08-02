import type {
  CalendarEventInput,
  CalendarProvider,
} from "@/lib/calendar/types";

export class MockCalendarProvider implements CalendarProvider {
  readonly name = "mock" as const;

  async getBusyIntervals() {
    return [];
  }

  async createEvent(input: CalendarEventInput) {
    return { externalEventId: `mock-${input.reference.toLowerCase()}` };
  }

  async cancelEvent() {
    return Promise.resolve();
  }
}
