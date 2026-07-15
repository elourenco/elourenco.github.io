# Task 3 — Hero alinhado à composição de referência

## Escopo entregue

- Estendido `PortfolioContent.hero` com as quatro capabilities tipadas e localizadas, na ordem estável `distributed`, `mobile`, `ai`, `observability`.
- Criado `CapabilityStrip` como lista semântica, com texto visível e ícones decorativos Phosphor.
- Mantidos os três destinos existentes do hero e adicionados `ArrowRightIcon`, `LinkedinLogoIcon` e `FileTextIcon` sem alterar os nomes acessíveis.
- Substituído o JPEG quadrado pelo asset transparente real `eduardo-portrait.png` de 1024 x 1240, com dimensões intrínsecas, prioridade de carregamento e estados `loading`, `ready` e `fallback` preservados.
- Removidos frame quadrado, scanline, filtros de praia e legenda `EL-01`.
- Aplicados os tokens e a geometria aprovados para rail, container, espaçamento, nome, cargo, grid do hero, retrato e faixa de capabilities.
- Adicionado o fundo de referência com gradientes radiais/linear em `body`; o grid técnico existente permanece em `body::before` com `pointer-events: none`.
- Reservado o aspect ratio do portrait também no fallback para impedir colapso do layout e CLS após erro do asset.
- O boundary de partículas não foi alterado; Task 4 continua responsável pela dissolução.

## Arquivos

- `src/content/schema.ts`
- `src/content/pt-BR.ts`
- `src/content/en.ts`
- `src/content/content.test.ts`
- `src/features/home/CapabilityStrip.tsx`
- `src/features/home/HomeHero.tsx`
- `src/features/home/HomeHero.test.tsx`
- `src/features/home/HeroPortrait.tsx`
- `src/features/home/HeroPortrait.test.tsx`
- `src/styles/tokens.css`
- `src/styles/base.css`
- `src/styles/layout.css`
- `src/styles/components.css`

`src/styles/base.css` é o único arquivo adicional à lista nominal do brief. Ele é o owner existente de `body` e foi alterado estritamente para cumprir o Step 6, que exige os gradientes diretamente nesse elemento.

## Evidência TDD

### RED 1 — conteúdo e faixa de capabilities

Comando:

```text
npm test -- src/content/content.test.ts src/features/home/HomeHero.test.tsx
```

Resultado: exit 1, com duas falhas esperadas.

- `content.test.ts`: `capabilities` era `undefined`, portanto o contrato de IDs não podia ser lido.
- `HomeHero.test.tsx`: `Sistemas distribuídos` não existia no DOM porque a faixa ainda não era renderizada.

### GREEN 1 — conteúdo, faixa e CTAs

Comando:

```text
npm test -- src/content/content.test.ts src/features/home/HomeHero.test.tsx
```

Resultado: 2 arquivos, 5 testes, 0 falhas.

### RED 2 — portrait transparente

Comando:

```text
npm test -- src/features/home/HeroPortrait.test.tsx
```

Resultado: exit 1. O teste encontrou o asset legado `eduardo-profile.jpg`, antes de validar as novas dimensões e a remoção do frame.

### GREEN 2 — portrait transparente e fallback

Comando:

```text
npm test -- src/features/home/HeroPortrait.test.tsx
```

Resultado: 1 arquivo, 3 testes, 0 falhas. Os estados ready/error existentes continuam cobertos.

## Gates finais

Executados novamente, em sequência, imediatamente antes do commit funcional:

- `npm test -- src/content/content.test.ts src/features/home/HomeHero.test.tsx src/features/home/HeroPortrait.test.tsx`: 3 arquivos, 8 testes, 0 falhas.
- `npm run typecheck`: exit 0.
- `npm run build`: exit 0; portrait e Phosphor resolvidos no bundle.
- `npx prettier --check <arquivos da Task 3>`: passou.
- `npx eslint <arquivos TypeScript/TSX da Task 3>`: passou.
- `git diff --check`: passou.

Por instrução de escopo, não foram executados suíte completa, Playwright responsivo, compactação das demais seções nem design QA final.

## Commits

- `cd386c6 feat: rebuild the portfolio hero`

## Concerns

- O build mantém o warning não bloqueante do chunk lazy `three-vendor` acima de 500 kB. Three.js continua separado do bundle síncrono principal (`index` 324.17 kB; `three-vendor` 883.51 kB), e esta Task não altera o boundary WebGL.
- A validação visual pixel-level em 1488 x 1058 e os breakpoints 390/768/1024/1440/1488 pertencem às Tasks 6 e 7 e não foram antecipados.
- A faixa recebeu apenas uma adaptação estrutural mínima em duas colunas abaixo de 800 px para não introduzir overflow óbvio; o contrato responsivo completo permanece na Task 6.
