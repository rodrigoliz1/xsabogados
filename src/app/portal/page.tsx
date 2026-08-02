import { auth } from "@/auth";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import {
  getPublicSiteSettings,
  getSettingsWhatsAppUrl,
} from "@/server/services/site-settings-service";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarCheck2,
  FileLock2,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: BriefcaseBusiness,
    title: "Asuntos",
    text: "Estado, responsables y próximos pasos en un solo lugar.",
  },
  {
    icon: FileLock2,
    title: "Documentos",
    text: "Expediente digital organizado por asunto y categoría.",
  },
  {
    icon: CalendarCheck2,
    title: "Citas",
    text: "Agenda y confirmaciones vinculadas con su equipo legal.",
  },
  {
    icon: MessageSquareText,
    title: "Seguimiento",
    text: "Comunicación contextual, privada y sin perder el hilo.",
  },
];

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Portal del cliente",
  description:
    "Acceso privado para consultar asuntos, actuaciones, documentos, citas y mensajes de clientes de XS ABOGADOS.",
  alternates: { canonical: "/portal" },
};

export default async function PortalLandingPage() {
  const [session, settings] = await Promise.all([
    auth(),
    getPublicSiteSettings(),
  ]);
  const hasActiveSession = session?.user?.active === true;
  const destination = hasActiveSession
    ? "/portal/panel"
    : "/portal/iniciar-sesion";
  const cta = hasActiveSession ? "Continuar al panel" : "Iniciar sesión";

  return (
    <>
      <a
        className="fixed left-3 top-3 z-[100] -translate-y-24 rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink transition focus:translate-y-0"
        href="#contenido-portal"
      >
        Saltar al contenido
      </a>
      <Header />
      <main
        className="min-h-screen bg-[#080808] text-white"
        id="contenido-portal"
      >
        <section className="relative isolate overflow-hidden border-b border-white/10 px-5 pb-20 pt-28 sm:px-8 lg:px-12 lg:pb-28 lg:pt-36">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_25%,rgba(211,211,208,0.11),transparent_30%),linear-gradient(145deg,#080808,#111_55%,#080808)]" />
          <div className="pointer-events-none absolute inset-y-0 left-[11%] -z-10 w-px bg-gradient-to-b from-transparent via-white/[0.055] to-transparent" />
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.18fr_0.82fr] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d3d3d0]/25 bg-[#d3d3d0]/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#f7f7f5]">
                <ShieldCheck size={13} aria-hidden="true" />
                Acceso confidencial
              </span>
              <h1 className="mt-8 max-w-4xl font-serif text-[clamp(3.5rem,8vw,7.6rem)] leading-[0.82] tracking-[-0.055em]">
                Claridad en cada decisión.
              </h1>
            </div>
            <div className="border-l border-white/10 pl-6 sm:pl-8">
              <p className="max-w-md text-base leading-7 text-white/50">
                Un espacio privado para acompañar la evolución de sus asuntos,
                consultar documentos y mantener comunicación directa con XS
                Abogados.
              </p>
              <Link
                href={destination}
                className="group mt-8 inline-flex items-center gap-4 rounded-full bg-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[#ffffff]"
              >
                {cta}
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between border-b border-white/10 pb-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#d3d3d0]">
                  Su expediente digital
                </p>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                  Información útil, sin fricción.
                </h2>
              </div>
              <p className="hidden text-xs text-white/30 sm:block">
                Disponible para clientes autorizados
              </p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ icon: Icon, title, text }, index) => (
                <article
                  key={title}
                  className="min-h-60 bg-[#0d0d0d] p-6 sm:p-7"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid size-10 place-items-center rounded-full border border-white/10 text-[#d3d3d0]">
                      <Icon size={17} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span className="font-serif text-xl text-white/20">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-14 font-serif text-2xl">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/40">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer settings={settings} />
      <WhatsAppButton
        firmName={settings.firmName}
        href={getSettingsWhatsAppUrl(settings)}
      />
    </>
  );
}
