import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { practiceAreaImages } from "@/data/editorial-images";
import type { PracticeArea } from "@/data/practice-areas";

type PracticeAreaCardProps = {
  area: PracticeArea;
};

export function PracticeAreaCard({ area }: PracticeAreaCardProps) {
  const image =
    Number(area.index) % 2 === 1
      ? practiceAreaImages[
          area.slug as keyof typeof practiceAreaImages
        ]
      : undefined;

  return (
    <article className="group relative flex min-h-[31rem] flex-col overflow-hidden border border-white/15 bg-ink-2 p-6 transition duration-500 hover:-translate-y-1 hover:border-white/35 hover:bg-ink-3 motion-reduce:transform-none motion-reduce:transition-none sm:p-8">
      {image ? (
        <div className="absolute inset-x-0 top-0 h-[48%] overflow-hidden border-b border-white/10">
          <Image
            alt={image.alt}
            className="object-cover grayscale transition duration-700 ease-out group-hover:scale-[1.035] group-hover:grayscale-0 motion-reduce:transform-none motion-reduce:transition-none"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            src={image.src}
            style={{ objectPosition: image.position ?? "center" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent to-black/15" />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-28 size-72 rounded-full border border-white/10 transition duration-700 group-hover:scale-125 group-hover:border-white/20 motion-reduce:transform-none motion-reduce:transition-none"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute right-10 top-0 h-48 w-px -rotate-[28deg] bg-white/10"
      />

      <div className="relative flex items-start justify-between gap-4">
        <span className="text-xs font-semibold tracking-[0.2em] text-paper-quiet">
          {area.index}
        </span>
        <ArrowUpRight
          aria-hidden="true"
          className="size-5 text-paper-quiet transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-paper motion-reduce:transform-none motion-reduce:transition-none"
          strokeWidth={1.25}
        />
      </div>

      <div className="relative mt-auto">
        <h2 className="max-w-xl font-serif text-[clamp(2.5rem,4.8vw,4.75rem)] leading-[0.88] tracking-[-0.045em] text-paper">
          {area.title}
        </h2>
        <p className="mt-6 max-w-xl text-base leading-7 text-paper-muted">
          {area.shortDescription}
        </p>
        <ul
          className="mt-8 flex flex-wrap gap-2"
          aria-label="Servicios destacados"
        >
          {area.services.slice(0, 3).map((service) => (
            <li
              key={service}
              className="rounded-full border border-white/15 px-3 py-1 text-[0.68rem] uppercase tracking-[0.12em] text-paper-quiet"
            >
              {service.replace(/\.$/, "")}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={`/areas/${area.slug}`}
        aria-label={`Conocer el área ${area.title}`}
        className="absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-paper"
      >
        <span className="sr-only">Conocer el área {area.title}</span>
      </Link>
    </article>
  );
}
