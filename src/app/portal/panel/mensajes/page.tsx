import { MessageSquareText } from "lucide-react";

import { MessageComposer } from "@/components/portal/message-composer";
import { SectionHeading } from "@/components/portal/portal-primitives";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import { requireActor } from "@/server/policies";
import {
  getPortalMatter,
  getPortalSummary,
} from "@/server/services/portal-service";

export const dynamic = "force-dynamic";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const actor = await requireActor();
  const summary = await getPortalSummary(actor);
  const requestedMatterId =
    typeof params.asunto === "string" ? params.asunto : undefined;
  const matterId = summary.matters.some(
    (matter) => matter.id === requestedMatterId,
  )
    ? requestedMatterId
    : summary.matters[0]?.id;
  if (!matterId)
    return (
      <EmptyState
        description="No existe un asunto asociado en el cual registrar mensajes."
        icon={MessageSquareText}
        title="Sin canal disponible"
      />
    );
  const matter = await getPortalMatter(actor, matterId);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow={matter.reference}
        title="Mensajes"
        description={`Conversación visible relacionada con ${matter.title}.`}
      />
      <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
        <div className="flex items-center gap-4 border-b border-white/10 px-5 py-5 sm:px-6">
          <span className="grid size-10 place-items-center rounded-full border border-white/10 text-paper-muted">
            <MessageSquareText aria-hidden="true" className="size-4" />
          </span>
          <div>
            <h2 className="font-serif text-2xl">Equipo XS · {matter.title}</h2>
            <p className="mt-1 text-[10px] text-white/30">
              Canal privado del asunto
            </p>
          </div>
        </div>
        <div className="space-y-6 p-5 sm:p-7">
          {matter.messages.length ? (
            matter.messages.map((message) => (
              <article className="flex gap-3 sm:gap-4" key={message.id}>
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[10px] font-semibold text-white/55">
                  {message.sender.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-semibold text-white/75">
                      {message.sender.name}
                    </p>
                    <span className="text-[9px] text-white/30">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-[9px] text-white/30">
                    {message.sender.role}
                  </p>
                  <p className="mt-3 rounded-2xl rounded-tl-sm bg-white/[0.06] px-4 py-3 text-sm leading-6 text-white/60">
                    {message.body}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-white/40">
              Aún no hay mensajes visibles en este asunto.
            </p>
          )}
        </div>
        <MessageComposer matterId={matter.id} />
      </section>
    </div>
  );
}
