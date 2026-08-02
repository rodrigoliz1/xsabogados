"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-5 text-paper">
      <div className="max-w-xl text-center">
        <p className="eyebrow text-paper-quiet">
          No fue posible cargar esta vista
        </p>
        <h1 className="mt-6 font-serif text-6xl leading-none">
          Intentemos nuevamente.
        </h1>
        <p className="mt-6 leading-7 text-paper-muted">
          El incidente no afecta la información que ya hayas enviado.
        </p>
        <Button className="mt-8" onClick={reset}>
          <RotateCcw aria-hidden="true" className="size-4" /> Reintentar
        </Button>
      </div>
    </main>
  );
}
