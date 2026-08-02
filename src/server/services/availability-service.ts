import {
  addMinutes,
  DEFAULT_TIME_ZONE,
  generateAvailabilitySlots,
  getCalendarProvider,
  reservationResourceKey,
  weekdayForDate,
  zonedDateTimeToUtc,
  type AvailableSlot,
} from "@/lib/calendar";
import { db } from "@/lib/db";
import { ResourceNotFoundError } from "@/server/services/errors";
import {
  developmentAvailability,
  developmentMemoryEnabled,
} from "@/server/services/dev-memory";

export type AvailabilitySlotDetail = AvailableSlot & {
  durationMinutes: number;
  bufferMinutes: number;
  timezone: string;
  resourceKey: string;
  lawyerId?: string;
};

const FALLBACK_RULE = {
  startMinutes: 9 * 60,
  endMinutes: 18 * 60,
  durationMinutes: 45,
  bufferMinutes: 15,
  timezone: DEFAULT_TIME_ZONE,
};

export async function getAvailabilityDetails(input: {
  date: string;
  lawyerId?: string;
  now?: Date;
}): Promise<AvailabilitySlotDetail[]> {
  const weekday = weekdayForDate(input.date);
  if (weekday === 0 || weekday === 6) return [];
  if (developmentMemoryEnabled()) return developmentAvailability(input);

  let resolvedLawyerId: string | undefined;
  if (input.lawyerId) {
    const lawyer = await db.lawyerProfile.findFirst({
      where: {
        active: true,
        OR: [{ id: input.lawyerId }, { slug: input.lawyerId }],
      },
      select: { id: true },
    });
    if (!lawyer)
      throw new ResourceNotFoundError(
        "El profesional seleccionado no está disponible.",
      );
    resolvedLawyerId = lawyer.id;
  }

  const rules = await db.availabilityRule.findMany({
    where: {
      weekday,
      active: true,
      OR: resolvedLawyerId
        ? [{ lawyerId: resolvedLawyerId }, { lawyerId: null }]
        : [{ lawyerId: null }],
    },
    orderBy: { startMinutes: "asc" },
  });
  const specificRules = resolvedLawyerId
    ? rules.filter((rule) => rule.lawyerId === resolvedLawyerId)
    : [];
  const selectedRules =
    specificRules.length > 0
      ? specificRules
      : rules.filter((rule) => !rule.lawyerId);
  const effectiveRules =
    selectedRules.length > 0 ? selectedRules : [FALLBACK_RULE];
  const timezone = effectiveRules[0]?.timezone ?? DEFAULT_TIME_ZONE;
  const dayStart = zonedDateTimeToUtc(input.date, "00:00", timezone);
  const queryEnd = addMinutes(dayStart, 27 * 60);
  const resourceKey = reservationResourceKey(resolvedLawyerId);

  const [blocked, reservations, externalBusy] = await Promise.all([
    db.blockedTime.findMany({
      where: {
        startsAt: { lt: queryEnd },
        endsAt: { gt: dayStart },
        OR: resolvedLawyerId
          ? [{ lawyerId: resolvedLawyerId }, { lawyerId: null }]
          : [{ lawyerId: null }],
      },
      select: { startsAt: true, endsAt: true },
    }),
    db.appointmentReservationSlot.findMany({
      where: {
        resourceKey,
        startsAt: { gte: dayStart, lt: queryEnd },
      },
      select: { startsAt: true },
    }),
    getCalendarProvider().getBusyIntervals(dayStart, queryEnd),
  ]);

  const busyIntervals = [
    ...blocked,
    ...externalBusy,
    ...reservations.map(({ startsAt }) => ({
      startsAt,
      endsAt: addMinutes(startsAt, 15),
    })),
  ];
  const unique = new Map<string, AvailabilitySlotDetail>();

  for (const rule of effectiveRules) {
    const generated = generateAvailabilitySlots({
      date: input.date,
      rule,
      busyIntervals,
      now: input.now,
    });
    for (const slot of generated) {
      unique.set(slot.label, {
        ...slot,
        durationMinutes: rule.durationMinutes,
        bufferMinutes: rule.bufferMinutes,
        timezone: rule.timezone,
        resourceKey,
        lawyerId: resolvedLawyerId,
      });
    }
  }

  return [...unique.values()].sort(
    (left, right) => left.startsAt.getTime() - right.startsAt.getTime(),
  );
}

export async function getAvailableSlotLabels(input: {
  date: string;
  lawyerId?: string;
  now?: Date;
}) {
  return (await getAvailabilityDetails(input)).map((slot) => slot.label);
}
