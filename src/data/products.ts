import hero1 from "@/assets/hero-1.png";
import hero2 from "@/assets/hero-2.png";
import hero3 from "@/assets/hero-3.png";
import hero4 from "@/assets/hero-4.png";
import vasoVidro from "@/assets/vaso-vidro-sol-da-manha.jpg";
import quadro from "@/assets/mock-quadro.jpg";
import objeto from "@/assets/mock-objeto.jpg";

export type ProductCategory = "caixa" | "vaso" | "quadro" | "objeto";

export interface MockProduct {
  slug: string;
  name: string;
  shortName: string;
  category: ProductCategory;
  collection: "sol-da-manha";
  /** Preço atual (com promo de lançamento já aplicada) */
  price: number;
  /** Preço cheio “de” riscado */
  compareAt?: number;
  images: string[];
  /** Linha curta exibida no card */
  tagline: string;
  description: string;
  /** Bullets que aparecem na LP */
  highlights: string[];
  /** Variações simples (ex.: tamanho/cor). Cada variação tem nome + preço opcional. */
  variants?: Array<{ id: string; label: string; price?: number; compareAt?: number }>;
  /** Se true, a LP redireciona pra LP real da caixa em vez da LP mock */
  redirectTo?: string;
  /** Slug de variante a pré-selecionar quando redireciona (Médio/Grande) */
  preselectVariant?: string;
}

export const PRODUCTS: MockProduct[] = [
  {
    slug: "caixa-decorativa-media",
    name: "Caixa Decorativa Média — Terracota & Dourado",
    shortName: "Caixa Média",
    category: "caixa",
    collection: "sol-da-manha",
    price: 159.2,
    compareAt: 199,
    images: [hero1, hero2],
    tagline: "Composição em camadas, com peso visual leve",
    description:
      "Mais do que organizar, peças pensadas para compor ambientes com elegância e intenção.",
    highlights: ["Tampa de madeira maciça", "Acabamento em terracota fosco", "Detalhe em folha dourada"],
    redirectTo: "/produto/caixa-decorativa-terracota-e-dourado-de-luxo",
    preselectVariant: "medio",
  },
  {
    slug: "caixa-decorativa-grande",
    name: "Caixa Decorativa Grande — Terracota & Dourado",
    shortName: "Caixa Grande",
    category: "caixa",
    collection: "sol-da-manha",
    price: 199.2,
    compareAt: 249,
    images: [hero3, hero4],
    tagline: "Peça âncora para console, mesa lateral ou nicho",
    description:
      "Mais do que organizar, peças pensadas para compor ambientes com elegância e intenção.",
    highlights: ["Tampa de madeira maciça", "Acabamento em terracota fosco", "Detalhe em folha dourada"],
    redirectTo: "/produto/caixa-decorativa-terracota-e-dourado-de-luxo",
    preselectVariant: "grande",
  },
  {
    slug: "vaso-alto-sol-da-manha",
    name: "Vaso Alto Sol da Manhã",
    shortName: "Vaso Alto",
    category: "vaso",
    collection: "sol-da-manha",
    price: 179,
    compareAt: 219,
    images: [vasoAlto],
    tagline: "Silhueta esguia, presença discreta",
    description:
      "Cerâmica artesanal em terracota fosco com detalhe em folha dourada feito à mão. Cada peça é única — pequenas variações fazem parte do charme.",
    highlights: [
      "Cerâmica artesanal — peça única",
      "Folha dourada aplicada à mão",
      "Ideal para galhos secos ou flores cortadas",
    ],
  },
  {
    slug: "vaso-baixo-sol-da-manha",
    name: "Vaso Baixo Sol da Manhã",
    shortName: "Vaso Baixo",
    category: "vaso",
    collection: "sol-da-manha",
    price: 149,
    compareAt: 189,
    images: [vasoBaixo],
    tagline: "Volume generoso, gesto contemporâneo",
    description:
      "Cerâmica artesanal em terracota fosco com fio dourado contornando a borda. Composição perfeita ao lado do vaso alto.",
    highlights: [
      "Cerâmica artesanal — peça única",
      "Borda em fio dourado",
      "Perfeito para pampas e arranjos secos",
    ],
  },
  {
    slug: "quadro-sol-da-manha",
    name: "Quadro Sol da Manhã",
    shortName: "Quadro",
    category: "quadro",
    collection: "sol-da-manha",
    price: 229,
    compareAt: 289,
    images: [quadro],
    tagline: "Arte abstrata em terracota e dourado",
    description:
      "Impressão fine art em papel algodão 310g, com moldura em carvalho natural e passepartout cru. Assinado em série limitada.",
    highlights: [
      "Impressão fine art 310g/m²",
      "Moldura em carvalho natural",
      "Edição limitada e numerada",
    ],
  },
  {
    slug: "objeto-decorativo-sol-da-manha",
    name: "Objeto Decorativo Sol da Manhã",
    shortName: "Objeto Decorativo",
    category: "objeto",
    collection: "sol-da-manha",
    price: 139,
    compareAt: 179,
    images: [objeto],
    tagline: "Forma orgânica, peso na composição",
    description:
      "Escultura decorativa em cerâmica terracota com acentos em folha dourada. Funciona como ponto de luz em prateleiras e mesas.",
    highlights: [
      "Escultura em cerâmica maciça",
      "Acentos em folha dourada feitos à mão",
      "Apoio em feltro para proteger superfícies",
    ],
  },
];

export const getProductBySlug = (slug: string) =>
  PRODUCTS.find((p) => p.slug === slug);

export const getProductsByCollection = (collection: string) =>
  PRODUCTS.filter((p) => p.collection === collection);
