import { CalendarDays, Clock3, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";

import { AppointmentWizard } from "@/components/appointments/appointment-wizard";
import { AppointmentManager } from "@/components/appointments/appointment-manager";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Agenda una consulta",
  description:
    "Solicita una consulta con XS ABOGADOS y selecciona área, modalidad, profesional, fecha y horario disponible.",
  alternates: { canonical: "/agenda" },
};

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const manageToken =
    typeof params.gestionar === "string" ? params.gestionar : "";
  const mexicoToday = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return (
    <div className="min-h-screen bg-ink pb-24 pt-28 text-paper lg:pb-32 lg:pt-36">
      <Container>
        <Breadcrumbs items={[{ label: "Agenda" }]} />
        <div className="mt-12 grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow text-paper-quiet">Consulta inicial</p>
            <h1 className="mt-6 text-balance font-serif text-6xl leading-[0.88] tracking-[-0.045em] sm:text-7xl lg:text-8xl">
              Claridad desde el primer paso.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-paper-muted sm:text-lg">
              Selecciona una fecha disponible y comparte únicamente el contexto
              general necesario para orientar la consulta.
            </p>
            <div className="mt-10 space-y-5 border-t border-white/10 pt-7 text-sm leading-6 text-paper-quiet">
              <p className="flex items-start gap-3">
                <CalendarDays
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-paper"
                />{" "}
                Horarios calculados en America/Mexico_City.
              </p>
              <p className="flex items-start gap-3">
                <Clock3
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-paper"
                />{" "}
                Duración estimada de 45 minutos.
              </p>
              <p className="flex items-start gap-3">
                <ShieldCheck
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-paper"
                />{" "}
                La firma confirmará disponibilidad y posibles conflictos.
              </p>
            </div>
          </div>
          {manageToken ? (
            <AppointmentManager baseDate={mexicoToday} token={manageToken} />
          ) : (
            <Suspense
              fallback={
                <div className="min-h-[650px] animate-pulse rounded-3xl border border-white/10 bg-white/[0.025] motion-reduce:animate-none" />
              }
            >
              <AppointmentWizard baseDate={mexicoToday} />
            </Suspense>
          )}
        </div>
      </Container>
    </div>
  );
}
