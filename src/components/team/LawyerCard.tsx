import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { Lawyer } from "@/data/lawyers";

import { LawyerPortrait } from "./LawyerPortrait";

type LawyerCardProps = {
  lawyer: Lawyer;
  priority?: boolean;
};

export function LawyerCard({ lawyer, priority = false }: LawyerCardProps) {
  return (
    <article className="group border-t border-white/15 pt-4">
      <Link
        href={`/equipo/${lawyer.slug}`}
        aria-label={`Ver perfil de ${lawyer.name}`}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
      >
        <LawyerPortrait
          lawyer={lawyer}
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="aspect-[4/5]"
        />
        <div className="flex items-start justify-between gap-6 py-5">
          <div>
            <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-paper-quiet">
              {lawyer.role}
            </p>
            <h2 className="font-serif text-3xl leading-none tracking-[-0.03em] text-paper transition-colors group-hover:text-white sm:text-4xl">
              {lawyer.name}
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-paper-muted">
              {lawyer.primaryArea}
            </p>
          </div>
          <ArrowUpRight
            aria-hidden="true"
            className="mt-1 size-5 shrink-0 text-paper-quiet transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-paper motion-reduce:transform-none motion-reduce:transition-none"
            strokeWidth={1.25}
          />
        </div>
      </Link>
    </article>
  );
}
