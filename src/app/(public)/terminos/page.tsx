import type { Metadata } from "next";
import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config/site";

const SITE_URL = siteConfig.url;
const CONTACT_EMAIL = siteConfig.contact.email;

// Esta plantilla requiere revisión y aprobación jurídica interna antes de publicarse en producción.
export const metadata: Metadata = {
  title: "Términos de uso | XS ABOGADOS",
  description:
    "Términos generales para el uso del sitio, la agenda y el portal de XS ABOGADOS, pendientes de aprobación jurídica interna.",
  alternates: { canonical: `${SITE_URL}/terminos` },
  robots: { index: false, follow: true },
};

const terms = [
  {
    index: "01",
    title: "Objeto y aceptación",
    paragraphs: [
      "Estos términos regulan el acceso y uso del sitio xs-abogados.com, sus contenidos públicos, el sistema de citas y, cuando corresponda, el portal del cliente.",
      "El acceso al sitio implica la aceptación de los términos vigentes. Ciertas funcionalidades podrán estar sujetas a condiciones adicionales comunicadas antes de su uso.",
    ],
  },
  {
    index: "02",
    title: "Información general, no asesoría",
    paragraphs: [
      "Los contenidos del sitio son de carácter informativo y no constituyen asesoría jurídica, opinión legal ni recomendación para un caso particular.",
      "La información puede no contemplar reformas, criterios, hechos o documentos relevantes para una situación concreta. Ninguna decisión debe basarse únicamente en el contenido público de este sitio.",
    ],
  },
  {
    index: "03",
    title: "Relación profesional",
    paragraphs: [
      "El envío de un formulario, mensaje, correo o solicitud de cita no crea por sí mismo una relación abogado-cliente ni obliga a la firma a aceptar un asunto.",
      "La relación profesional solo podrá establecerse después de revisar posibles conflictos, acordar el alcance y formalizar los instrumentos aplicables. Hasta entonces, evita enviar información confidencial o documentos sensibles.",
    ],
  },
  {
    index: "04",
    title: "Citas y comunicaciones",
    paragraphs: [
      "Una solicitud de cita está sujeta a disponibilidad y confirmación. Las opciones de cancelación o reprogramación se comunicarán con la confirmación correspondiente.",
      "El usuario es responsable de proporcionar datos de contacto correctos y de revisar las comunicaciones relacionadas con su solicitud.",
    ],
  },
  {
    index: "05",
    title: "Portal del cliente",
    paragraphs: [
      "Las credenciales del portal son personales. El usuario debe protegerlas, evitar compartirlas y notificar cualquier acceso o actividad que no reconozca.",
      "La información mostrada en el portal es una herramienta de seguimiento general. No sustituye las comunicaciones formales, resoluciones, documentos originales ni indicaciones específicas del equipo responsable.",
    ],
  },
  {
    index: "06",
    title: "Ausencia de promesas de resultado",
    paragraphs: [
      "Los asuntos jurídicos dependen de hechos, pruebas, decisiones de terceros y criterios de autoridades. El sitio no ofrece garantías, promesas de éxito ni resultados determinados.",
      "Las referencias a servicios, métodos o capacidades describen áreas de intervención y no anticipan el resultado de un asunto.",
    ],
  },
  {
    index: "07",
    title: "Propiedad intelectual",
    paragraphs: [
      "Salvo indicación distinta, la identidad, textos, composiciones, materiales y demás contenidos del sitio pertenecen a XS ABOGADOS o se utilizan con autorización.",
      "Se permite consultar y compartir enlaces al contenido público. No se autoriza reproducir, modificar, explotar o presentar los materiales como propios sin consentimiento previo.",
    ],
  },
  {
    index: "08",
    title: "Uso permitido",
    paragraphs: [
      "No debe utilizarse el sitio para intentar acceder a cuentas ajenas, interferir con su operación, introducir código malicioso, extraer información de manera automatizada en forma abusiva, suplantar identidades o realizar actividades contrarias a la ley.",
      "La firma podrá restringir accesos cuando existan señales razonables de abuso, riesgo para la seguridad o incumplimiento de estos términos.",
    ],
  },
  {
    index: "09",
    title: "Disponibilidad y servicios externos",
    paragraphs: [
      "El sitio puede depender de proveedores de alojamiento, correo, calendario, videollamada, mapas o almacenamiento. Su disponibilidad puede variar por mantenimiento, incidentes o causas fuera del control razonable de la firma.",
      "Los enlaces y servicios de terceros se rigen por sus propias condiciones y políticas. Su inclusión no implica una recomendación general sobre contenidos ajenos.",
    ],
  },
  {
    index: "10",
    title: "Privacidad",
    paragraphs: [
      "El tratamiento de datos personales relacionado con el sitio se describe en el aviso de privacidad. Las personas usuarias deben revisar dicho documento antes de enviar información o crear una cuenta.",
    ],
  },
  {
    index: "11",
    title: "Modificaciones",
    paragraphs: [
      "Estos términos podrán actualizarse para reflejar cambios jurídicos, operativos o tecnológicos. La versión publicada deberá indicar su fecha de entrada en vigor y, cuando sea necesario, comunicar cambios relevantes por medios adicionales.",
    ],
  },
  {
    index: "12",
    title: "Ley aplicable y contacto",
    paragraphs: [
      "La ley aplicable, mecanismos de solución de controversias y jurisdicción deberán definirse y aprobarse internamente antes de la publicación en producción.",
      `Las preguntas sobre estos términos pueden dirigirse a ${CONTACT_EMAIL}.`,
    ],
  },
] as const;

