// Plain product data for MCP (no image asset imports — safe for Deno bundling).
export type ProductCategory = "caixa" | "vaso" | "quadro" | "objeto";

export interface McpProduct {
  slug: string;
  name: string;
  shortName: string;
  category: ProductCategory;
  collection: "sol-da-manha";
  price: number;
  compareAt?: number;
  tagline: string;
  description: string;
  highlights: string[];
  variants?: Array<{ id: string; label: string; price?: number; compareAt?: number }>;
}

export const MCP_PRODUCTS: McpProduct[] = [
  {
    slug: "caixa-decorativa-media",
    name: "Caixa Decorativa Média — Terracota & Dourado",
    shortName: "Caixa Média",
    category: "caixa",
    collection: "sol-da-manha",
    price: 159.2,
    compareAt: 199,
    tagline: "Composição em camadas, com peso visual leve",
    description:
      "Mais do que organizar, peças pensadas para compor ambientes com elegância e intenção.",
    highlights: [
      "Tampa de madeira maciça",
      "Acabamento em terracota fosco",
      "Detalhe em folha dourada",
    ],
  },
  {
    slug: "caixa-decorativa-grande",
    name: "Caixa Decorativa Grande — Terracota & Dourado",
    shortName: "Caixa Grande",
    category: "caixa",
    collection: "sol-da-manha",
    price: 199.2,
    compareAt: 249,
    tagline: "Peça âncora para console, mesa lateral ou nicho",
    description:
      "Mais do que organizar, peças pensadas para compor ambientes com elegância e intenção.",
    highlights: [
      "Tampa de madeira maciça",
      "Acabamento em terracota fosco",
      "Detalhe em folha dourada",
    ],
  },
  {
    slug: "vaso-medio-sol-da-manha",
    name: "Vaso Médio em Vidro — Fio Dourado",
    shortName: "Vaso Médio",
    category: "vaso",
    collection: "sol-da-manha",
    price: 179,
    compareAt: 219,
    tagline: "Silhueta oval em vidro cristal com borda em fio dourado",
    description:
      "Vaso em vidro soprado transparente (21 × 17 × 17 cm) com borda finalizada em fio dourado aplicado à mão. Peça artesanal — pequenas variações fazem parte do charme.",
    highlights: [
      "Vidro soprado transparente — peça única",
      "Borda em fio dourado aplicado à mão",
      "21 × 17 × 17 cm (A × L × Ø)",
      "Ideal para galhos secos, pampas e flores de haste longa",
    ],
  },
  {
    slug: "vaso-baixo-sol-da-manha",
    name: "Vaso Baixo em Vidro — Fio Dourado",
    shortName: "Vaso Baixo",
    category: "vaso",
    collection: "sol-da-manha",
    price: 149,
    compareAt: 189,
    tagline: "Volume arredondado em vidro cristal com borda em fio dourado",
    description:
      "Vaso baixo em vidro soprado transparente (13 × 16,5 × 16,5 cm), com corpo arredondado e borda em fio dourado feito à mão. Compõe dupla com o vaso médio.",
    highlights: [
      "Vidro soprado transparente — peça única",
      "Borda em fio dourado aplicado à mão",
      "13 × 16,5 × 16,5 cm (A × L × Ø)",
      "Perfeito para arranjos baixos ou como objeto solo",
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
    tagline: "Arte abstrata em terracota e dourado",
    description:
      "Impressão fine art em papel algodão 310g, com moldura em carvalho natural e passepartout cru.",
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
    tagline: "Forma orgânica, peso na composição",
    description:
      "Escultura decorativa em cerâmica terracota com acentos em folha dourada.",
    highlights: [
      "Escultura em cerâmica maciça",
      "Acentos em folha dourada feitos à mão",
      "Apoio em feltro para proteger superfícies",
    ],
  },
];

export const getMcpProductBySlug = (slug: string) =>
  MCP_PRODUCTS.find((p) => p.slug === slug);

export const getMcpProductsByCollection = (collection: string) =>
  MCP_PRODUCTS.filter((p) => p.collection === collection);
