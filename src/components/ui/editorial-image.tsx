import Image from "next/image";

import type { EditorialImage as EditorialImageData } from "@/data/editorial-images";
import { cn } from "@/lib/utils";

type EditorialImageProps = {
  image: EditorialImageData;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  showCaption?: boolean;
};

export function EditorialImage({
  image,
  className,
  imageClassName,
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  showCaption = true,
}: EditorialImageProps) {
  return (
    <figure
      className={cn(
        "group relative isolate overflow-hidden bg-ink-3",
        className,
      )}
    >
      <Image
        alt={image.alt}
        className={cn(
          "object-cover grayscale transition duration-700 ease-out group-hover:scale-[1.02] group-hover:grayscale-0 motion-reduce:transform-none motion-reduce:transition-none",
          imageClassName,
        )}
        fill
        priority={priority}
        sizes={sizes}
        src={image.src}
        style={{ objectPosition: image.position ?? "center" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/15"
      />
      {showCaption ? (
        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-5 text-paper sm:p-6">
          <span className="text-[0.64rem] font-semibold uppercase tracking-[0.17em]">
            {image.label}
          </span>
          <a
            className="text-right text-[0.58rem] text-white/55 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
            href={image.sourceUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {image.credit}
          </a>
        </figcaption>
      ) : null}
    </figure>
  );
}
