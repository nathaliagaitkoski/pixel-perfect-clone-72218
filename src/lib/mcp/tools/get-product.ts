import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getProductBySlug } from "@/data/products";

export default defineTool({
  name: "get_product",
  title: "Detalhes do produto",
  description:
    "Retorna os detalhes completos de um produto da Pientro Casa a partir do seu slug (ex.: 'vaso-alto-sol-da-manha').",
  inputSchema: {
    slug: z.string().min(1).describe("Slug do produto."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: ({ slug }) => {
    const p = getProductBySlug(slug);
    if (!p) {
      return {
        content: [{ type: "text", text: `Produto não encontrado: ${slug}` }],
        isError: true,
      };
    }
    return {
      content: [
        {
          type: "text",
          text: `${p.name} — ${p.tagline}. Preço: R$ ${p.price.toFixed(2)}.`,
        },
      ],
      structuredContent: {
        product: {
          slug: p.slug,
          name: p.name,
          shortName: p.shortName,
          category: p.category,
          collection: p.collection,
          price: p.price,
          compareAt: p.compareAt ?? null,
          tagline: p.tagline,
          description: p.description,
          highlights: p.highlights,
          variants: p.variants ?? [],
        },
      },
    };
  },
});
