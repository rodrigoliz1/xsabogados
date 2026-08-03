import type { Metadata } from "next";
import { Mail } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config/site";

const SITE_URL = siteConfig.url;

const institutionalData = {
  responsibleName: siteConfig.name,
  address: siteConfig.contact.address,
  privacyEmail: siteConfig.contact.email,
};

export const metadata: Metadata = {
  title: "Aviso de privacidad | XS ABOGADOS",
  description:
    "Aviso de privacidad de XS ABOGADOS para el sitio institucional, la agenda y el portal del cliente.",
  alternates: { canonical: `${SITE_URL}/aviso-de-privacidad` },
};

const sections = [
  {
    index: "01",
    title: "Identidad y domicilio del responsable",
    content: (
      <>
        <p>
          {institutionalData.responsibleName} es responsable del tratamiento de
          los datos personales que recabe mediante este sitio, la agenda, el
          portal del cliente y los canales de contacto habilitados.
        </p>
        <p>
          El domicilio del responsable es {institutionalData.address}
        </p>
      </>
    ),
  },
  {
    index: "02",
    title: "Datos personales recabados",
    content: (
      <>
        <p>
          Dependiendo de la interacción y del servicio solicitado, podremos
          recabar datos de identificación y contacto; información laboral o
          empresarial; datos de facturación; información necesaria para
          coordinar citas; credenciales y preferencias del portal; así como
          información vinculada con la prestación de servicios jurídicos.
        </p>
        <p>
          Los sistemas digitales también pueden generar registros técnicos de
          acceso, dirección IP, tipo de dispositivo, eventos de seguridad y
          datos necesarios para conservar la operación y proteger las cuentas.
        </p>
        <p>
          Cuando un asunto requiera datos patrimoniales, financieros, sensibles
          o documentos confidenciales, la firma definirá un canal adecuado para
          su entrega. Los formularios públicos iniciales no deben utilizarse
          para enviar expedientes o información altamente sensible.
        </p>
      </>
    ),
  },
  {
    index: "03",
    title: "Finalidades primarias",
    content: (
      <>
        <p>Los datos podrán tratarse para:</p>
        <ul>
          <li>Atender solicitudes de información y contacto.</li>
          <li>Realizar revisiones de posibles conflictos de interés.</li>
          <li>Evaluar y, en su caso, formalizar una relación profesional.</li>
          <li>Coordinar, confirmar, cancelar o reprogramar citas.</li>
          <li>Prestar, administrar y dar seguimiento a servicios jurídicos.</li>
          <li>Habilitar y proteger el acceso al portal del cliente.</li>
          <li>Compartir comunicaciones y documentos autorizados.</li>
          <li>Gestionar pagos, facturación y obligaciones administrativas.</li>
          <li>Cumplir obligaciones legales y requerimientos de autoridad.</li>
          <li>Prevenir abuso, fraude y accesos no autorizados.</li>
        </ul>
      </>
    ),
  },
  {
    index: "04",
    title: "Finalidades secundarias",
    content: (
      <>
        <p>
          Cuando exista una base jurídica o consentimiento aplicable, podremos
          utilizar datos de contacto para enviar publicaciones, invitaciones o
          información institucional. La persona titular podrá solicitar en
          cualquier momento dejar de recibir estas comunicaciones.
        </p>
        <p>
          La negativa para finalidades secundarias no condicionará la atención
          de una consulta ni la prestación de servicios contratados.
        </p>
      </>
    ),
  },
  {
    index: "05",
    title: "Transferencias y encargados",
    content: (
      <>
        <p>
          La firma podrá apoyarse en proveedores que traten datos por cuenta de
          XS ABOGADOS para servicios de infraestructura, correo, agenda,
          autenticación, almacenamiento, soporte o seguridad. Dichos terceros
          deberán quedar sujetos a instrucciones y obligaciones de protección
          adecuadas.
        </p>
        <p>
          Podrán realizarse transferencias cuando sean necesarias para cumplir
          obligaciones legales, atender requerimientos de autoridad, ejercer o
          defender derechos, o coordinar servicios profesionales autorizados.
          En cada caso se observarán las bases, finalidades y obligaciones
          previstas por la normativa aplicable.
        </p>
      </>
    ),
  },
  {
    index: "06",
    title: "Derechos ARCO",
    content: (
      <>
        <p>
          La persona titular podrá solicitar acceso, rectificación, cancelación
          u oposición respecto de sus datos personales, conforme a los
          requisitos y excepciones previstos por la normativa aplicable.
        </p>
        <p>
          La solicitud deberá enviarse a {institutionalData.privacyEmail} e
          incluir nombre, medio para recibir respuesta, elementos que permitan
          acreditar identidad o representación, descripción del derecho que se
          desea ejercer y datos que ayuden a localizar la información.
        </p>
        <p>
          La solicitud será atendida conforme a los requisitos, plazos y
          procedimientos previstos por la normativa aplicable.
        </p>
      </>
    ),
  },
  {
    index: "07",
    title: "Revocación y limitación de uso",
    content: (
      <>
        <p>
          También podrá solicitarse la revocación del consentimiento, cuando
          corresponda, o la limitación del uso y divulgación de datos. Estas
          solicitudes se atenderán considerando obligaciones legales,
          contractuales, de conservación y defensa de derechos que resulten
          aplicables.
        </p>
      </>
    ),
  },
  {
    index: "08",
    title: "Cookies y tecnologías similares",
    content: (
      <>
        <p>
          El sitio podrá utilizar tecnologías estrictamente necesarias para
          seguridad, autenticación, conservación de sesión y funcionamiento. Las
          herramientas de analítica o medición opcionales se utilizarán conforme
          a la configuración del sitio y, cuando corresponda, después de obtener
          el consentimiento aplicable.
        </p>
        <p>
          Las personas usuarias podrán administrar las tecnologías opcionales
          mediante los controles disponibles en su navegador o en el propio
          sitio, cuando resulten aplicables.
        </p>
      </>
    ),
  },
  {
    index: "09",
    title: "Seguridad y conservación",
    content: (
      <>
        <p>
          Se aplicarán medidas administrativas, técnicas y físicas razonables
          para proteger la información. Los datos se conservarán durante el
          tiempo necesario para las finalidades autorizadas y para atender
          obligaciones profesionales, legales, fiscales, contractuales o de
          defensa de derechos.
        </p>
        <p>
          Ningún sistema elimina por completo los riesgos; por ello, los canales
          y controles deberán revisarse de manera periódica.
        </p>
      </>
    ),
  },
  {
    index: "10",
    title: "Cambios al aviso y contacto",
    content: (
      <>
        <p>
          Las modificaciones relevantes se comunicarán mediante este sitio y,
          cuando corresponda, por los canales de contacto disponibles. La
          versión vigente permanecerá disponible con su fecha de actualización.
        </p>
        <p>
          Para dudas sobre privacidad, escribe a{" "}
          <a
            href={`mailto:${institutionalData.privacyEmail}`}
            className="underline decoration-black/30 underline-offset-4 hover:decoration-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            {institutionalData.privacyEmail}
          </a>
          .
        </p>
      </>
    ),
  },
] as const;

