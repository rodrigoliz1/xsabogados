import { PrismaClient, UserRole, UserStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORDS = {
  admin: process.env.DEMO_ADMIN_PASSWORD,
  client: process.env.DEMO_CLIENT_PASSWORD,
  lawyer: process.env.DEMO_LAWYER_PASSWORD,
} as const;

const practiceAreas = [
  {
    slug: "corporativo-negocios",
    name: "Corporativo & Negocios",
    shortDescription:
      "Estructuración societaria, contratos y operaciones para decisiones empresariales complejas.",
    body: "Acompañamos a empresas y socios en la estructuración, reorganización y documentación de sus operaciones, con una visión preventiva y orientada a la continuidad del negocio.",
    services: [
      "Constitución y reorganización de sociedades",
      "Gobierno corporativo",
      "Contratos mercantiles",
      "Fusiones y adquisiciones",
      "Joint ventures",
      "Cumplimiento corporativo",
      "Secretarías corporativas",
      "Negociaciones estratégicas",
      "Reestructuración empresarial",
      "Prevención de controversias societarias",
    ],
  },
  {
    slug: "bancario-financiero",
    name: "Bancario & Financiero",
    shortDescription:
      "Diseño jurídico de financiamientos, garantías, fideicomisos y reestructuras.",
    body: "Asesoramos en operaciones bancarias y financieras mediante estructuras claras, documentación precisa y análisis de riesgos jurídicos y patrimoniales.",
    services: [
      "Financiamiento empresarial",
      "Contratos de crédito",
      "Garantías",
      "Fideicomisos",
      "Estructuraciones fiduciarias",
      "Reestructuración financiera",
      "Negociación de deuda",
      "Cumplimiento financiero",
      "Planeación patrimonial",
      "Operaciones bancarias y financieras",
    ],
  },
  {
    slug: "litigio-solucion-conflictos",
    name: "Litigio & Solución de Conflictos",
    shortDescription:
      "Defensa integral en controversias civiles, mercantiles, administrativas, fiscales y constitucionales.",
    body: "Diseñamos estrategias para prevenir, gestionar y resolver controversias entre particulares y frente a autoridades, integrando litigio, medios de impugnación, medidas cautelares, negociación y mecanismos alternativos de solución.",
    services: [
      "Litigio civil",
      "Litigio mercantil",
      "Litigio administrativo",
      "Litigio fiscal",
      "Controversias contractuales",
      "Conflictos societarios y patrimoniales",
      "Juicio de amparo directo e indirecto",
      "Defensa frente a actos de autoridad",
      "Juicio contencioso administrativo y de nulidad",
      "Recursos administrativos y fiscales",
      "Procedimientos administrativos y sancionadores",
      "Determinación y defensa de créditos fiscales",
      "Análisis constitucional de normas, actos y omisiones",
      "Suspensión y medidas cautelares",
      "Ejecución de garantías",
      "Negociación extrajudicial",
      "Mediación y métodos alternativos de solución de controversias",
      "Estrategia preventiva y gestión de riesgos contenciosos",
      "Procedimientos de insolvencia",
    ],
  },
  {
    slug: "recuperacion-cartera-insolvencia",
    name: "Recuperación de Cartera & Reestructuración",
    shortDescription:
      "Diagnóstico, negociación y ejecución para recuperar activos y ordenar adeudos.",
    body: "Integramos análisis documental, negociación y estrategia procesal para atender cartera vencida, garantías, insolvencia y reestructuración de obligaciones.",
    services: [
      "Diagnóstico de cartera",
      "Cobranza extrajudicial",
      "Litigio de recuperación",
      "Negociación y convenios",
      "Ejecución de garantías",
      "Reestructuración de adeudos",
      "Estrategias de pago",
      "Insolvencia",
      "Monitoreo y reportes",
      "Prevención contractual de morosidad",
    ],
  },
] as const;

const lawyers = [
  {
    slug: "victor-silva",
    displayName: "Víctor Silva",
    position: "Socio Director",
    education: "Instituto Tecnológico y de Estudios Superiores de Occidente.",
    image: "/images/team/victor-silva.webp",
    bio: "Abogado egresado del Instituto Tecnológico y de Estudios Superiores de Occidente, con una práctica profesional enfocada en el ámbito jurídico de los negocios. Su experiencia comprende derecho corporativo y financiero, fideicomisos, fusiones y adquisiciones, reestructuración financiera, insolvencia, negociaciones extrajudiciales, así como litigio mercantil, civil y constitucional. Su enfoque combina la estructuración preventiva de operaciones con el diseño de estrategias para la atención de controversias complejas.",
    areas: [
      "corporativo-negocios",
      "bancario-financiero",
      "litigio-solucion-conflictos",
    ],
  },
  {
    slug: "alejandro-guerrero",
    displayName: "Alejandro Guerrero",
    position: "Socio",
    education:
      "Licenciado en Derecho por la Universidad Panamericana, campus Guadalajara, con especialización en Derecho de las Obligaciones y Contratos por la misma institución.",
    image: "/images/team/alejandro-guerrero.webp",
    bio: "Licenciado en Derecho por la Universidad Panamericana, campus Guadalajara. Cuenta con especialización en Derecho de las Obligaciones y Contratos por la misma institución. Su práctica se concentra en litigio civil, mercantil y constitucional, recuperación de cartera vencida, insolvencia y negociaciones extrajudiciales. Se distingue por su capacidad para trasladar el análisis jurídico a soluciones prácticas, estructurando estrategias orientadas a la protección de los intereses de sus clientes y a la resolución eficiente de controversias.",
    areas: ["litigio-solucion-conflictos", "recuperacion-cartera-insolvencia"],
  },
  {
    slug: "isamar-torres",
    displayName: "Isamar Torres",
    position: "Socia",
    education: "Licenciada en Derecho por la Universidad Panamericana.",
    image: "/images/team/isamar-torres.webp",
    bio: "Licenciada en Derecho por la Universidad Panamericana. Su práctica se enfoca en derecho corporativo, derecho bancario, fideicomisos, derecho financiero, reestructuración financiera y contratos. Cuenta con experiencia en el análisis y estructuración de operaciones fiduciarias complejas. Su capacidad de investigación, organización y diseño jurídico le permite participar en soluciones innovadoras para operaciones corporativas y financieras.",
    areas: ["corporativo-negocios", "bancario-financiero"],
  },
  {
    slug: "fernando-velasco",
    displayName: "Fernando Velasco",
    position: "Asociado Senior",
    education:
      "Licenciado en Derecho por la Universidad de Especialidades, en Jalisco, con formación en Métodos Alternativos de Solución de Conflictos.",
    image: "/images/team/fernando-velasco.webp",
    bio: "Licenciado en Derecho por la Universidad de Especialidades, en Jalisco. Cuenta con formación en Métodos Alternativos de Solución de Conflictos. Su práctica se enfoca en litigio civil y mercantil, con especial atención en recuperación de cartera vencida, negociación de adeudos, ejecución de garantías y diseño de estrategias para la solución de controversias patrimoniales. Sus habilidades de comunicación y negociación le permiten representar eficazmente los intereses de sus clientes tanto en procedimientos judiciales como en procesos extrajudiciales. Su enfoque combina análisis jurídico, seguimiento procesal y búsqueda de soluciones viables para la recuperación de activos.",
    areas: ["litigio-solucion-conflictos", "recuperacion-cartera-insolvencia"],
  },
  {
    slug: "rodrigo-lizarraga",
    displayName: "Rodrigo Lizárraga",
    position: "Asociado Senior",
    education:
      "Estudiante de la Licenciatura en Derecho en la Universidad Panamericana, campus Guadalajara.",
    image: "/images/team/rodrigo-lizarraga.webp",
    bio: "Estudiante de la Licenciatura en Derecho en la Universidad Panamericana, campus Guadalajara. Su práctica se desarrolla en el área de litigio y solución de conflictos, con especial interés en derecho administrativo, fiscal y constitucional. Participa en el análisis de asuntos, investigación jurídica, elaboración de proyectos, organización de expedientes y seguimiento de procedimientos. Su formación se caracteriza por el compromiso con el aprendizaje continuo, la precisión en la redacción y el desarrollo de estrategias jurídicas sólidas. Su enfoque lo posiciona como un profesional en desarrollo con alto potencial en el ámbito del litigio especializado.",
    areas: ["litigio-solucion-conflictos"],
  },
  {
    slug: "felipe-ibarra-ibarra",
    displayName: "Felipe Ibarra Ibarra",
    position: "Asociado",
    education:
      "Estudiante de la Licenciatura en Derecho en la Universidad Panamericana, campus Guadalajara.",
    image: null,
    bio: "Estudiante de la Licenciatura en Derecho en la Universidad Panamericana, campus Guadalajara. Su formación se orienta al derecho civil y mercantil, participando en actividades de investigación jurídica, análisis de contratos, organización de expedientes, elaboración de proyectos y seguimiento de controversias. Se distingue por su disposición para el aprendizaje, atención al detalle y compromiso con el desarrollo de soluciones jurídicas claras y bien estructuradas. Su preparación académica y experiencia práctica contribuyen a su crecimiento dentro del área de litigio civil y mercantil.",
    areas: ["litigio-solucion-conflictos"],
  },
  {
    slug: "jose-luis-ahumada",
    displayName: "José Luis Ahumada",
    position: "Asociado",
    education:
      "Estudiante de la Licenciatura en Derecho en la Universidad de Guadalajara.",
    image: null,
    bio: "Estudiante de la Licenciatura en Derecho en la Universidad de Guadalajara. Su formación se enfoca en las áreas de derecho corporativo, bancario y financiero. Participa en actividades de investigación jurídica, análisis documental, elaboración y revisión de instrumentos contractuales, organización de información corporativa y apoyo en la estructuración de operaciones. Se caracteriza por su capacidad de análisis, atención al detalle y compromiso con el aprendizaje constante. Su desarrollo profesional se orienta a comprender las necesidades jurídicas de empresas y operaciones financieras, contribuyendo a la construcción de soluciones ordenadas y eficientes.",
    areas: ["corporativo-negocios", "bancario-financiero"],
  },
  {
    slug: "rodrigo-rubio-gutierrez",
    displayName: "Rodrigo Rubio Gutiérrez",
    position: "Asociado",
    education:
      "Estudiante de la Licenciatura en Derecho en la Universidad Panamericana, campus Guadalajara.",
    image: null,
    bio: "Estudiante de la Licenciatura en Derecho en la Universidad Panamericana, campus Guadalajara. Su formación se orienta al derecho civil y mercantil, participando en actividades de investigación jurídica, análisis de contratos, organización de expedientes, elaboración de proyectos y seguimiento de controversias. Se distingue por su disposición para el aprendizaje, atención al detalle y compromiso con el desarrollo de soluciones jurídicas claras y bien estructuradas. Su preparación académica y experiencia práctica contribuyen a su crecimiento dentro del área de litigio civil y mercantil.",
    areas: ["litigio-solucion-conflictos"],
  },
] as const;

async function upsertDemoUser(input: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  const passwordHash = await hash(input.password, 12);

  return prisma.user.upsert({
    where: { email: input.email },
    update: {
      name: input.name,
      passwordHash,
      role: input.role,
      status: UserStatus.ACTIVE,
    },
    create: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      status: UserStatus.ACTIVE,
    },
  });
}

