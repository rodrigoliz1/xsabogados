import { ArrowLeft, CalendarDays } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/layout/logo";

export default function NotFound() {
  return (
    <main className="paper-grid relative grid min-h-screen place-items-center overflow-hidden bg-ink px-5 py-16 text-paper">
      <span
        aria-hidden="true"
        className="absolute font-serif text-[min(70vw,42rem)] leading-none text-white/[0.035]"
      >
        404
      </span>
      <div className="relative z-10 max-w-2xl text-center">
        <Logo className="mx-auto w-fit" />
        <p className="eyebrow mt-14 text-paper-quiet">Página no encontrada</p>
        <h1 className="mt-6 text-balance font-serif text-6xl leading-[0.9] tracking-[-0.05em] sm:text-8xl">
          Esta ruta no forma parte del expediente.
        </h1>
        <p className="mx-auto mt-7 max-w-lg leading-7 text-paper-muted">
          La dirección pudo cambiar o el contenido ya no está disponible. Puedes
          volver al inicio o solicitar una consulta.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="button-outline" href="/">
            <ArrowLeft aria-hidden="true" className="size-4" /> Volver al inicio
          </Link>
          <Link className="button-light" href="/agenda">
            <CalendarDays aria-hidden="true" className="size-4" /> Agenda una
            consulta
          </Link>
        </div>
      </div>
    </main>
  );
}
