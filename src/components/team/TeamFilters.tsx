"use client";

import { useMemo, useState } from "react";

import type { Lawyer, TeamFilterKey } from "@/data/lawyers";
import { teamFilters } from "@/data/lawyers";

import { LawyerGrid } from "./LawyerGrid";

type TeamFiltersProps = {
  lawyers: readonly Lawyer[];
};

export function TeamFilters({ lawyers }: TeamFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | TeamFilterKey>(
    "all",
  );

  const filteredLawyers = useMemo(
    () =>
      activeFilter === "all"
        ? lawyers
        : lawyers.filter((lawyer) => lawyer.filters.includes(activeFilter)),
    [activeFilter, lawyers],
  );

  return (
    <div>
      <div
        className="mb-12 flex gap-2 overflow-x-auto border-y border-white/15 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Filtrar integrantes por área"
      >
        {teamFilters.map((filter) => {
          const isActive = activeFilter === filter.key;

          return (
            <button
              key={filter.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveFilter(filter.key)}
              className={`min-h-11 shrink-0 rounded-full border px-5 text-xs font-semibold uppercase tracking-[0.14em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper ${
                isActive
                  ? "border-paper bg-paper text-ink"
                  : "border-white/15 text-paper-muted hover:border-white/40 hover:text-paper"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {filteredLawyers.length} integrantes mostrados.
      </p>
      <LawyerGrid lawyers={filteredLawyers} priorityCount={3} />
    </div>
  );
}
