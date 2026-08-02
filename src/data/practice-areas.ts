export type PracticeMethodStep = {
  number: string;
  title: string;
  description: string;
};

export type PracticeFaq = {
  question: string;
  answer: string;
};

export type PracticeArea = {
  slug: string;
  title: string;
  shortTitle: string;
  index: string;
  shortDescription: string;
  summary: string;
  introduction: readonly string[];
  problems: readonly string[];
  services: readonly string[];
  method: readonly PracticeMethodStep[];
  relatedLawyerSlugs: readonly string[];
  faqs: readonly PracticeFaq[];
  seo: {
    title: string;
    description: string;
    keywords: readonly string[];
  };
};

export const legalInformationDisclaimer =
  "La información presentada es de carácter general y no constituye asesoría jurídica para un caso particular.";

export const practiceAreas: readonly PracticeArea[] = [
  {
    slug: "corporativo-negocios",
    title: "Corporativo & Negocios",
    shortTitle: "Corporativo",
    index: "01",
    shortDescription:
      "Estructuras jurídicas claras para operar, crecer y tomar decisiones empresariales con una lectura integral del riesgo.",
    summary:
      "Estructuras jurídicas claras para operar, crecer y tomar decisiones empresariales con una lectura integral del riesgo.",
    introduction: [
      "Acompañamos a empresas, socios e inversionistas en la organización jurídica de sus operaciones y relaciones comerciales.",
      "La práctica integra prevención, documentación y negociación para que cada decisión corporativa responda al contexto real del negocio y mantenga una estructura ordenada.",
    ],
    problems: [
      "Constitución, transformación o reorganización de vehículos societarios.",
      "Definición de reglas entre socios, órganos de gobierno y equipos directivos.",
      "Negociación de contratos y alianzas comerciales relevantes.",
      "Revisión jurídica de adquisiciones, inversiones y reorganizaciones.",
      "Identificación temprana de riesgos societarios y contractuales.",
    ],
    services: [
      "Constitución y reorganización de sociedades.",
      "Gobierno corporativo.",
      "Contratos mercantiles.",
      "Fusiones y adquisiciones.",
      "Joint ventures.",
      "Cumplimiento corporativo.",
      "Secretarías corporativas.",
      "Negociaciones estratégicas.",
      "Reestructuración empresarial.",
      "Prevención de controversias societarias.",
    ],
    method: [
      {
        number: "01",
        title: "Comprensión del negocio",
        description:
          "Revisamos la operación, sus participantes y los objetivos que debe sostener la estructura jurídica.",
      },
      {
        number: "02",
        title: "Mapa de riesgos",
        description:
          "Identificamos decisiones críticas, obligaciones y puntos de posible fricción corporativa o contractual.",
      },
      {
        number: "03",
        title: "Diseño jurídico",
        description:
          "Estructuramos documentos, mecanismos de gobierno y rutas de implementación acordes con el proyecto.",
      },
      {
        number: "04",
        title: "Implementación y seguimiento",
        description:
          "Acompañamos la formalización y mantenemos trazabilidad sobre acuerdos, tareas y próximos pasos.",
      },
    ],
    relatedLawyerSlugs: ["victor-silva", "isamar-torres", "jose-luis-ahumada"],
    faqs: [
      {
        question: "¿En qué momento conviene revisar la estructura corporativa?",
        answer:
          "Es recomendable hacerlo antes de incorporar inversionistas, modificar participaciones, iniciar una expansión, asumir financiamiento relevante o cuando las reglas internas ya no reflejan la operación actual.",
      },
      {
        question: "¿La asesoría incluye la negociación de contratos?",
        answer:
          "Sí. El alcance puede comprender diagnóstico, redacción, revisión, negociación y formalización, conforme a las necesidades de cada operación.",
      },
      {
        question: "¿Pueden intervenir antes de que exista una controversia?",
        answer:
          "Sí. Una parte central de la práctica consiste en identificar riesgos y establecer reglas claras antes de que una diferencia afecte la operación.",
      },
    ],
    seo: {
      title: "Abogados corporativos y de negocios en Guadalajara",
      description:
        "Asesoría de XS ABOGADOS en sociedades, gobierno corporativo, contratos mercantiles, fusiones, adquisiciones y negociaciones estratégicas.",
      keywords: [
        "abogados corporativos",
        "derecho corporativo Guadalajara",
        "contratos mercantiles",
        "fusiones y adquisiciones",
        "gobierno corporativo",
      ],
    },
  },
  {
    slug: "bancario-financiero",
    title: "Bancario & Financiero",
    shortTitle: "Bancario",
    index: "02",
    shortDescription:
      "Estructuración jurídica para financiamientos, operaciones fiduciarias y decisiones que requieren equilibrio entre negocio, regulación y riesgo.",
    summary:
      "Estructuración jurídica para financiamientos, operaciones fiduciarias y decisiones que requieren equilibrio entre negocio, regulación y riesgo.",
    introduction: [
      "Asesoramos en operaciones bancarias y financieras desde su diagnóstico hasta la negociación y formalización de sus instrumentos.",
      "El trabajo se concentra en traducir objetivos financieros a estructuras jurídicas comprensibles, documentadas y consistentes con las obligaciones aplicables.",
    ],
    problems: [
      "Diseño y negociación de financiamientos empresariales.",
      "Estructuración de garantías y vehículos fiduciarios.",
      "Revisión de contratos de crédito y obligaciones financieras.",
      "Reestructuración y negociación de deuda.",
      "Organización patrimonial y cumplimiento financiero.",
    ],
    services: [
      "Financiamiento empresarial.",
      "Contratos de crédito.",
      "Garantías.",
      "Fideicomisos.",
      "Estructuraciones fiduciarias.",
      "Reestructuración financiera.",
      "Negociación de deuda.",
      "Cumplimiento financiero.",
      "Planeación patrimonial.",
      "Operaciones bancarias y financieras.",
    ],
    method: [
      {
        number: "01",
        title: "Diagnóstico de la operación",
        description:
          "Analizamos participantes, flujos, obligaciones y objetivos antes de proponer una estructura.",
      },
      {
        number: "02",
        title: "Estructuración",
        description:
          "Definimos instrumentos, garantías, condiciones y mecanismos de administración o pago.",
      },
      {
        number: "03",
        title: "Negociación documental",
        description:
          "Coordinamos la revisión de contratos y documentos relacionados con una visión integral de riesgo.",
      },
      {
        number: "04",
        title: "Cierre y seguimiento",
        description:
          "Acompañamos la formalización y organizamos las obligaciones que permanecen después del cierre.",
      },
    ],
    relatedLawyerSlugs: ["victor-silva", "isamar-torres", "jose-luis-ahumada"],
    faqs: [
      {
        question:
          "¿Qué información se requiere para revisar un financiamiento?",
        answer:
          "Depende de la operación. Generalmente se revisan el objetivo del financiamiento, participantes, flujo de pago, documentos corporativos, garantías propuestas y términos económicos preliminares.",
      },
      {
        question: "¿Asesoran tanto a acreditantes como a acreditados?",
        answer:
          "La firma puede evaluar operaciones desde distintas posiciones, siempre después de realizar la revisión de conflictos y definir claramente el alcance de la representación.",
      },
      {
        question: "¿La reestructuración implica necesariamente un litigio?",
        answer:
          "No. Existen rutas de negociación y reorganización extrajudicial. La estrategia adecuada depende de la documentación, las partes involucradas y la situación financiera concreta.",
      },
    ],
    seo: {
      title: "Derecho bancario y financiero | XS ABOGADOS",
      description:
        "Asesoría en financiamiento empresarial, fideicomisos, garantías, contratos de crédito, reestructuración financiera y negociación de deuda.",
      keywords: [
        "derecho bancario y financiero",
        "abogados financieros Guadalajara",
        "fideicomisos",
        "contratos de crédito",
        "reestructuración financiera",
      ],
    },
  },
  {
    slug: "litigio-solucion-conflictos",
    title: "Litigio & Solución de Conflictos",
    shortTitle: "Litigio",
    index: "03",
    shortDescription:
      "Estrategias para controversias civiles, mercantiles y constitucionales, con lectura procesal y alternativas de negociación.",
    summary:
      "Estrategias para controversias civiles, mercantiles y constitucionales, con lectura procesal y alternativas de negociación.",
    introduction: [
      "Intervenimos en controversias que requieren una comprensión precisa de los hechos, la documentación y el entorno procesal.",
      "Cada asunto se analiza para definir una ruta que pueda integrar litigio, negociación extrajudicial o medios alternativos, sin perder de vista los objetivos y riesgos del cliente.",
    ],
    problems: [
      "Incumplimientos contractuales y controversias patrimoniales.",
      "Conflictos civiles o mercantiles entre empresas y particulares.",
      "Necesidad de medidas cautelares o ejecución de garantías.",
      "Negociaciones complejas previas o paralelas al litigio.",
      "Escenarios de insolvencia y prevención de conflictos.",
    ],
    services: [
      "Litigio civil.",
      "Litigio mercantil.",
      "Juicio de amparo.",
      "Controversias contractuales.",
      "Medidas cautelares.",
      "Ejecución de garantías.",
      "Negociación extrajudicial.",
      "Mediación.",
      "Estrategia preventiva.",
      "Procedimientos de insolvencia.",
    ],
    method: [
      {
        number: "01",
        title: "Lectura integral",
        description:
          "Ordenamos hechos, documentos, intereses y restricciones para comprender la controversia completa.",
      },
      {
        number: "02",
        title: "Diagnóstico procesal",
        description:
          "Evaluamos vías disponibles, cargas probatorias, plazos, riesgos y posibles medidas de protección.",
      },
      {
        number: "03",
        title: "Estrategia de intervención",
        description:
          "Definimos una ruta judicial, extrajudicial o combinada, con objetivos y decisiones trazables.",
      },
      {
        number: "04",
        title: "Ejecución y comunicación",
        description:
          "Damos seguimiento al procedimiento y comunicamos avances relevantes con lenguaje claro.",
      },
    ],
    relatedLawyerSlugs: [
      "alejandro-guerrero",
      "fernando-velasco",
      "rodrigo-lizarraga",
      "felipe-ibarra-ibarra",
      "victor-silva",
    ],
    faqs: [
      {
        question: "¿Todo conflicto debe llegar a juicio?",
        answer:
          "No. Dependiendo de los hechos y objetivos, pueden evaluarse negociación, mediación u otras alternativas. La viabilidad de cada ruta requiere revisar el caso concreto.",
      },
      {
        question: "¿Qué documentos conviene reunir para una primera revisión?",
        answer:
          "Contratos, comunicaciones relevantes, comprobantes, resoluciones, cronologías y cualquier documento relacionado. La firma indicará después qué información adicional es necesaria.",
      },
      {
        question:
          "¿Pueden atender una controversia antes de que exista una demanda?",
        answer:
          "Sí. Una intervención temprana permite valorar riesgos, conservar evidencia y explorar soluciones antes de que el conflicto avance.",
      },
    ],
    seo: {
      title: "Litigio civil y mercantil en Guadalajara | XS ABOGADOS",
      description:
        "Representación y estrategia en litigio civil y mercantil, controversias contractuales, amparo, medidas cautelares y negociación extrajudicial.",
      keywords: [
        "litigio civil y mercantil",
        "abogados mercantiles Guadalajara",
        "controversias contractuales",
        "juicio de amparo",
        "solución de conflictos",
      ],
    },
  },
  {
    slug: "administrativo-fiscal-constitucional",
    title: "Administrativo, Fiscal & Constitucional",
    shortTitle: "Administrativo",
    index: "04",
    shortDescription:
      "Defensa y análisis estratégico frente a actos de autoridad, procedimientos administrativos y controversias fiscales o constitucionales.",
    summary:
      "Defensa y análisis estratégico frente a actos de autoridad, procedimientos administrativos y controversias fiscales o constitucionales.",
    introduction: [
      "Atendemos asuntos en los que una actuación, resolución u omisión de autoridad puede afectar derechos, operaciones o patrimonio.",
      "La práctica articula análisis constitucional, estrategia procesal y comprensión regulatoria para identificar medios de defensa y medidas oportunas en cada caso.",
    ],
    problems: [
      "Actos de autoridad que requieren revisión o defensa inmediata.",
      "Procedimientos y recursos ante autoridades administrativas.",
      "Determinaciones o controversias de naturaleza fiscal.",
      "Necesidad de medidas cautelares o suspensión.",
      "Evaluación constitucional de normas, resoluciones u omisiones.",
    ],
    services: [
      "Defensa frente a actos de autoridad.",
      "Juicio de amparo.",
      "Procedimientos administrativos.",
      "Recursos administrativos.",
      "Controversias fiscales.",
      "Nulidad administrativa.",
      "Medidas cautelares.",
      "Análisis constitucional.",
      "Estrategia regulatoria.",
      "Protección de derechos frente a autoridades.",
    ],
    method: [
      {
        number: "01",
        title: "Revisión del acto",
        description:
          "Analizamos la autoridad, el acto reclamado, sus efectos y la documentación disponible.",
      },
      {
        number: "02",
        title: "Control de plazos",
        description:
          "Identificamos términos, requisitos y decisiones urgentes para preservar las vías de defensa disponibles.",
      },
      {
        number: "03",
        title: "Diseño de la defensa",
        description:
          "Construimos argumentos, medios de impugnación y solicitudes cautelares conforme al caso.",
      },
      {
        number: "04",
        title: "Seguimiento estratégico",
        description:
          "Monitoreamos el procedimiento y ajustamos la ruta frente a nuevas actuaciones o resoluciones.",
      },
    ],
    relatedLawyerSlugs: [
      "rodrigo-lizarraga",
      "alejandro-guerrero",
      "victor-silva",
    ],
    faqs: [
      {
        question:
          "¿Por qué es importante revisar de inmediato un acto de autoridad?",
        answer:
          "Porque los medios de defensa suelen estar sujetos a plazos. Una revisión oportuna permite identificar fechas, efectos y medidas posibles sin prejuzgar sobre el resultado.",
      },
      {
        question: "¿El juicio de amparo procede contra cualquier acto?",
        answer:
          "No necesariamente. Su procedencia depende, entre otros elementos, del acto, la autoridad, la afectación y la existencia de otros medios de defensa. Se requiere un análisis particular.",
      },
      {
        question: "¿La estrategia puede incluir recursos administrativos?",
        answer:
          "Sí. Según el asunto, pueden evaluarse recursos, juicios de nulidad, amparo u otras vías, así como medidas cautelares relacionadas.",
      },
    ],
    seo: {
      title: "Derecho administrativo, fiscal y constitucional",
      description:
        "Defensa ante actos de autoridad, procedimientos administrativos, controversias fiscales, juicio de amparo y análisis constitucional.",
      keywords: [
        "derecho administrativo y fiscal",
        "juicio de amparo",
        "defensa ante actos de autoridad",
        "nulidad administrativa",
        "abogados constitucionales",
      ],
    },
  },
  {
    slug: "recuperacion-cartera-insolvencia",
    title: "Recuperación de Cartera & Reestructuración",
    shortTitle: "Recuperación",
    index: "05",
    shortDescription:
      "Diagnóstico, negociación y ejecución coordinada para administrar cartera vencida, recuperar activos y ordenar adeudos.",
    summary:
      "Diagnóstico, negociación y ejecución coordinada para administrar cartera vencida, recuperar activos y ordenar adeudos.",
    introduction: [
      "Diseñamos estrategias de recuperación a partir de la calidad documental, la situación del deudor y las alternativas reales de negociación o ejecución.",
      "El enfoque combina gestión extrajudicial, litigio y reestructuración para priorizar recursos, mantener trazabilidad y tomar decisiones informadas sobre cada cuenta.",
    ],
    problems: [
      "Carteras con diferentes niveles de antigüedad, documentación y recuperabilidad.",
      "Adeudos que requieren negociación, convenio o reestructura.",
      "Incumplimientos respaldados por garantías susceptibles de ejecución.",
      "Necesidad de reportes claros sobre acciones y estado de recuperación.",
      "Prevención de morosidad mediante mejores documentos y procesos.",
    ],
    services: [
      "Diagnóstico de cartera.",
      "Cobranza extrajudicial.",
      "Litigio de recuperación.",
      "Negociación y convenios.",
      "Ejecución de garantías.",
      "Reestructuración de adeudos.",
      "Estrategias de pago.",
      "Insolvencia.",
      "Monitoreo y reportes.",
      "Prevención contractual de morosidad.",
    ],
    method: [
      {
        number: "01",
        title: "Segmentación de cartera",
        description:
          "Ordenamos expedientes por monto, antigüedad, documentación, garantías y condiciones del deudor.",
      },
      {
        number: "02",
        title: "Ruta de recuperación",
        description:
          "Definimos prioridades y determinamos si conviene negociar, reestructurar, demandar o combinar acciones.",
      },
      {
        number: "03",
        title: "Gestión coordinada",
        description:
          "Ejecutamos comunicaciones, convenios, actuaciones judiciales y medidas relacionadas con cada expediente.",
      },
      {
        number: "04",
        title: "Monitoreo",
        description:
          "Presentamos avances y decisiones pendientes para mantener control sobre el portafolio.",
      },
    ],
    relatedLawyerSlugs: [
      "fernando-velasco",
      "alejandro-guerrero",
      "victor-silva",
      "isamar-torres",
    ],
    faqs: [
      {
        question: "¿Qué se analiza antes de iniciar una recuperación?",
        answer:
          "Se revisan documentos, vencimiento, comunicaciones, garantías, solvencia conocida, prescripción y antecedentes de negociación, entre otros elementos relevantes.",
      },
      {
        question: "¿Es posible trabajar una cartera completa?",
        answer:
          "Sí. La cartera puede segmentarse para definir prioridades y estrategias distintas, manteniendo reportes sobre el avance de cada grupo de cuentas.",
      },
      {
        question: "¿La reestructuración sustituye la recuperación judicial?",
        answer:
          "No siempre. Puede ser una alternativa o formar parte de una estrategia combinada. La decisión depende del expediente y de la viabilidad jurídica y financiera del acuerdo.",
      },
    ],
    seo: {
      title: "Recuperación de cartera y reestructuración de adeudos",
      description:
        "Diagnóstico de cartera, cobranza extrajudicial, litigio de recuperación, ejecución de garantías, convenios e insolvencia.",
      keywords: [
        "recuperación de cartera",
        "cartera vencida",
        "cobranza judicial",
        "reestructuración de adeudos",
        "ejecución de garantías",
      ],
    },
  },
] as const;

export function getPracticeAreaBySlug(slug: string): PracticeArea | undefined {
  return practiceAreas.find((area) => area.slug === slug);
}
