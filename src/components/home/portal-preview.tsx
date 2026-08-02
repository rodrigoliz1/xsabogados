import { CalendarClock, FileText, MessageSquareText } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";

export function PortalPreview() {
  return (
    <div
      aria-label="Vista de ejemplo del portal del cliente"
      className="overflow-hidden rounded-3xl border border-black/10 bg-ink text-paper shadow-lift"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
        <div>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-paper-quiet">
            Portal privado
          </p>
          <p className="mt-1 text-sm text-paper-muted">
            Vista demostrativa · sin datos reales
          </p>
        </div>
        <span className="grid size-9 place-items-center rounded-full border border-white/15 font-serif text-sm">
          XS
        </span>
      </div>
      <div className="grid gap-px bg-white/10 md:grid-cols-[0.68fr_1.32fr]">
        <div className="bg-ink-2 p-5 sm:p-7">
          <p className="eyebrow text-paper-quiet">Asunto</p>
          <p className="mt-4 font-serif text-3xl leading-none">
            Operación Mercurio
          </p>
          <p className="mt-3 text-xs text-paper-quiet">
            Referencia DEMO-XS-001
          </p>
          <div className="mt-8">
            <StatusBadge tone="info">Estrategia definida</StatusBadge>
          </div>
        </div>
        <div className="space-y-3 bg-ink p-5 sm:p-7">
          {[
            {
              icon: CalendarClock,
              label: "Próxima actuación",
              value: "Revisión de documentos · 12 agosto",
            },
            {
              icon: FileText,
              label: "Documentos compartidos",
              value: "3 archivos disponibles",
            },
            {
              icon: MessageSquareText,
              label: "Mensajes",
              value: "1 actualización reciente",
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4"
              key={label}
            >
              <Icon
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-paper-muted"
              />
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.13em] text-paper-quiet">
                  {label}
                </p>
                <p className="mt-2 text-sm text-paper-muted">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
