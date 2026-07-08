import hero1 from "@/assets/hero-1.png";
import hero2 from "@/assets/hero-2.png";
import hero3 from "@/assets/hero-3.png";
import hero4 from "@/assets/hero-4.png";
import vasoVidro from "@/assets/vaso-vidro-sol-da-manha.jpg";
import quadro from "@/assets/mock-quadro.jpg";
import lupaAsset from "@/assets/lupa-polirresina.jpg.asset.json";
const lupa = lupaAsset.url;

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
    slug: "vaso-medio-sol-da-manha",
    name: "Vaso Médio em Vidro — Fio Dourado",
    shortName: "Vaso Médio",
    category: "vaso",
    collection: "sol-da-manha",
    price: 219,
    images: [vasoVidro],
    tagline: "Silhueta oval em vidro cristal com borda em fio dourado",
    description:
      "Vaso em vidro soprado transparente com borda finalizada em fio dourado aplicado à mão. A forma oval alongada acomoda bem galhos secos, pampas ou um único ramo de flor — o vidro deixa a luz atravessar e faz a composição respirar. Peça artesanal: pequenas variações no traço do dourado e no perfil do vidro fazem parte do charme.",
    highlights: [
      "Vidro soprado transparente — peça única",
      "Borda em fio dourado aplicado à mão",
      "Dimensões: 21 × 17 × 17 cm (A × L × Ø)",
      "Ideal para galhos secos, pampas e flores de haste longa",
    ],
  },
  {
    slug: "vaso-baixo-sol-da-manha",
    name: "Vaso Baixo em Vidro — Fio Dourado",
    shortName: "Vaso Baixo",
    category: "vaso",
    collection: "sol-da-manha",
    price: 189,
    images: [vasoVidro],
    tagline: "Volume arredondado em vidro cristal com borda em fio dourado",
    description:
      "Vaso baixo em vidro soprado transparente, com corpo arredondado e borda em fio dourado feito à mão. Perfeito ao lado do vaso médio para criar uma composição em dupla — ou sozinho como ponto de brilho discreto sobre uma mesa lateral, console ou aparador. Cada peça é única, com sutis variações no acabamento dourado.",
    highlights: [
      "Vidro soprado transparente — peça única",
      "Borda em fio dourado aplicado à mão",
      "Dimensões: 13 × 16,5 × 16,5 cm (A × L × Ø)",
      "Perfeito para arranjos baixos, flores curtas ou como objeto solo",
    ],
  },
  {
    slug: "quadro-sol-da-manha",
    name: "Quadro Sol da Manhã",
    shortName: "Quadro",
    category: "quadro",
    collection: "sol-da-manha",
    price: 289,
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
    slug: "lupa-polirresina-sol-da-manha",
    name: "Lupa Decorativa em Polirresina Dourada",
    shortName: "Lupa Decorativa",
    category: "objeto",
    collection: "sol-da-manha",
    price: 179,
    images: [lupa],
    tagline: "Adorno de mesa com aro dourado e base em polirresina",
    description:
      "Lupa decorativa com aro finalizado em dourado e cabo em polirresina. Uma peça de mesa que remete a bibliotecas e ateliers — apoia sobre livros, consoles e escrivaninhas com presença discreta.",
    highlights: [
      "Aro em polirresina com acabamento dourado",
      "Cabo em polirresina",
      "Dimensões: 16,5 × 7,5 × 1,5 cm (A × L × P)",
      "Ideal como adorno para consoles, escrivaninhas e estantes",
    ],
  },
];


export const getProductBySlug = (slug: string) =>
  PRODUCTS.find((p) => p.slug === slug);

export const getProductsByCollection = (collection: string) =>
  PRODUCTS.filter((p) => p.collection === collection);
