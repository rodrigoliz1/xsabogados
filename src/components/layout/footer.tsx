import { ArrowUpRight, MessageCircleMore } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import {
  defaultPublicSiteSettings,
  getSettingsWhatsAppUrl,
  type PublicSiteSettings,
} from "@/server/services/site-settings-service";

import { Logo } from "./logo";

const footerAreas = [
  ["Corporativo & Negocios", "/areas/corporativo-negocios"],
  ["Bancario & Financiero", "/areas/bancario-financiero"],
  ["Litigio & Solución de Conflictos", "/areas/litigio-solucion-conflictos"],
  ["Recuperación de Cartera", "/areas/recuperacion-cartera-insolvencia"],
] as const;

export function Footer({
  settings = defaultPublicSiteSettings,
}: {
  settings?: PublicSiteSettings;
}) {
  return (
    <footer className="border-t border-white/10 bg-ink text-paper">
      <div className="mx-auto max-w-shell px-5 pb-8 pt-16 sm:px-8 lg:px-12 lg:pt-24">
        <div className="grid gap-14 border-b border-white/10 pb-16 lg:grid-cols-[1.25fr_0.75fr_1fr]">
          <div>
            <Logo />
            <p className="mt-8 max-w-md text-base leading-7 text-paper-quiet">
              Estrategia jurídica, precisión técnica y atención directa para
              decisiones que requieren claridad.
            </p>
            <Link
              className="mt-8 inline-flex items-center gap-2 border-b border-paper/40 pb-1 text-sm text-paper transition hover:border-paper"
              href="/agenda"
            >
              Agenda una consulta{" "}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <div>
            <p className="eyebrow text-paper-quiet">Navegación</p>
            <ul className="mt-6 space-y-3 text-sm text-paper-muted">
              {[
                ...siteConfig.navigation,
                { label: "Contacto", href: "/contacto" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    className="transition hover:text-paper"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-paper-quiet">Áreas de práctica</p>
            <ul className="mt-6 space-y-3 text-sm leading-6 text-paper-muted">
              {footerAreas.map(([label, href]) => (
                <li key={href}>
                  <Link className="transition hover:text-paper" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid gap-8 border-b border-white/10 py-10 text-sm text-paper-quiet md:grid-cols-3">
          <div>
            <p className="eyebrow text-paper-quiet">Contacto</p>
            <a
              className="mt-4 block text-paper transition hover:text-white"
              href={`tel:${settings.phoneE164}`}
            >
              {settings.phoneDisplay}
            </a>
            <a
              aria-label={`Abrir WhatsApp de ${settings.firmName}: ${settings.phoneDisplay}`}
              className="mt-2 inline-flex items-center gap-2 transition hover:text-paper"
              href={getSettingsWhatsAppUrl(settings)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <MessageCircleMore
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.5}
              />
              WhatsApp
              <ArrowUpRight
                aria-hidden="true"
                className="size-3.5"
                strokeWidth={1.5}
              />
            </a>
            <a
              className="mt-2 block transition hover:text-paper"
              href={`mailto:${settings.contactEmail}`}
            >
              {settings.contactEmail}
            </a>
            {Object.keys(settings.socialLinks).length ? (
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {Object.entries(settings.socialLinks).map(([label, url]) => (
                  <a
                    className="transition hover:text-paper"
                    href={url}
                    key={label}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
          <div>
            <p className="eyebrow text-paper-quiet">Oficina</p>
            <address className="mt-4 max-w-sm not-italic leading-6">
              <a
                aria-label="Abrir ubicación de XS ABOGADOS en Google Maps"
                className="transition hover:text-white"
                href={siteConfig.contact.mapsUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {settings.address}
              </a>
            </address>
          </div>
          <div>
            <p className="eyebrow text-paper-quiet">Horario</p>
            <p className="mt-4">{settings.officeHours}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-8 text-xs text-paper-quiet sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.firmName}. Todos los derechos
            reservados. Desarrollado por{" "}
            <a
              href="https://punto-digital-eta.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-paper"
            >
              Punto Digital
            </a>
            .
          </p>

          <div className="flex gap-5">
            <Link
              className="transition hover:text-paper"
              href="/aviso-de-privacidad"
            >
              Aviso de privacidad
            </Link>

            <Link className="transition hover:text-paper" href="/terminos">
              Términos de uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
