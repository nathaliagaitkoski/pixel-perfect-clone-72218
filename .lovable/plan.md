## O que vou construir

Transformar o projeto de "LP de produto único" em **loja com coleção + LPs por produto**, mantendo o visual cinematográfico atual e usando dados mock (sem mexer em Yampi/Meta agora).

### Estrutura de rotas

```text
/                              Home (hero atual + seção "Coleção Sol da Manhã" + sobre + footer)
/colecao/sol-da-manha          Página da coleção (mood, história, grid dos 6 produtos)
/produto/:slug                 LP individual de cada produto (replica o layout da caixa atual)
```

A LP atual da caixa (que hoje é a home) vira `/produto/caixa-decorativa-...` **sem perder nada** — toda a integração Yampi/cart/pixel/policies continua viva ali.

### Coleção "Sol da Manhã" — 6 produtos no grid

1. Caixa Decorativa Média (terracota & dourado) — *real, vem do Yampi*
2. Caixa Decorativa Grande (terracota & dourado) — *real, vem do Yampi*
3. Vaso Alto Sol da Manhã — *mock*
4. Vaso Baixo Sol da Manhã — *mock*
5. Quadro Sol da Manhã — *mock*
6. Objeto Decorativo Sol da Manhã — *mock*

> As 2 caixas aparecem como cards separados no grid (decisão sua), mas ambos os cards levam pra mesma LP da caixa e pré-selecionam a variação correspondente (Média/Grande).

### Arquivos novos

- `src/data/products.ts` — array de produtos mock com `slug`, `name`, `category` (oculta por enquanto), `collection: "sol-da-manha"`, `price`, `images`, `description`, `variants`
- `src/data/collections.ts` — coleções (por enquanto só "Sol da Manhã" com título, descrição, hero image)
- `src/pages/Home.tsx` — nova home (hero cinematográfico + grid da coleção + sobre + footer)
- `src/pages/Collection.tsx` — página `/colecao/:slug`
- `src/pages/Product.tsx` — LP genérica baseada em mock (replica visual da LP da caixa, sem checkout real — botão "comprar" mostra toast "em breve")
- `src/components/ProductCard.tsx` — card reutilizado no grid
- `src/components/SiteHeader.tsx` + `SiteFooter.tsx` — extraídos da `Index.tsx` pra reusar entre páginas

### Arquivos alterados

- `src/App.tsx` — adiciona rotas `/`, `/colecao/:slug`, `/produto/:slug`. A LP real da caixa fica em `/produto/caixa-decorativa-terracota-e-dourado-de-luxo` (componente `Index.tsx` atual, renomeado mentalmente pra "CaixaLP", sem mudar lógica)
- nada em `src/integrations/`, nada em edge functions, nada em secrets

### Imagens mock

Vou gerar 4 imagens (vaso alto, vaso baixo, quadro, objeto decorativo) no mesmo mood terracota/cream/dourado da marca, em `src/assets/`. Mockup simples mas coerente — quando você tiver fotos reais é só trocar o caminho no `products.ts`.

### Categoria oculta

Cada produto mock já guarda `category: "vaso" | "quadro" | "objeto" | "caixa"`. A UI não mostra filtro por categoria ainda (evitar "Quadros (1)"), mas o dado existe — quando crescer, basta ligar o filtro.

### Fora de escopo (não vou tocar)

- Yampi, Meta CAPI, edge functions, secrets
- Checkout dos produtos mock (toast "em breve" só)
- Migração pra Lovable Cloud (fica pra quando layout estiver fechado)
- Filtro por categoria
