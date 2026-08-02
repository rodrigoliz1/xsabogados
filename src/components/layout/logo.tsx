import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      aria-label="XS ABOGADOS — Inicio"
      className={cn(
        "relative block shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper",
        className,
      )}
      href="/"
    >
      {compact ? (
        <Image
          alt=""
          className="size-10 object-contain"
          height={512}
          priority
          src="/images/brand/xs-mark.png"
          width={512}
        />
      ) : (
        <Image
          alt="XS ABOGADOS"
          className="h-auto w-[178px] sm:w-[205px]"
          height={151}
          priority
          src="/images/brand/logo-horizontal.png"
          width={787}
        />
      )}
    </Link>
  );
}
