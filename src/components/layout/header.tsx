"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition duration-500",
          scrolled || open
            ? "border-white/10 bg-ink/90 backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-[76px] max-w-shell items-center justify-between px-5 sm:px-8 lg:h-[88px] lg:px-12">
          <Logo />
          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-1 lg:flex"
          >
            {siteConfig.navigation.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-3 text-[0.67rem] font-semibold uppercase tracking-[0.14em] text-paper-muted transition hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper",
                    active && "text-paper",
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                  {active ? (
                    <span className="absolute inset-x-4 -bottom-[1px] h-px bg-paper" />
                  ) : null}
                </Link>
              );
            })}
            <Link
              className="ml-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-paper px-5 text-[0.67rem] font-semibold uppercase tracking-[0.14em] text-ink transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              href="/agenda"
            >
              Agendar <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </nav>
          <button
            aria-controls="mobile-menu"
            aria-expanded={open}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="grid size-11 place-items-center rounded-full border border-white/15 text-paper transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper lg:hidden"
            onClick={() => setOpen((value) => !value)}
            ref={closeButtonRef}
            type="button"
          >
            {open ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
          </button>
        </div>
      </header>
      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ opacity: 1 }}
            aria-modal="true"
            className="fixed inset-0 z-40 flex bg-ink px-5 pb-8 pt-28 sm:px-8 lg:hidden"
            exit={reduceMotion ? undefined : { opacity: 0 }}
            id="mobile-menu"
            initial={reduceMotion ? false : { opacity: 0 }}
            ref={menuRef}
            role="dialog"
          >
            <nav
              aria-label="Navegación móvil"
              className="flex w-full flex-col justify-between"
            >
              <div>
                {siteConfig.navigation.map((item, index) => (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                    key={item.href}
                    transition={{ delay: index * 0.045 }}
                  >
                    <Link
                      className="flex items-center justify-between border-b border-white/10 py-4 font-serif text-[clamp(2.3rem,11vw,4.6rem)] leading-none text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper"
                      href={item.href}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-6 text-paper-quiet"
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                <Link
                  className="button-light"
                  href="/agenda"
                  onClick={() => setOpen(false)}
                >
                  Agendar consulta{" "}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
                <Link
                  className="button-outline"
                  href="/contacto"
                  onClick={() => setOpen(false)}
                >
                  Contacto
                </Link>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
