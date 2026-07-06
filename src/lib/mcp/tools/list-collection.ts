import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getMcpProductsByCollection } from "../data";

export default defineTool({
  name: "list_collection",
  title: "Listar coleção",
  description:
    "Lista todos os produtos de uma coleção da Pientro Casa (ex.: 'sol-da-manha').",
  inputSchema: {
    collection: z.string().min(1).describe("Slug da coleção."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: ({ collection }) => {
    const items = getMcpProductsByCollection(collection).map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      price: p.price,
      tagline: p.tagline,
    }));
    return {
      content: [
        {
          type: "text",
          text: `${items.length} peça(s) na coleção "${collection}".`,
        },
      ],
      structuredContent: { collection, products: items },
    };
  },
});
