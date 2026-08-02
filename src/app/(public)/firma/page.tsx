import type { Metadata } from "next";
import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config/site";

const SITE_URL = siteConfig.url;

export const metadata: Metadata = {
  title: "Firma | XS ABOGADOS",
  description:
    "Conoce la filosofía, valores y metodología de XS ABOGADOS, firma jurídica enfocada en estrategia, precisión y atención personalizada.",
  alternates: { canonical: `${SITE_URL}/firma` },
  openGraph: {
    title: "Firma | XS ABOGADOS",
    description:
      "Una nueva etapa institucional construida sobre experiencia jurídica, especialización y una visión contemporánea del servicio legal.",
    url: `${SITE_URL}/firma`,
    type: "website",
  },
};

const values = [
  {
    index: "01",
    name: "Precisión",
    description:
      "Cada asunto exige orden, claridad y atención rigurosa a los detalles que pueden modificar una decisión.",
  },
  {
    index: "02",
    name: "Integridad",
    description:
      "Actuamos con criterios profesionales claros y una comunicación responsable sobre alcances, riesgos y alternativas.",
  },
  {
    index: "03",
    name: "Estrategia",
    description:
      "Conectamos el análisis jurídico con los objetivos, restricciones y tiempos reales de cada cliente.",
  },
  {
    index: "04",
    name: "Confidencialidad",
    description:
      "Tratamos la información con discreción y establecemos canales adecuados para cada etapa de la relación profesional.",
  },
  {
    index: "05",
    name: "Responsabilidad",
    description:
      "Damos seguimiento a decisiones y compromisos con trazabilidad, disciplina y sentido de oportunidad.",
  },
  {
    index: "06",
    name: "Innovación",
    description:
      "Revisamos los problemas desde distintos ángulos para diseñar soluciones jurídicas pertinentes y comprensibles.",
  },
] as const;

const method = [
  [
    "01",
    "Comprensión",
    "Escuchamos el contexto, los objetivos y las restricciones antes de proponer una ruta.",
  ],
  [
    "02",
    "Diagnóstico",
    "Ordenamos hechos, documentos, riesgos, plazos y decisiones pendientes.",
  ],
  [
    "03",
    "Estrategia",
    "Definimos alternativas y una secuencia de intervención jurídicamente sustentada.",
  ],
  [
    "04",
    "Ejecución",
    "Coordinamos actuaciones, negociación y documentación con atención al detalle.",
  ],
  [
    "05",
    "Seguimiento",
    "Comunicamos avances relevantes y mantenemos visibles los siguientes pasos.",
  ],
] as const;