async function main() {
  if (process.env.VERCEL_ENV === "production") {
    throw new Error(
      "El seed DEMO está deshabilitado permanentemente en producción.",
    );
  }
  if (process.env.ALLOW_DATABASE_SEED !== "true") {
    throw new Error(
      "Define ALLOW_DATABASE_SEED=true de forma explícita para ejecutar el seed DEMO.",
    );
  }
  if (
    !DEMO_PASSWORDS.admin ||
    !DEMO_PASSWORDS.client ||
    !DEMO_PASSWORDS.lawyer
  ) {
    throw new Error(
      "Configura DEMO_ADMIN_PASSWORD, DEMO_CLIENT_PASSWORD y DEMO_LAWYER_PASSWORD antes del seed.",
    );
  }

  const admin = await upsertDemoUser({
    name: "Administración XS — DEMO",
    email: "admin@xs-abogados.local",
    password: DEMO_PASSWORDS.admin,
    role: UserRole.ADMIN,
  });
  const client = await upsertDemoUser({
    name: "Cliente Demostración",
    email: "cliente@xs-abogados.local",
    password: DEMO_PASSWORDS.client,
    role: UserRole.CLIENT,
  });
  const lawyerUser = await upsertDemoUser({
    name: "Alejandro Guerrero",
    email: "abogado@xs-abogados.local",
    password: DEMO_PASSWORDS.lawyer,
    role: UserRole.LAWYER,
  });

  const areaBySlug = new Map<string, { id: string }>();
  for (const [index, area] of practiceAreas.entries()) {
    const saved = await prisma.practiceArea.upsert({
      where: { slug: area.slug },
      update: {
        name: area.name,
        shortDescription: area.shortDescription,
        body: area.body,
        servicesJson: [...area.services],
        faqsJson: [],
        sortOrder: index,
        active: true,
      },
      create: {
        slug: area.slug,
        name: area.name,
        shortDescription: area.shortDescription,
        body: area.body,
        servicesJson: [...area.services],
        faqsJson: [],
        sortOrder: index,
      },
      select: { id: true },
    });
    areaBySlug.set(area.slug, saved);
  }

  await prisma.practiceArea.updateMany({
    where: { slug: "administrativo-fiscal-constitucional" },
    data: { active: false },
  });

  const lawyerBySlug = new Map<string, { id: string }>();
  for (const [index, lawyer] of lawyers.entries()) {
    const saved = await prisma.lawyerProfile.upsert({
      where: { slug: lawyer.slug },
      update: {
        displayName: lawyer.displayName,
        position: lawyer.position,
        bio: lawyer.bio,
        education: lawyer.education,
        image: lawyer.image,
        imageAlt: lawyer.image
          ? `Retrato profesional de ${lawyer.displayName}`
          : null,
        sortOrder: index,
        active: true,
        userId: lawyer.slug === "alejandro-guerrero" ? lawyerUser.id : null,
      },
      create: {
        slug: lawyer.slug,
        displayName: lawyer.displayName,
        position: lawyer.position,
        bio: lawyer.bio,
        education: lawyer.education,
        image: lawyer.image,
        imageAlt: lawyer.image
          ? `Retrato profesional de ${lawyer.displayName}`
          : null,
        sortOrder: index,
        userId: lawyer.slug === "alejandro-guerrero" ? lawyerUser.id : null,
      },
      select: { id: true },
    });
    lawyerBySlug.set(lawyer.slug, saved);

    for (const [areaIndex, areaSlug] of lawyer.areas.entries()) {
      const area = areaBySlug.get(areaSlug);
      if (!area) continue;
      await prisma.lawyerPracticeArea.upsert({
        where: {
          lawyerId_practiceAreaId: {
            lawyerId: saved.id,
            practiceAreaId: area.id,
          },
        },
        update: { isPrimary: areaIndex === 0 },
        create: {
          lawyerId: saved.id,
          practiceAreaId: area.id,
          isPrimary: areaIndex === 0,
        },
      });
    }
  }

  const clientProfile = await prisma.clientProfile.upsert({
    where: { userId: client.id },
    update: {
      phone: "+52 33 0000 0000",
      company: "Empresa Demostración, S.A. de C.V.",
    },
    create: {
      userId: client.id,
      phone: "+52 33 0000 0000",
      company: "Empresa Demostración, S.A. de C.V.",
      notesInternal: "Perfil completamente ficticio para desarrollo local.",
    },
  });

  const matter = await prisma.matter.upsert({
    where: { reference: "DEMO-2026-001" },
    update: {
      clientId: clientProfile.id,
      title: "Asunto mercantil de demostración",
      descriptionPublic:
        "Expediente ficticio para validar el portal del cliente.",
      descriptionInternal: "DEMO: no corresponde a una persona ni asunto real.",
      stage: "ANALYSIS",
      status: "ACTIVE",
    },
    create: {
      reference: "DEMO-2026-001",
      clientId: clientProfile.id,
      title: "Asunto mercantil de demostración",
      descriptionPublic:
        "Expediente ficticio para validar el portal del cliente.",
      descriptionInternal: "DEMO: no corresponde a una persona ni asunto real.",
      stage: "ANALYSIS",
      status: "ACTIVE",
      nextActionPublic: "Revisión de información inicial de demostración.",
      nextActionAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const alejandro = lawyerBySlug.get("alejandro-guerrero");
  if (alejandro) {
    await prisma.matterAssignment.upsert({
      where: {
        matterId_lawyerId: { matterId: matter.id, lawyerId: alejandro.id },
      },
      update: { role: "LEAD" },
      create: { matterId: matter.id, lawyerId: alejandro.id, role: "LEAD" },
    });
  }

  const existingUpdate = await prisma.matterUpdate.findFirst({
    where: {
      matterId: matter.id,
      title: "Recepción y análisis inicial — DEMO",
    },
  });
  if (!existingUpdate) {
    await prisma.matterUpdate.create({
      data: {
        matterId: matter.id,
        title: "Recepción y análisis inicial — DEMO",
        body: "La información ficticia fue recibida y se encuentra en revisión.",
        visibility: "CLIENT",
        createdById: admin.id,
      },
    });
  }

  for (const weekday of [1, 2, 3, 4, 5]) {
    const existing = await prisma.availabilityRule.findFirst({
      where: { lawyerId: null, weekday, active: true },
    });
    if (!existing) {
      await prisma.availabilityRule.create({
        data: {
          weekday,
          startMinutes: 9 * 60,
          endMinutes: 18 * 60,
          durationMinutes: 45,
          bufferMinutes: 15,
          timezone: "America/Mexico_City",
        },
      });
    }
  }

  const articles = [
    {
      slug: "prevencion-controversias-relaciones-comerciales",
      title: "Prevención de controversias en relaciones comerciales",
      excerpt:
        "La claridad contractual y el seguimiento oportuno pueden reducir la incertidumbre en una relación de negocios.",
      area: "corporativo-negocios",
      body: "Este artículo de demostración presenta criterios generales para identificar riesgos contractuales, documentar decisiones y establecer mecanismos de atención temprana. Su contenido no constituye asesoría jurídica para un caso particular.",
    },
    {
      slug: "aspectos-esenciales-reestructuracion-deuda",
      title: "Aspectos esenciales de una reestructuración de deuda",
      excerpt:
        "Una reestructura exige comprender flujos, garantías, prioridades y alternativas de negociación.",
      area: "bancario-financiero",
      body: "Este artículo de demostración explica, en términos generales, la importancia del diagnóstico documental, financiero y operativo antes de negociar una reestructura. Su contenido no constituye asesoría jurídica para un caso particular.",
    },
    {
      slug: "estrategia-constitucional-actos-de-autoridad",
      title:
        "Importancia de una estrategia constitucional ante actos de autoridad",
      excerpt:
        "La oportunidad, la procedencia y los efectos buscados deben evaluarse desde el inicio de una defensa.",
      area: "litigio-solucion-conflictos",
      body: "Este artículo de demostración aborda factores generales para analizar un acto de autoridad y sus posibles medios de defensa. Su contenido no constituye asesoría jurídica para un caso particular.",
    },
  ] as const;

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        body: article.body,
        practiceAreaId: areaBySlug.get(article.area)?.id,
        status: "PUBLISHED",
      },
      create: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        body: article.body,
        authorId: admin.id,
        practiceAreaId: areaBySlug.get(article.area)?.id,
        status: "PUBLISHED",
        publishedAt: new Date("2026-01-15T18:00:00.000Z"),
        readingMinutes: 5,
      },
    });
  }

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", updatedById: admin.id },
  });

  console.info("Seed DEMO creado. Nunca use estas cuentas en producción.");
  console.info("Las contraseñas no se muestran en la salida del proceso.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
