import { defineMcp } from "@lovable.dev/mcp-js";
import listProductsTool from "./tools/list-products";
import getProductTool from "./tools/get-product";
import listCollectionTool from "./tools/list-collection";

export default defineMcp({
  name: "pientro-casa-mcp",
  title: "Pientro Casa MCP",
  version: "0.1.0",
  instructions:
    "Ferramentas para explorar o catálogo da Pientro Casa — curadoria de decoração com olhar de arquiteta. Use `list_products` para navegar o catálogo (filtrando por categoria ou coleção), `list_collection` para peças de uma coleção específica e `get_product` para detalhes completos de um produto pelo slug.",
  tools: [listProductsTool, getProductTool, listCollectionTool],
});