export default function FirmPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LegalService",
        "@id": `${SITE_URL}/#legal-service`,
        name: "XS ABOGADOS",
        url: SITE_URL,
        telephone: siteConfig.contact.phoneDisplay,
        email: siteConfig.contact.email,
        description:
          "Firma jurídica mexicana enfocada en estructurar, proteger y defender los intereses de sus clientes mediante soluciones precisas y estrategias multidisciplinarias.",
        areaServed: "México",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Inicio",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Firma",
            item: `${SITE_URL}/firma`,
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-ink text-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="mx-auto max-w-shell px-5 pb-24 pt-36 sm:px-8 sm:pt-44 lg:px-12 lg:pb-36 lg:pt-52">
        <p className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
          Firma / Una nueva etapa
        </p>
        <div className="mt-12 grid gap-12 border-t border-white/15 pt-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <p className="max-w-sm text-sm leading-7 text-paper-muted">
            Estrategia jurídica para empresas, instituciones y personas que
            enfrentan decisiones complejas.
          </p>
          <h1 className="font-serif text-[clamp(4.2rem,10vw,9.5rem)] leading-[0.78] tracking-[-0.065em] text-paper">
            Una nueva
            <br />
            etapa.
          </h1>
        </div>
      </section>

      <section className="border-y border-white/15 bg-paper text-ink">
        <div className="mx-auto grid max-w-shell gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 lg:px-12 lg:py-36">
          <div>
            <p className="text-xs font-semibold uppercase tracking-editorial text-black/55">
              Renovación institucional
            </p>
          </div>
          <div className="max-w-4xl">
            <h2 className="font-serif text-[clamp(2.8rem,6vw,6rem)] leading-[0.95] tracking-[-0.045em]">
              XS ABOGADOS representa una nueva etapa institucional construida
              sobre experiencia jurídica, especialización y una visión
              contemporánea del servicio legal.
            </h2>
            <div className="mt-12 grid gap-7 text-base leading-8 text-black/65 sm:grid-cols-2">
              <p>
                La firma estructura, protege y defiende los intereses de sus
                clientes mediante soluciones precisas, atención personalizada y
                estrategias multidisciplinarias.
              </p>
              <p>
                Nuestro punto de partida es comprender el contexto completo. El
                derecho se integra a la operación, al patrimonio y a las
                decisiones que cada asunto exige tomar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-shell px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
              Filosofía y misión
            </p>
          </div>
          <div>
            <h2 className="max-w-5xl font-serif text-[clamp(3rem,6.5vw,6.5rem)] leading-[0.88] tracking-[-0.05em]">
              Claridad antes de actuar. Estrategia antes de decidir.
            </h2>
            <div className="mt-12 grid gap-10 border-t border-white/15 pt-10 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
                  Filosofía
                </h3>
                <p className="mt-5 text-lg leading-8 text-paper-muted">
                  Un asunto jurídico debe entenderse desde sus consecuencias, no
                  únicamente desde sus documentos. Buscamos convertir
                  complejidad en decisiones claras y ejecutables.
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
                  Misión
                </h3>
                <p className="mt-5 text-lg leading-8 text-paper-muted">
                  Diseñar y ejecutar soluciones jurídicas rigurosas que permitan
                  a cada cliente proteger sus intereses y avanzar con una visión
                  informada de riesgos y alternativas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/15 bg-ink-2">
        <div className="mx-auto max-w-shell px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
          <div className="mb-14 flex items-end justify-between gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
                Principios de trabajo
              </p>
              <h2 className="mt-6 font-serif text-5xl tracking-[-0.045em] sm:text-7xl">
                Seis valores.
              </h2>
            </div>
            <span className="hidden font-serif text-8xl text-white/10 md:block">
              XS
            </span>
          </div>
          <div className="grid border-l border-t border-white/15 sm:grid-cols-2 xl:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.name}
                className="min-h-72 border-b border-r border-white/15 p-6 sm:p-8"
              >
                <span className="text-xs tracking-[0.2em] text-paper-quiet">
                  {value.index}
                </span>
                <h3 className="mt-16 font-serif text-4xl tracking-[-0.04em]">
                  {value.name}
                </h3>
                <p className="mt-5 max-w-sm text-sm leading-7 text-paper-muted">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-shell px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
              Método
            </p>
            <p className="mt-6 max-w-xs text-sm leading-7 text-paper-muted">
              Una secuencia clara para mantener alineados el análisis, la
              ejecución y la comunicación.
            </p>
          </div>
          <ol className="border-t border-white/15">
            {method.map(([index, title, description]) => (
              <li
                key={index}
                className="grid gap-5 border-b border-white/15 py-7 sm:grid-cols-[4rem_0.7fr_1.3fr] sm:items-start"
              >
                <span className="text-xs tracking-[0.18em] text-paper-quiet">
                  {index}
                </span>
                <h3 className="font-serif text-3xl tracking-[-0.03em]">
                  {title}
                </h3>
                <p className="max-w-xl text-sm leading-7 text-paper-muted">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-white/15 bg-paper text-ink">
        <div className="mx-auto grid max-w-shell gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-32">
          <div>
            <ShieldCheck
              aria-hidden="true"
              className="size-8"
              strokeWidth={1}
            />
            <h2 className="mt-10 font-serif text-5xl leading-[0.95] tracking-[-0.045em] sm:text-7xl">
              Discreción por diseño.
            </h2>
          </div>
          <div className="self-end">
            <p className="text-lg leading-8 text-black/65">
              La confidencialidad forma parte del método de trabajo. Procuramos
              que la información circule únicamente por los canales y entre las
              personas necesarias para atender cada asunto.
            </p>
            <p className="mt-6 text-lg leading-8 text-black/65">
              La cultura de la firma combina colaboración multidisciplinaria,
              estudio continuo y responsabilidad individual sobre cada tarea. La
              atención es directa, estratégica y adaptada al contexto del
              cliente.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-shell px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <p className="text-xs font-semibold uppercase tracking-editorial text-paper-quiet">
          Siguiente paso
        </p>
        <h2 className="mt-8 max-w-5xl font-serif text-[clamp(3.5rem,8vw,8rem)] leading-[0.84] tracking-[-0.055em]">
          Conoce a quienes diseñan la estrategia.
        </h2>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/equipo"
            className="inline-flex min-h-12 items-center gap-3 bg-paper px-6 text-xs font-semibold uppercase tracking-[0.16em] text-ink transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
          >
            Conocer al equipo
            <ArrowRight
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.5}
            />
          </Link>
          <Link
            href="/agenda"
            className="inline-flex min-h-12 items-center gap-3 border border-white/20 px-6 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition hover:border-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
          >
            Agendar una consulta
            <ArrowRight
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
