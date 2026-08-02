import Link from "next/link";
import type { Metadata } from "next";

import { WhatsAppButton } from "@/components/layout/whatsapp-button";

export const metadata: Metadata = {
  title: "Acceso al portal",
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        className="fixed left-3 top-3 z-[100] -translate-y-24 rounded-full bg-paper px-4 py-2 text-sm font-semibold text-ink transition focus:translate-y-0"
        href="#contenido-auth"
      >
        Saltar al contenido
      </a>
      <div className="relative min-h-screen overflow-hidden bg-[#080808] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-24 size-[420px] rounded-full bg-[#d3d3d0]/[0.06] blur-[100px]" />
          <div className="absolute bottom-0 right-0 h-[55%] w-[48%] bg-[linear-gradient(145deg,transparent,rgba(255,255,255,0.025))]" />
          <div className="absolute inset-y-0 left-[15%] w-px bg-gradient-to-b from-transparent via-white/[0.055] to-transparent" />
          <div className="absolute inset-y-0 right-[17%] w-px bg-gradient-to-b from-transparent via-white/[0.035] to-transparent" />
        </div>

        <header className="relative z-10 flex items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="inline-flex items-center gap-4"
            aria-label="XS Abogados · Inicio"
          >
            <span className="font-serif text-4xl tracking-[-0.07em]">XS</span>
            <span className="h-7 w-px bg-white/20" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50">
              Abogados
            </span>
          </Link>
          <Link
            href="/portal"
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 transition-colors hover:text-white"
          >
            Conocer el portal
          </Link>
        </header>

        <main
          className="relative z-10 flex min-h-[calc(100vh-92px)] items-center justify-center px-4 pb-12 sm:px-6"
          id="contenido-auth"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
      <WhatsAppButton />
    </>
  );
}
