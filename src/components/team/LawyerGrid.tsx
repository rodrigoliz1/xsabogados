import type { Lawyer } from "@/data/lawyers";

import { LawyerCard } from "./LawyerCard";

type LawyerGridProps = {
  lawyers: readonly Lawyer[];
  priorityCount?: number;
};

export function LawyerGrid({ lawyers, priorityCount = 0 }: LawyerGridProps) {
  return (
    <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
      {lawyers.map((lawyer, index) => (
        <LawyerCard
          key={lawyer.slug}
          lawyer={lawyer}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}
