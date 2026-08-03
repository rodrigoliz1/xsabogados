import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { ArticleCard } from "@/components/articles/ArticleCard";
import { HomeHero } from "@/components/home/home-hero";
import { PortalPreview } from "@/components/home/portal-preview";
import { PracticeAreaCard } from "@/components/practice-areas/PracticeAreaCard";
import { LawyerCard } from "@/components/team/LawyerCard";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EditorialImage } from "@/components/ui/editorial-image";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { articles } from "@/data/articles";
import { editorialImages } from "@/data/editorial-images";
import { lawyers } from "@/data/lawyers";
import { practiceAreas } from "@/data/practice-areas";

const method = [
  [
    "01",
    "Comprensión",
    "Escuchamos el contexto, los objetivos y las restricciones que realmente definen el asunto.",
  ],
  [
    "02",
    "Diagnóstico",
    "Ordenamos hechos, documentos, riesgos y decisiones pendientes para construir una lectura completa.",
  ],
  [
    "03",
    "Estrategia",
    "Diseñamos una ruta jurídica clara, con alternativas, prioridades y responsables definidos.",
  ],
  [
    "04",
    "Ejecución",
    "Implementamos con precisión técnica, comunicación directa y trazabilidad sobre cada actuación.",
  ],
  [
    "05",
    "Seguimiento",
    "Revisamos avances, cambios de escenario y próximos pasos con una visión de largo plazo.",
  ],
] as const;

export default function HomePage() {
  const partners = lawyers.filter(
    (lawyer) => lawyer.role === "Socio" || lawyer.role === "Socia" || lawyer.role === "Socio Director",
  );

  return (
    <>
      <HomeHero />

      <section className="bg-paper py-24 text-ink lg:py-40" id="manifiesto">
        <Container>
          <Reveal>
            <p className="eyebrow text-ink/50">Nuestra posición</p>
            <blockquote className="mt-8 max-w-[17ch] text-balance font-serif text-[clamp(3.4rem,7.5vw,8rem)] leading-[0.86] tracking-[-0.055em]">
              Convertimos retos en oportunidades de éxito.
            </blockquote>
          </Reveal>
          <div className="mt-14 grid gap-7 border-t border-black/15 pt-7 md:grid-cols-[1fr_1fr] lg:ml-auto lg:max-w-4xl">
            <p className="text-lg leading-8 text-ink/70">
              Trabajamos desde la comprensión integral del asunto: sus hechos,
              sus documentos, sus relaciones y el impacto que cada decisión
              puede generar.
            </p>
            <p className="text-lg leading-8 text-ink/70">
              La precisión jurídica se convierte así en una herramienta para
              avanzar con criterio, proteger intereses y resolver escenarios
              complejos.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-ink py-24 text-paper lg:py-36">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Áreas de práctica"
              invert
              title="Servicio jurídico integral."
            />
            <ButtonLink href="/areas" variant="outline">
              Explorar todas las áreas{" "}
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
          <div className="mt-16 grid gap-4 lg:grid-cols-2">
            {practiceAreas.map((area, index) => (
              <Reveal delay={Math.min(index * 0.05, 0.2)} key={area.slug}>
                <PracticeAreaCard area={area} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-paper py-24 text-ink lg:py-40">
        <span
          aria-hidden="true"
          className="absolute -right-16 top-0 font-serif text-[34rem] leading-none text-black/[0.025]"
        >
          XS
        </span>
        <Container className="relative">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
            <Reveal>
              <EditorialImage
                className="aspect-[4/5] min-h-[32rem]"
                image={editorialImages.puertaDeHierro2}
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </Reveal>
            <div>
              <p className="eyebrow text-ink/50">La firma</p>
              <Reveal>
                <h2 className="mt-7 max-w-[15ch] text-balance font-serif text-5xl leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-8xl">
                  Estrategia jurídica para decisiones complejas.
                </h2>
              </Reveal>
              <div className="mt-10 grid gap-8 border-t border-black/15 pt-8 sm:grid-cols-2">
                <p className="text-base leading-7 text-ink/70">
                  XS ABOGADOS es una firma jurídica enfocada en estructurar,
                  proteger y defender los intereses de sus clientes mediante
                  soluciones precisas y estrategias multidisciplinarias.
                </p>
                <div>
                  <p className="text-base leading-7 text-ink/70">
                    Nuestra práctica integra experiencia en derecho corporativo, bancario, financiero, civil, mercantil, administrativo y constitucional para responder con eficacia a los desafíos legales actuales.
                  </p>
                  <Link
                    className="mt-7 inline-flex items-center gap-2 border-b border-black/30 pb-1 text-sm font-semibold"
                    href="/firma"
                  >
                    Conocer XS ABOGADOS{" "}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-ink-2 py-24 text-paper lg:py-36">
        <Container>
          <SectionHeading
            description="Cada etapa convierte información dispersa en decisiones claras, responsables y verificables."
            eyebrow="Método de trabajo"
            invert
            title="El derecho exige precisión. Cada decisión también."
          />
          <ol className="mt-16 grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {method.map(([number, title, description]) => (
              <li
                className="min-h-72 border-b border-r border-white/10 p-6 sm:p-7"
                key={number}
              >
                <span className="text-xs tracking-[0.18em] text-paper-quiet">
                  {number}
                </span>
                <h3 className="mt-16 font-serif text-3xl">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-paper-quiet">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-ink py-24 text-paper lg:py-36">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              description="Socios que combinan práctica transaccional, financiera y contenciosa para leer cada asunto desde más de una perspectiva."
              eyebrow="Equipo"
              invert
              title="Abogados Especializados."
            />
            <ButtonLink href="/equipo" variant="outline">
              Conocer al equipo{" "}
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {partners.map((lawyer, index) => (
              <Reveal delay={index * 0.08} key={lawyer.slug}>
                <LawyerCard lawyer={lawyer} priority={index < 2} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-24 text-ink lg:py-40">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
            <div>
              <p className="eyebrow text-ink/50">Portal del cliente</p>
              <h2 className="mt-6 text-balance font-serif text-5xl leading-[0.93] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                Seguimiento claro, dentro de un espacio privado.
              </h2>
              <p className="mt-7 text-base leading-7 text-ink/65">
                Consulta el estado general de tus asuntos, próximas actuaciones,
                documentos compartidos, citas, mensajes y solicitudes
                pendientes.
              </p>
              <ButtonLink className="mt-8" href="/portal" variant="dark">
                Acceder al portal{" "}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </ButtonLink>
            </div>
            <Reveal>
              <PortalPreview />
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-ink-2 py-24 text-paper lg:py-36">
        <Container>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              description="Análisis institucional para reconocer riesgos, preparar decisiones y comprender escenarios jurídicos relevantes."
              eyebrow="Perspectivas"
              invert
              title="Ideas para decidir con mayor contexto."
            />
            <ButtonLink href="/insights" variant="outline">
              Ver perspectivas{" "}
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
          <div className="mt-16 grid gap-4 lg:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <ArticleCard article={article} key={article.slug} />
            ))}
          </div>
        </Container>
      </section>


    </>
  );
}
