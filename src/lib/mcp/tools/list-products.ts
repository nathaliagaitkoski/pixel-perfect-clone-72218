import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PRODUCTS } from "@/data/products";

export default defineTool({
  name: "list_products",
  title: "Listar produtos",
  description:
    "Lista os produtos do catálogo da Pientro Casa. Pode filtrar por categoria (caixa, vaso, quadro, objeto) e por coleção.",
  inputSchema: {
    category: z
      .enum(["caixa", "vaso", "quadro", "objeto"])
      .optional()
      .describe("Filtra por categoria do produto."),
    collection: z
      .string()
      .optional()
      .describe("Slug da coleção, por exemplo 'sol-da-manha'."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: ({ category, collection }) => {
    const items = PRODUCTS.filter(
      (p) =>
        (!category || p.category === category) &&
        (!collection || p.collection === collection),
    ).map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      collection: p.collection,
      price: p.price,
      compareAt: p.compareAt ?? null,
      tagline: p.tagline,
    }));

    return {
      content: [
        {
          type: "text",
          text: `${items.length} produto(s) encontrado(s).`,
        },
      ],
      structuredContent: { products: items },
    };
  },
});
