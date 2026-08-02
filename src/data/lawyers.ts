export type TeamFilterKey =
  "partners" | "corporate-finance" | "disputes" | "public-law";

export type Lawyer = {
  slug: string;
  name: string;
  initials: string;
  role: "Socio" | "Socia" | "Asociado Senior" | "Asociado";
  primaryArea: string;
  areas: readonly string[];
  filters: readonly TeamFilterKey[];
  biography: readonly string[];
  education: readonly string[];
  focus: readonly string[];
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
};

export const teamFilters: readonly {
  key: "all" | TeamFilterKey;
  label: string;
}[] = [
  { key: "all", label: "Todo el equipo" },
  { key: "partners", label: "Socios" },
  {
    key: "corporate-finance",
    label: "Corporativo, Bancario & Financiero",
  },
  { key: "disputes", label: "Litigio & Solución de Conflictos" },
  {
    key: "public-law",
    label: "Administrativo, Fiscal & Constitucional",
  },
] as const;

export const lawyers: readonly Lawyer[] = [
  {
    slug: "victor-silva",
    name: "Víctor Silva",
    initials: "VS",
    role: "Socio",
    primaryArea: "Corporativo & Negocios",
    areas: [
      "Corporativo & Negocios",
      "Bancario & Financiero",
      "Litigio Mercantil y Reestructuración",
    ],
    filters: ["partners", "corporate-finance", "disputes"],
    biography: [
      "Abogado egresado del Instituto Tecnológico y de Estudios Superiores de Occidente, con una práctica profesional enfocada en el ámbito jurídico de los negocios.",
      "Su experiencia comprende derecho corporativo y financiero, fideicomisos, fusiones y adquisiciones, reestructuración financiera, insolvencia, negociaciones extrajudiciales, así como litigio mercantil, civil y constitucional.",
      "Su enfoque combina la estructuración preventiva de operaciones con el diseño de estrategias para la atención de controversias complejas.",
    ],
    education: [
      "Egresado del Instituto Tecnológico y de Estudios Superiores de Occidente.",
    ],
    focus: [
      "Estructuración corporativa y financiera",
      "Fideicomisos, fusiones y adquisiciones",
      "Reestructuración financiera e insolvencia",
      "Litigio mercantil, civil y constitucional",
      "Negociaciones extrajudiciales",
    ],
    image: "/images/team/victor-silva.webp",
    imageAlt: "Retrato profesional de Víctor Silva, socio de XS ABOGADOS",
    imagePosition: "center 20%",
  },
  {
    slug: "alejandro-guerrero",
    name: "Alejandro Guerrero",
    initials: "AG",
    role: "Socio",
    primaryArea: "Litigio & Solución de Conflictos",
    areas: ["Litigio & Solución de Conflictos"],
    filters: ["partners", "disputes"],
    biography: [
      "Licenciado en Derecho por la Universidad Panamericana, campus Guadalajara. Cuenta con especialización en Derecho de las Obligaciones y Contratos por la misma institución.",
      "Su práctica se concentra en litigio civil, mercantil y constitucional, recuperación de cartera vencida, insolvencia y negociaciones extrajudiciales.",
      "Se distingue por su capacidad para trasladar el análisis jurídico a soluciones prácticas, estructurando estrategias orientadas a la protección de los intereses de sus clientes y a la resolución eficiente de controversias.",
    ],
    education: [
      "Licenciado en Derecho por la Universidad Panamericana, campus Guadalajara.",
      "Especialización en Derecho de las Obligaciones y Contratos por la Universidad Panamericana.",
    ],
    focus: [
      "Litigio civil, mercantil y constitucional",
      "Recuperación de cartera vencida",
      "Insolvencia",
      "Negociaciones extrajudiciales",
      "Diseño de estrategias para controversias",
    ],
    image: "/images/team/alejandro-guerrero.webp",
    imageAlt: "Retrato profesional de Alejandro Guerrero, socio de XS ABOGADOS",
    imagePosition: "center 18%",
  },
  {
    slug: "isamar-torres",
    name: "Isamar Torres",
    initials: "IT",
    role: "Socia",
    primaryArea: "Corporativo, Bancario & Financiero",
    areas: ["Corporativo, Bancario & Financiero"],
    filters: ["partners", "corporate-finance"],
    biography: [
      "Licenciada en Derecho por la Universidad Panamericana.",
      "Su práctica se enfoca en derecho corporativo, derecho bancario, fideicomisos, derecho financiero, reestructuración financiera y contratos.",
      "Cuenta con experiencia en el análisis y estructuración de operaciones fiduciarias complejas. Su capacidad de investigación, organización y diseño jurídico le permite participar en soluciones innovadoras para operaciones corporativas y financieras.",
    ],
    education: ["Licenciada en Derecho por la Universidad Panamericana."],
    focus: [
      "Derecho corporativo, bancario y financiero",
      "Fideicomisos y operaciones fiduciarias complejas",
      "Reestructuración financiera",
      "Contratos",
      "Investigación y diseño jurídico",
    ],
    image: "/images/team/isamar-torres.webp",
    imageAlt: "Retrato profesional de Isamar Torres, socia de XS ABOGADOS",
    imagePosition: "center 18%",
  },
  {
    slug: "fernando-velasco",
    name: "Fernando Velasco",
    initials: "FV",
    role: "Asociado Senior",
    primaryArea: "Litigio & Solución de Conflictos",
    areas: [
      "Litigio & Solución de Conflictos",
      "Recuperación de Cartera Vencida",
    ],
    filters: ["disputes"],
    biography: [
      "Licenciado en Derecho por la Universidad de Especialidades, en Jalisco. Cuenta con formación en Métodos Alternativos de Solución de Conflictos.",
      "Su práctica se enfoca en litigio civil y mercantil, con especial atención en recuperación de cartera vencida, negociación de adeudos, ejecución de garantías y diseño de estrategias para la solución de controversias patrimoniales.",
      "Sus habilidades de comunicación y negociación le permiten representar eficazmente los intereses de sus clientes tanto en procedimientos judiciales como en procesos extrajudiciales. Su enfoque combina análisis jurídico, seguimiento procesal y búsqueda de soluciones viables para la recuperación de activos.",
    ],
    education: [
      "Licenciado en Derecho por la Universidad de Especialidades, en Jalisco.",
      "Formación en Métodos Alternativos de Solución de Conflictos.",
    ],
    focus: [
      "Litigio civil y mercantil",
      "Recuperación de cartera vencida",
      "Negociación de adeudos",
      "Ejecución de garantías",
      "Controversias patrimoniales",
    ],
    image: "/images/team/fernando-velasco.webp",
    imageAlt:
      "Retrato profesional de Fernando Velasco, asociado senior de XS ABOGADOS",
    imagePosition: "center 18%",
  },
  {
    slug: "rodrigo-lizarraga",
    name: "Rodrigo Lizárraga",
    initials: "RL",
    role: "Asociado Senior",
    primaryArea: "Litigio & Solución de Conflictos",
    areas: [
      "Litigio & Solución de Conflictos",
      "Derecho Administrativo, Fiscal & Constitucional",
    ],
    filters: ["disputes", "public-law"],
    biography: [
      "Estudiante de la Licenciatura en Derecho en la Universidad Panamericana, campus Guadalajara.",
      "Su práctica se desarrolla en el área de litigio y solución de conflictos, con especial interés en derecho administrativo, fiscal y constitucional.",
      "Participa en el análisis de asuntos, investigación jurídica, elaboración de proyectos, organización de expedientes y seguimiento de procedimientos. Su formación se caracteriza por el compromiso con el aprendizaje continuo, la precisión en la redacción y el desarrollo de estrategias jurídicas sólidas.",
      "Su enfoque lo posiciona como un profesional en desarrollo con alto potencial en el ámbito del litigio especializado.",
    ],
    education: [
      "Estudiante de la Licenciatura en Derecho en la Universidad Panamericana, campus Guadalajara.",
    ],
    focus: [
      "Derecho administrativo, fiscal y constitucional",
      "Investigación y análisis jurídico",
      "Elaboración de proyectos",
      "Organización de expedientes",
      "Seguimiento de procedimientos",
    ],
    image: "/images/team/rodrigo-lizarraga.webp",
    imageAlt:
      "Retrato profesional de Rodrigo Lizárraga, asociado senior de XS ABOGADOS",
    imagePosition: "center 18%",
  },
  {
    slug: "felipe-ibarra-ibarra",
    name: "Felipe Ibarra Ibarra",
    initials: "FII",
    role: "Asociado",
    primaryArea: "Litigio Civil & Mercantil",
    areas: ["Litigio Civil & Mercantil"],
    filters: ["disputes"],
    biography: [
      "Estudiante de la Licenciatura en Derecho en la Universidad Panamericana, campus Guadalajara.",
      "Su formación se orienta al derecho civil y mercantil, participando en actividades de investigación jurídica, análisis de contratos, organización de expedientes, elaboración de proyectos y seguimiento de controversias.",
      "Se distingue por su disposición para el aprendizaje, atención al detalle y compromiso con el desarrollo de soluciones jurídicas claras y bien estructuradas. Su preparación académica y experiencia práctica contribuyen a su crecimiento dentro del área de litigio civil y mercantil.",
    ],
    education: [
      "Estudiante de la Licenciatura en Derecho en la Universidad Panamericana, campus Guadalajara.",
    ],
    focus: [
      "Derecho civil y mercantil",
      "Investigación jurídica",
      "Análisis de contratos",
      "Organización de expedientes",
      "Seguimiento de controversias",
    ],
  },
  {
    slug: "jose-luis-ahumada",
    name: "José Luis Ahumada",
    initials: "JLA",
    role: "Asociado",
    primaryArea: "Corporativo, Bancario & Financiero",
    areas: ["Corporativo, Bancario & Financiero"],
    filters: ["corporate-finance"],
    biography: [
      "Estudiante de la Licenciatura en Derecho en la Universidad de Guadalajara.",
      "Su formación se enfoca en las áreas de derecho corporativo, bancario y financiero. Participa en actividades de investigación jurídica, análisis documental, elaboración y revisión de instrumentos contractuales, organización de información corporativa y apoyo en la estructuración de operaciones.",
      "Se caracteriza por su capacidad de análisis, atención al detalle y compromiso con el aprendizaje constante. Su desarrollo profesional se orienta a comprender las necesidades jurídicas de empresas y operaciones financieras, contribuyendo a la construcción de soluciones ordenadas y eficientes.",
    ],
    education: [
      "Estudiante de la Licenciatura en Derecho en la Universidad de Guadalajara.",
    ],
    focus: [
      "Derecho corporativo, bancario y financiero",
      "Investigación jurídica y análisis documental",
      "Instrumentos contractuales",
      "Organización de información corporativa",
      "Apoyo en la estructuración de operaciones",
    ],
  },
] as const;

export function getLawyerBySlug(slug: string): Lawyer | undefined {
  return lawyers.find((lawyer) => lawyer.slug === slug);
}

export function getLawyersBySlugs(slugs: readonly string[]): Lawyer[] {
  return slugs
    .map((slug) => getLawyerBySlug(slug))
    .filter((lawyer): lawyer is Lawyer => Boolean(lawyer));
}
