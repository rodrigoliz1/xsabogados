import type { Prisma } from "@prisma/client";
import { ArrowUpRight, DatabaseZap, UserRound } from "lucide-react";
import Link from "next/link";

import { AdminHeading, AdminStatus } from "@/components/admin/admin-primitives";
import { db } from "@/lib/db";

const teamSelect = {
  id: true,
  displayName: true,
  position: true,
  active: true,
  emailPublic: true,
  updatedAt: true,
  user: { select: { status: true } },
  areas: {
    select: {
      isPrimary: true,
      practiceArea: { select: { name: true, active: true } },
    },
  },
  _count: { select: { assignments: true, appointments: true } },
} satisfies Prisma.LawyerProfileSelect;

type TeamMember = Prisma.LawyerProfileGetPayload<{
  select: typeof teamSelect;
}>;

type TeamResult =
  | { kind: "ready"; members: TeamMember[] }
  | { kind: "unavailable"; message: string };

const accountStatusLabels: Record<string, string> = {
  ACTIVE: "Activa",
  INVITED: "Invitación pendiente",
  SUSPENDED: "Suspendida",
};

export const dynamic = "force-dynamic";

async function loadTeam(): Promise<TeamResult> {
  if (!process.env.DATABASE_URL?.trim()) {
    return {
      kind: "unavailable",
      message:
        "La base de datos no está configurada en este entorno. No se muestran perfiles simulados.",
    };
  }

  try {
    const members = await db.lawyerProfile.findMany({
      select: teamSelect,
      orderBy: [{ sortOrder: "asc" }, { displayName: "asc" }],
      take: 100,
    });
    return { kind: "ready", members };
  } catch {
    return {
      kind: "unavailable",
      message:
        "No fue posible consultar los perfiles. Verifica la conexión y que las migraciones estén aplicadas.",
    };
  }
}

export default async function TeamAdminPage() {
  const result = await loadTeam();

  return (
    <div className="space-y-8">
      <AdminHeading
        eyebrow="Organización"
        title="Equipo"
        description="Perfiles jurídicos, áreas asociadas y actividad registrada en el repositorio."
        action={
          <Link
            href="/equipo"
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-black/60 hover:border-black/20"
          >
            Ver equipo público <ArrowUpRight size={13} aria-hidden="true" />
          </Link>
        }
      />

      {result.kind === "unavailable" ? (
        <section className="rounded-2xl border border-dashed border-black/15 bg-white/60 px-6 py-12 text-center">
          <DatabaseZap
            className="mx-auto size-8 text-black/35"
            aria-hidden="true"
          />
          <h2 className="mt-5 font-serif text-2xl text-[#111]">
            Perfiles no disponibles
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-black/50">
            {result.message}
          </p>
        </section>
      ) : result.members.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-black/15 bg-white/60 px-6 py-12 text-center">
          <UserRound
            className="mx-auto size-8 text-black/35"
            aria-hidden="true"
          />
          <h2 className="mt-5 font-serif text-2xl text-[#111]">
            Sin perfiles registrados
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-black/50">
            Los integrantes creados en el repositorio aparecerán aquí. No se
            utilizan datos de demostración.
          </p>
        </section>
      ) : (
        <section
          aria-label="Perfiles del equipo"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {result.members.map((member) => {
            const areas = member.areas
              .filter((area) => area.practiceArea.active)
              .sort(
                (left, right) =>
                  Number(right.isPrimary) - Number(left.isPrimary),
              )
              .map((area) => area.practiceArea.name);

            return (
              <article
                key={member.id}
                className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(20,20,20,0.025)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-11 place-items-center rounded-full bg-[#eeeae2] text-[#292929]">
                    <UserRound size={18} aria-hidden="true" />
                  </span>
                  <AdminStatus tone={member.active ? "green" : "neutral"}>
                    {member.active ? "Activo" : "Inactivo"}
                  </AdminStatus>
                </div>
                <h2 className="mt-7 font-serif text-2xl">
                  {member.displayName}
                </h2>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#8b8b87]">
                  {member.position}
                </p>
                <p className="mt-4 min-h-10 text-xs leading-5 text-black/45">
                  {areas.length ? areas.join(" · ") : "Sin áreas asociadas"}
                </p>
                <div className="mt-5 border-t border-black/10 pt-4 text-[10px] leading-5 text-black/40">
                  <p>
                    {member._count.assignments}{" "}
                    {member._count.assignments === 1
                      ? "asunto asignado"
                      : "asuntos asignados"}{" "}
                    · {member._count.appointments}{" "}
                    {member._count.appointments === 1
                      ? "cita registrada"
                      : "citas registradas"}
                  </p>
                  <p>
                    Cuenta:{" "}
                    {member.user
                      ? (accountStatusLabels[member.user.status] ??
                        member.user.status)
                      : "Sin acceso vinculado"}
                  </p>
                  {member.emailPublic ? (
                    <a
                      className="mt-2 block truncate text-[#292929] hover:text-black"
                      href={`mailto:${member.emailPublic}`}
                    >
                      {member.emailPublic}
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
