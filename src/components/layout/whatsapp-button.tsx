"use client";

import { MessageCircleMore } from "lucide-react";

import { getWhatsAppUrl } from "@/config/site";

export function WhatsAppButton({
  href = getWhatsAppUrl(),
  firmName = "XS ABOGADOS",
}: {
  href?: string;
  firmName?: string;
}) {
  function trackClick() {
    window.dispatchEvent(
      new CustomEvent("xs:analytics", { detail: { event: "click_whatsapp" } }),
    );
  }

  return (
    <a
      aria-label={`Escribir a ${firmName} por WhatsApp`}
      className="group fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 flex min-h-12 items-center gap-2 rounded-full border border-white/15 bg-paper px-4 text-ink shadow-lift transition duration-300 hover:-translate-y-1 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] sm:right-6"
      href={href}
      onClick={trackClick}
      rel="noopener noreferrer"
      target="_blank"
      title="Escribir por WhatsApp"
    >
      <MessageCircleMore aria-hidden="true" className="size-5" />
      <span className="hidden text-[0.66rem] font-bold uppercase tracking-[0.14em] sm:inline">
        WhatsApp
      </span>
    </a>
  );
}
