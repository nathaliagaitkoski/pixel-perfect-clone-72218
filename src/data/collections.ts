import solDaManhaHero from "@/assets/collection-sol-da-manha.jpg";

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  heroImage: string;
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "sol-da-manha",
    name: "Sol da Manhã",
    tagline: "Coleção de estreia · 6 peças curadas",
    description:
      "Uma composição em terracota e dourado pensada para ambientes que recebem luz quente — salas, halls e cantos de leitura.",
    longDescription:
      "Sol da Manhã é nossa primeira coleção. Seis peças que conversam entre si — caixas decorativas, vasos, quadro e objeto escultural — em uma paleta quente de terracota, cream e folha dourada. Foram desenhadas para serem montadas juntas, mas cada peça tem presença suficiente para viver sozinha.",
    heroImage: solDaManhaHero,
  },
];

export const getCollectionBySlug = (slug: string) =>
  COLLECTIONS.find((c) => c.slug === slug);
