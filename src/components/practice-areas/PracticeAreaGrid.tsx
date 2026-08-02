import type { PracticeArea } from "@/data/practice-areas";

import { PracticeAreaCard } from "./PracticeAreaCard";

type PracticeAreaGridProps = {
  areas: readonly PracticeArea[];
};

export function PracticeAreaGrid({ areas }: PracticeAreaGridProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {areas.map((area) => (
        <PracticeAreaCard key={area.slug} area={area} />
      ))}
    </div>
  );
}
