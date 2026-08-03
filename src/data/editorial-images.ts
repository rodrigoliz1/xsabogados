export type EditorialImage = {
  src: string;
  alt: string;
  label: string;
  credit: string;
  sourceUrl: string;
  position?: string;
};

export const editorialImages = {
  puertaDeHierro: {
    src: "/images/editorial/puerta-de-hierro.webp",
    alt: "Detalle de arquitectura corporativa contemporánea en Puerta de Hierro, Zapopan",
    label: "Puerta de Hierro · Zapopan",
    credit: "",
    sourceUrl:
      "https://unsplash.com/photos/modern-glass-skyscraper-with-curved-architectural-design-rjShh3ApBB8",
    position: "center",
  },
  centroZapopan: {
    src: "/images/editorial/centro-zapopan.webp",
    alt: "Arquitectura contemporánea en el centro de Zapopan vista a través de una estructura geométrica",
    label: "Arquitectura contemporánea · Zapopan",
    credit: "",
    sourceUrl:
      "https://unsplash.com/photos/modern-building-with-geometric-facade-and-glass-roof-IfEy0zwjspE",
    position: "center",
  },
  guadalajaraNocturna: {
    src: "/images/editorial/guadalajara-nocturna.webp",
    alt: "Edificio contemporáneo y trazos de luz durante la noche en Guadalajara",
    label: "Guadalajara · Jalisco",
    credit: "",
    sourceUrl:
      "https://unsplash.com/photos/modern-building-at-night-with-light-trails-p2azHapBFhg",
    position: "center",
  },
  midtownGuadalajara: {
    src: "/images/editorial/midtown-guadalajara.webp",
    alt: "Arquitectura urbana de Midtown Jalisco en Guadalajara",
    label: "Puerta de Hierro · Guadalajara",
    credit: "",
    sourceUrl:
      "https://unsplash.com/photos/modern-buildings-with-reflections-in-water-H9ILdKwV0rY",
    position: "center",
  },
  puertaDeHierro2: {
    src: "/images/editorial/imagen_gdl.jpg",
    alt: "Arquitectura urbana de Midtown Jalisco en Guadalajara",
    label: "Puerta de Hierro · Guadalajara",
    credit: "",
    sourceUrl:
      "https://unsplash.com/photos/modern-buildings-with-reflections-in-water-H9ILdKwV0rY",
    position: "center",
  },
  salaConsejo: {
    src: "/images/editorial/sala-consejo.webp",
    alt: "Sala de consejo contemporánea con mesa y sillones ejecutivos",
    label: "Decisiones con perspectiva",
    credit: "",
    sourceUrl:
      "https://unsplash.com/photos/modern-conference-room-with-leather-chairs-and-table-Q31mm9jfUWU",
    position: "center",
  },
} satisfies Record<string, EditorialImage>;

export const practiceAreaImages = {
  "corporativo-negocios": editorialImages.puertaDeHierro,
  "bancario-financiero": editorialImages.centroZapopan,
  "litigio-solucion-conflictos": editorialImages.guadalajaraNocturna,
  "recuperacion-cartera-insolvencia": editorialImages.salaConsejo,
} satisfies Record<string, EditorialImage>;

export const articleImages = {
  "prevencion-controversias-relaciones-comerciales":
    editorialImages.puertaDeHierro,
  "estrategia-constitucional-actos-autoridad":
    editorialImages.guadalajaraNocturna,
} satisfies Record<string, EditorialImage>;