export default function PrivacyNoticePage() {
  return (
    <div className="bg-paper text-ink">
      <section className="mx-auto max-w-shell px-5 pb-20 pt-36 sm:px-8 sm:pt-44 lg:px-12 lg:pb-28 lg:pt-52">
        <p className="text-xs font-semibold uppercase tracking-editorial text-black/50">
          Legal / Privacidad
        </p>
        <h1 className="mt-10 max-w-6xl font-serif text-[clamp(4rem,10vw,9rem)] leading-[0.8] tracking-[-0.065em]">
          Aviso de
          <br />
          privacidad.
        </h1>
        <p className="mt-12 text-xs font-semibold uppercase tracking-[0.16em] text-black/50">
          Última actualización · 2 de agosto de 2026
        </p>
      </section>

      <section className="border-t border-black/15">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 lg:py-28">
          <p className="mb-16 max-w-3xl text-xl leading-9 text-black/65">
            Este aviso describe el tratamiento de datos personales relacionado
            con el sitio institucional, la agenda, el portal del cliente y los
            canales de contacto de la firma.
          </p>

          <div className="border-t border-black/15">
            {sections.map((section) => (
              <section
                key={section.index}
                className="grid gap-6 border-b border-black/15 py-10 lg:grid-cols-[5rem_0.75fr_1.25fr] lg:gap-10"
              >
                <span className="text-xs tracking-[0.18em] text-black/45">
                  {section.index}
                </span>
                <h2 className="font-serif text-3xl leading-tight tracking-[-0.03em] sm:text-4xl">
                  {section.title}
                </h2>
                <div className="space-y-5 text-base leading-8 text-black/65 [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.85rem] [&_li]:before:h-px [&_li]:before:w-2 [&_li]:before:bg-black/35 [&_ul]:space-y-2">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap gap-4">
            <Link
              href="/terminos"
              className="inline-flex min-h-12 items-center border border-black/20 px-6 text-xs font-semibold uppercase tracking-[0.15em] transition hover:border-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              Consultar términos de uso
            </Link>
            <a
              href={`mailto:${institutionalData.privacyEmail}`}
              className="inline-flex min-h-12 items-center gap-3 bg-ink px-6 text-xs font-semibold uppercase tracking-[0.15em] text-paper transition hover:bg-ink-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              <Mail aria-hidden="true" className="size-4" strokeWidth={1.5} />
              Contacto de privacidad
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
