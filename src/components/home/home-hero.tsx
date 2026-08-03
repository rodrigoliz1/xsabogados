"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/container";

export function HomeHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="noise paper-grid relative flex min-h-[100svh] overflow-hidden bg-ink pb-10 pt-28 text-paper sm:pt-32 lg:pt-36">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <motion.span
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          className="absolute -right-[0.08em] top-[10vh] font-serif text-[min(77vw,65rem)] font-light leading-none tracking-[-0.12em] text-white/[0.026]"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          S
        </motion.span>
        <motion.span
          animate={reduceMotion ? undefined : { opacity: 1, rotate: 33 }}
          className="absolute left-[62%] top-[-18%] h-[135%] w-px origin-center bg-gradient-to-b from-transparent via-white/30 to-transparent"
          initial={reduceMotion ? false : { opacity: 0, rotate: 22 }}
          transition={{ delay: 0.25, duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          animate={reduceMotion ? undefined : { opacity: 1, rotate: -33 }}
          className="absolute left-[62%] top-[-18%] h-[135%] w-px origin-center bg-gradient-to-b from-transparent via-white/20 to-transparent"
          initial={reduceMotion ? false : { opacity: 0, rotate: -22 }}
          transition={{ delay: 0.4, duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <Container className="relative z-10 flex flex-1 flex-col justify-between">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-paper-quiet"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <span className="h-px w-9 bg-paper-quiet" /> Guadalajara · México
        </motion.div>
        <div className="mt-20 max-w-6xl pb-10 lg:mt-28">
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow text-paper-quiet"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            XS ABOGADOS · Estrategia jurídica · Precisión técnica
          </motion.p>
          <h1 className="mt-7 max-w-[15ch] text-balance font-serif text-[clamp(4.15rem,10.5vw,10rem)] font-normal leading-[0.78] tracking-[-0.065em]">
            {[
              "Soluciones jurídicas",
              "con visión estratégica",
            ].map((line, index) => (
              <span className="block overflow-hidden pb-[0.09em]" key={line}>
                <motion.span
                  animate={{ y: "0%" }}
                  className="block"
                  initial={reduceMotion ? false : { y: "110%" }}
                  transition={{
                    delay: 0.25 + index * 0.11,
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-9 grid gap-7 border-t border-white/15 pt-7 md:grid-cols-[1fr_auto] md:items-end"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            transition={{ delay: 0.75, duration: 0.75 }}
          >
            <p className="max-w-2xl text-pretty text-base leading-7 text-paper-muted sm:text-lg sm:leading-8">
              Diseñamos soluciones legales precisas para empresas, instituciones
              y personas que enfrentan decisiones complejas.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link className="button-outline" href="/firma">
                Conocer la firma
              </Link>
              <Link
                className="button-light"
                data-analytics="click_agendar"
                href="/agenda"
              >
                Agendar una consulta{" "}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </motion.div>
        </div>
        <a
          className="inline-flex w-fit items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-paper-quiet transition hover:text-paper"
          href="#manifiesto"
        >
          Explorar <ArrowDown aria-hidden="true" className="size-4" />
        </a>
      </Container>
    </section>
  );
}
