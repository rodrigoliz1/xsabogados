export type ArticleSection = {
  heading: string;
  paragraphs: readonly string[];
  points?: readonly string[];
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  practiceArea: string;
  practiceAreaSlug: string;
  publishedAt: string;
  readingTime: string;
  index: string;
  isSample: boolean;
  introduction: readonly string[];
  sections: readonly ArticleSection[];
  relatedSlugs: readonly string[];
  seo: {
    title: string;
    description: string;
    keywords: readonly string[];
  };
};

export const articleDisclaimer =
  "Este contenido es informativo y no constituye asesoría jurídica. Cada asunto requiere un análisis particular de sus hechos y documentos.";

export const articles: readonly Article[] = [
  {
    slug: "prevencion-controversias-relaciones-comerciales",
    title: "Prevención de controversias en relaciones comerciales",
    excerpt:
      "Cinco puntos de control para detectar fricciones contractuales antes de que comprometan una relación de negocio.",
    author: "Equipo editorial XS ABOGADOS",
    practiceArea: "Corporativo & Negocios",
    practiceAreaSlug: "corporativo-negocios",
    publishedAt: "2026-08-02",
    readingTime: "6 min de lectura",
    index: "01",
    isSample: true,
    introduction: [
      "Una relación comercial puede deteriorarse mucho antes de que exista un incumplimiento abierto. Las primeras señales suelen aparecer en cambios de alcance, aprobaciones informales, entregables ambiguos o comunicaciones que ya no coinciden con lo pactado.",
      "La prevención jurídica no consiste únicamente en redactar un contrato extenso. Requiere conservar una lectura actualizada de la operación y establecer mecanismos que permitan identificar, documentar y atender desviaciones a tiempo.",
    ],
    sections: [
      {
        heading: "El contrato debe reflejar la operación real",
        paragraphs: [
          "Cuando la ejecución cotidiana se separa del documento firmado, aumentan las zonas de interpretación. Conviene revisar si el alcance, los responsables, los plazos y los criterios de aceptación siguen correspondiendo a la forma en que las partes trabajan.",
          "Los cambios relevantes deben documentarse mediante el instrumento adecuado. Una cadena de mensajes puede aportar contexto, pero no siempre sustituye una modificación contractual clara.",
        ],
      },
      {
        heading: "Cinco puntos de control",
        paragraphs: [
          "Un sistema preventivo puede ser sencillo si asigna responsables y mantiene evidencia suficiente. Estos puntos ayudan a ordenar la revisión periódica de una relación comercial.",
        ],
        points: [
          "Alcance y entregables definidos con criterios verificables.",
          "Facultades claras de quienes solicitan, autorizan o aceptan cambios.",
          "Calendario de obligaciones, avisos y renovaciones.",
          "Registro de incidencias y acuerdos operativos relevantes.",
          "Mecanismo escalonado para negociar desacuerdos antes del litigio.",
        ],
      },
      {
        heading: "La comunicación también forma parte de la estrategia",
        paragraphs: [
          "Una comunicación tardía o imprecisa puede limitar alternativas. Ante una desviación relevante, resulta útil separar los hechos comprobables, la posición jurídica y el objetivo comercial antes de responder.",
          "Esa disciplina permite negociar con mayor claridad y, si la controversia avanza, conservar una cronología coherente de lo ocurrido.",
        ],
      },
      {
        heading: "Cuándo solicitar una revisión",
        paragraphs: [
          "Una revisión preventiva es especialmente pertinente cuando cambia el modelo de operación, se acumulan excepciones, existe dependencia de un proveedor o cliente, se renegocian precios o aparecen retrasos recurrentes.",
          "La recomendación concreta dependerá del contrato, la evidencia disponible y el marco jurídico aplicable.",
        ],
      },
    ],
    relatedSlugs: [
      "aspectos-esenciales-reestructuracion-deuda",
      "estrategia-constitucional-actos-autoridad",
    ],
    seo: {
      title: "Cómo prevenir controversias en relaciones comerciales",
      description:
        "Puntos de control contractual y operativo para identificar riesgos y prevenir controversias en relaciones comerciales.",
      keywords: [
        "prevención de controversias",
        "contratos mercantiles",
        "riesgos contractuales",
        "abogados corporativos",
      ],
    },
  },
  {
    slug: "aspectos-esenciales-reestructuracion-deuda",
    title: "Aspectos esenciales de una reestructuración de deuda",
    excerpt:
      "Información, prioridades y documentos que permiten evaluar una negociación de deuda con mayor claridad.",
    author: "Equipo editorial XS ABOGADOS",
    practiceArea: "Bancario & Financiero",
    practiceAreaSlug: "bancario-financiero",
    publishedAt: "2026-08-02",
    readingTime: "7 min de lectura",
    index: "02",
    isSample: true,
    introduction: [
      "Una reestructuración de deuda busca reorganizar obligaciones cuando las condiciones originales ya no corresponden a la capacidad de pago, al flujo del negocio o al nivel de riesgo aceptable para las partes.",
      "Su viabilidad depende de información confiable, una lectura completa de los documentos y la capacidad para construir una propuesta que identifique con precisión qué cambia y qué mecanismos respaldarán el nuevo acuerdo.",
    ],
    sections: [
      {
        heading: "El diagnóstico precede a la negociación",
        paragraphs: [
          "Antes de plantear plazos o quitas, es necesario entender el origen del problema, el flujo disponible, las obligaciones prioritarias, las garantías existentes y los eventos de incumplimiento que ya pudieron activarse.",
          "Un diagnóstico incompleto puede conducir a un convenio que solo posponga el conflicto. La propuesta debe construirse sobre supuestos identificables y escenarios que puedan revisarse.",
        ],
      },
      {
        heading: "Documentos que suelen requerir atención",
        paragraphs: [
          "El alcance varía según el financiamiento, pero una revisión ordenada suele considerar los instrumentos que originaron la deuda y aquellos que definen su exigibilidad o respaldo.",
        ],
        points: [
          "Contratos de crédito, pagarés y convenios modificatorios.",
          "Garantías reales, personales o fiduciarias.",
          "Autorizaciones corporativas y facultades de representación.",
          "Estados de cuenta, calendario de pagos y comunicaciones de incumplimiento.",
          "Obligaciones con otros acreedores que puedan afectar la negociación.",
        ],
      },
      {
        heading: "Una propuesta debe distribuir riesgos",
        paragraphs: [
          "Modificar el calendario de pago es solo una parte del acuerdo. También pueden requerirse condiciones de información, obligaciones de hacer o no hacer, nuevas garantías y mecanismos para atender desviaciones futuras.",
          "La documentación debe permitir que todas las partes comprendan cuándo entra en vigor el acuerdo, qué obligaciones permanecen y cuáles son las consecuencias de un nuevo incumplimiento.",
        ],
      },
      {
        heading: "Coordinación entre estrategia financiera y jurídica",
        paragraphs: [
          "La solución requiere que proyecciones, términos económicos y documentos legales sean consistentes. Una modificación financieramente atractiva puede ser inviable si no considera autorizaciones, prelaciones, garantías o restricciones contractuales.",
          "Por ello, la negociación debe avanzar con una matriz común de decisiones, responsables y condiciones de cierre.",
        ],
      },
    ],
    relatedSlugs: [
      "prevencion-controversias-relaciones-comerciales",
      "estrategia-constitucional-actos-autoridad",
    ],
    seo: {
      title: "Aspectos esenciales de una reestructuración de deuda",
      description:
        "Elementos jurídicos y documentales para evaluar una reestructuración financiera o negociación de deuda.",
      keywords: [
        "reestructuración de deuda",
        "negociación de deuda",
        "reestructuración financiera",
        "garantías",
        "insolvencia",
      ],
    },
  },
  {
    slug: "estrategia-constitucional-actos-autoridad",
    title: "La estrategia constitucional frente a actos de autoridad",
    excerpt:
      "Por qué el análisis de efectos, plazos y medidas cautelares debe comenzar desde la primera noticia de un acto de autoridad.",
    author: "Equipo editorial XS ABOGADOS",
    practiceArea: "Administrativo, Fiscal & Constitucional",
    practiceAreaSlug: "administrativo-fiscal-constitucional",
    publishedAt: "2026-08-02",
    readingTime: "6 min de lectura",
    index: "03",
    isSample: true,
    introduction: [
      "La defensa frente a una autoridad comienza con una pregunta concreta: qué acto, resolución u omisión produce la afectación y desde cuándo genera efectos jurídicos o materiales.",
      "Esa definición orienta el análisis de competencia, fundamentación, motivación, vías de impugnación y posibles medidas cautelares. También permite evitar decisiones precipitadas que compliquen la defensa posterior.",
    ],
    sections: [
      {
        heading: "Identificar el acto y sus efectos",
        paragraphs: [
          "No toda comunicación de autoridad tiene la misma naturaleza. Es necesario distinguir entre requerimientos, actos de trámite, resoluciones definitivas, ejecuciones y omisiones, así como documentar la forma y fecha en que fueron conocidos.",
          "El análisis debe considerar tanto el contenido formal como los efectos que ya produce sobre derechos, operaciones, cuentas, permisos o patrimonio.",
        ],
      },
      {
        heading: "Los plazos condicionan la estrategia",
        paragraphs: [
          "Los medios de defensa están sujetos a requisitos y términos distintos. Registrar de inmediato fechas de notificación, conocimiento y ejecución ayuda a preservar alternativas mientras se integra el expediente.",
          "La urgencia no elimina la necesidad de revisar procedencia, definitividad, interés jurídico o legítimo y la relación con otros recursos disponibles.",
        ],
      },
      {
        heading: "La dimensión cautelar",
        paragraphs: [
          "En determinados asuntos, la protección temporal puede ser tan relevante como la resolución de fondo. Para valorar una medida cautelar deben precisarse el riesgo, los efectos que se buscan conservar y las consecuencias para terceros o el interés público.",
        ],
        points: [
          "Efectos actuales y previsibles del acto.",
          "Riesgo de afectaciones difíciles de reparar.",
          "Documentación disponible para sustentar la solicitud.",
          "Obligaciones o garantías que podrían imponerse.",
        ],
      },
      {
        heading: "Construir una cronología verificable",
        paragraphs: [
          "Una cronología acompañada de documentos permite relacionar actuaciones, notificaciones, respuestas y afectaciones. También facilita coordinar equipos internos cuando el asunto involucra componentes regulatorios, fiscales, contractuales o corporativos.",
          "La vía y los argumentos adecuados solo pueden definirse después de revisar las circunstancias específicas del caso.",
        ],
      },
    ],
    relatedSlugs: [
      "prevencion-controversias-relaciones-comerciales",
      "aspectos-esenciales-reestructuracion-deuda",
    ],
    seo: {
      title: "Estrategia constitucional ante actos de autoridad",
      description:
        "Elementos iniciales para analizar actos de autoridad, plazos, medios de defensa y medidas cautelares.",
      keywords: [
        "actos de autoridad",
        "juicio de amparo",
        "estrategia constitucional",
        "medidas cautelares",
        "derecho administrativo",
      ],
    },
  },
] as const;

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesBySlugs(slugs: readonly string[]): Article[] {
  return slugs
    .map((slug) => getArticleBySlug(slug))
    .filter((article): article is Article => Boolean(article));
}
