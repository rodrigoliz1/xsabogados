"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Clock3, MessageCircle } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import {
  getPreviewTimeRemaining,
  PREVIEW_ACCESS_DEADLINE_LABEL,
  PREVIEW_ACCESS_EXPIRES_AT,
  PREVIEW_ACCESS_OWNER_URL,
  PREVIEW_ACCESS_WHATSAPP_URL,
  type PreviewTimeRemaining,
} from "@/lib/preview-access";

const emptyCountdown: Omit<PreviewTimeRemaining, "expired" | "totalSeconds"> = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const countdownUnits = [
  ["days", "Días"],
  ["hours", "Horas"],
  ["minutes", "Minutos"],
  ["seconds", "Segundos"],
] as const;

function formatUnit(value: number) {
  return String(value).padStart(2, "0");
}

export function PreviewAccessModal() {
  const [open, setOpen] = useState(true);
  const [remaining, setRemaining] = useState<PreviewTimeRemaining | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const reduceMotion = useReducedMotion();
  const countdown = remaining ?? emptyCountdown;
  const accessExpired = remaining?.expired === true;

  useEffect(() => {
    const updateCountdown = () => {
      setRemaining(getPreviewTimeRemaining(PREVIEW_ACCESS_EXPIRES_AT));
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!accessExpired) setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (
        event.shiftKey &&
        (active === first || active === dialogRef.current)
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [accessExpired, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[120] grid place-items-center overflow-y-auto bg-[#050505]/90 p-2 backdrop-blur-md sm:p-6"
          exit={reduceMotion ? undefined : { opacity: 0 }}
          initial={reduceMotion ? false : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
        >
          <motion.section
            animate={{ opacity: 1, y: 0, scale: 1 }}
            aria-describedby={descriptionId}
            aria-labelledby={titleId}
            aria-modal="true"
            className="relative my-auto grid max-h-[calc(100dvh-1rem)] w-full max-w-5xl overflow-y-auto rounded-[24px] border border-white/15 bg-[#0c0c0c] shadow-[0_32px_120px_rgba(0,0,0,0.62)] outline-none focus-visible:ring-1 focus-visible:ring-white/35 sm:max-h-[calc(100dvh-3rem)] sm:rounded-[28px] lg:grid-cols-[1.08fr_0.92fr]"
            exit={
              reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.985 }
            }
            initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.985 }}
            ref={dialogRef}
            role="dialog"
            tabIndex={-1}
            transition={{
              duration: reduceMotion ? 0 : 0.42,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="relative overflow-hidden border-b border-white/10 p-5 sm:p-9 lg:border-b-0 lg:border-r lg:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-32 -top-40 size-80 rounded-full border border-white/[0.055]"
              />
              <div className="relative">
                <div className="flex items-center justify-between gap-5 border-b border-white/10 pb-4 sm:pb-6">
                  <span className="font-serif text-3xl leading-none tracking-[-0.05em] text-paper">
                    XS
                  </span>
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-paper-quiet">
                    Acceso temporal
                  </span>
                </div>

                <h2
                  className="mt-6 max-w-lg font-serif text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.88] tracking-[-0.055em] text-paper sm:mt-8"
                  id={titleId}
                >
                  Vista previa restringida
                </h2>
                <div
                  className="mt-5 max-w-xl space-y-4 text-sm leading-6 text-paper-muted sm:mt-8 sm:space-y-5 sm:text-base sm:leading-7"
                  id={descriptionId}
                >
                  <p>
                    El presente proyecto se encuentra pendiente de conclusión,
                    por lo que el acceso completo se encuentra limitado.
                  </p>
                  <p>
                    Este sitio es propiedad de{" "}
                    <a
                      className="inline-flex items-center gap-1 border-b border-paper-muted/50 text-paper transition hover:border-paper hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-4 focus-visible:ring-offset-[#0c0c0c]"
                      href={PREVIEW_ACCESS_OWNER_URL}
                      rel="noreferrer"
                      target="_blank"
                    >
                      www.ipunto.digital
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-3.5"
                        strokeWidth={1.5}
                      />
                    </a>
                    , desarrollado por Rodrigo Lizárraga.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between p-5 sm:p-9 lg:p-12">
              <div>
                <div className="flex items-start gap-3">
                  <Clock3
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-paper-muted"
                    strokeWidth={1.5}
                  />
                  <p className="max-w-sm text-sm leading-6 text-paper-muted">
                    El acceso temporal a vista previa cesará en:
                  </p>
                </div>

                <div
                  aria-label={
                    remaining
                      ? `${remaining.days} días, ${remaining.hours} horas, ${remaining.minutes} minutos y ${remaining.seconds} segundos restantes`
                      : "Calculando tiempo restante"
                  }
                  className="mt-5 grid grid-cols-4 gap-2 sm:mt-7"
                  data-remaining-seconds={remaining?.totalSeconds ?? ""}
                  data-testid="preview-countdown"
                  role="timer"
                >
                  {countdownUnits.map(([key, label]) => (
                    <div
                      aria-hidden="true"
                      className="min-w-0 rounded-xl border border-white/10 bg-white/[0.035] px-1 py-3 text-center sm:px-2 sm:py-5"
                      key={key}
                    >
                      <span className="block font-serif text-[clamp(1.65rem,5vw,2.7rem)] tabular-nums leading-none text-paper">
                        {remaining ? formatUnit(countdown[key]) : "--"}
                      </span>
                      <span className="mt-2 block truncate text-[0.48rem] font-semibold uppercase tracking-[0.12em] text-paper-quiet sm:text-[0.55rem] sm:tracking-[0.16em]">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-[0.62rem] leading-5 text-paper-quiet sm:mt-4">
                  {PREVIEW_ACCESS_DEADLINE_LABEL}. Hora de Guadalajara.
                </p>

                <p className="mt-5 border-t border-white/10 pt-5 text-sm leading-6 text-paper-muted sm:mt-7 sm:pt-6">
                  Para liberar el sitio, favor de ponerse en contacto con
                  administración.
                </p>
              </div>

              <div className="mt-5 grid gap-3 sm:mt-7">
                <a
                  aria-label="Contactar a administración por WhatsApp"
                  className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-paper px-5 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-ink transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0c] active:scale-[0.98]"
                  href={PREVIEW_ACCESS_WHATSAPP_URL}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MessageCircle
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={1.5}
                  />
                  Contactar por WhatsApp
                </a>
                <button
                  className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full border border-white/20 px-4 text-[0.55rem] font-bold uppercase tracking-[0.09em] text-paper transition hover:border-white/45 hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:text-[0.6rem] sm:tracking-[0.12em]"
                  disabled={accessExpired}
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  {remaining?.expired
                    ? "Vista previa concluida"
                    : "Continuar Vista Previa Restringida"}
                </button>
              </div>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