export default function TermsPage() {
  return (
    <div className="bg-paper text-ink">
      <section className="mx-auto max-w-shell px-5 pb-20 pt-36 sm:px-8 sm:pt-44 lg:px-12 lg:pb-28 lg:pt-52">
        <p className="text-xs font-semibold uppercase tracking-editorial text-black/50">
          Legal / Uso del sitio
        </p>
        <h1 className="mt-10 max-w-6xl font-serif text-[clamp(4rem,10vw,9rem)] leading-[0.8] tracking-[-0.065em]">
          Términos
          <br />
          de uso.
        </h1>
        <div className="mt-12 flex max-w-4xl gap-4 border border-black/20 bg-white p-5 sm:p-6">
          <AlertTriangle
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0"
            strokeWidth={1.5}
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em]">
              Borrador para revisión interna
            </p>
            <p className="mt-3 text-sm leading-7 text-black/65">
              Esta plantilla requiere revisión y aprobación jurídica interna
              antes de publicarse en producción. Permanecerá fuera de índices de
              búsqueda mientras conserve este estado.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-black/15">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 lg:py-28">
          <p className="mb-16 max-w-3xl text-xl leading-9 text-black/65">
            Lee estas condiciones antes de utilizar el sitio, solicitar una cita
            o acceder al portal. Las funcionalidades privadas también podrán
            requerir reglas específicas según el servicio contratado.
          </p>

          <div className="border-t border-black/15">
            {terms.map((term) => (
              <section
                key={term.index}
                className="grid gap-6 border-b border-black/15 py-10 lg:grid-cols-[5rem_0.75fr_1.25fr] lg:gap-10"
              >
                <span className="text-xs tracking-[0.18em] text-black/45">
                  {term.index}
                </span>
                <h2 className="font-serif text-3xl leading-tight tracking-[-0.03em] sm:text-4xl">
                  {term.title}
                </h2>
                <div className="space-y-5 text-base leading-8 text-black/65">
                  {term.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap gap-4">
            <Link
              href="/aviso-de-privacidad"
              className="inline-flex min-h-12 items-center gap-3 bg-ink px-6 text-xs font-semibold uppercase tracking-[0.15em] text-paper transition hover:bg-ink-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              Aviso de privacidad
              <ArrowRight
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.5}
              />
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex min-h-12 items-center border border-black/20 px-6 text-xs font-semibold uppercase tracking-[0.15em] transition hover:border-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              Escribir a la firma
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
