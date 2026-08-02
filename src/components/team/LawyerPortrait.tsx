import Image from "next/image";

import type { Lawyer } from "@/data/lawyers";

type LawyerPortraitProps = {
  lawyer: Lawyer;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

export function LawyerPortrait({
  lawyer,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 40vw",
  className = "",
}: LawyerPortraitProps) {
  return (
    <div className={`relative isolate overflow-hidden bg-ink-3 ${className}`}>
      {lawyer.image ? (
        <Image
          src={lawyer.image}
          alt={lawyer.imageAlt ?? `Retrato profesional de ${lawyer.name}`}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover grayscale transition duration-700 ease-out group-hover:scale-[1.025] group-hover:grayscale-0 motion-reduce:transform-none motion-reduce:transition-none"
          style={{ objectPosition: lawyer.imagePosition ?? "center" }}
        />
      ) : (
        <div
          role="img"
          aria-label={`Monograma institucional de ${lawyer.name}`}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            aria-hidden="true"
            className="absolute inset-[9%] border border-white/15"
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-full w-px -rotate-[24deg] bg-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute left-0 top-1/2 h-px w-full -rotate-[24deg] bg-white/10"
          />
          <span className="font-serif text-[clamp(4rem,10vw,8rem)] font-light tracking-[-0.06em] text-paper">
            {lawyer.initials}
          </span>
        </div>
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"
      />
    </div>
  );
}
