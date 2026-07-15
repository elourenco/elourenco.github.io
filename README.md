# Architect's Nexus

Portfolio bilíngue de Eduardo Lourenco, construído com React 19, TypeScript,
Vite e uma camada Three.js progressiva. Conteúdo, navegação, SEO e ações
essenciais permanecem em HTML semântico quando WebGL não está disponível.

## Operação

Requer Node.js 22 ou superior e `npm`. As dependências diretas têm versões
exatas; não altere os pins para ranges.

```bash
npm ci
npm run dev
npm run check
npm run e2e
npm audit --omit=dev
```

`npm run check` executa formatação, ESLint, TypeScript, testes unitários,
build de produção, paridade recursiva do conteúdo localizado e validação das
rotas/URLs no bundle. `npm run e2e` constrói o contrato de navegador sobre o
preview de produção isolado na porta `4188`, com projetos desktop e mobile.

O workflow `Deploy GitHub Pages` valida e publica `dist/` automaticamente após
pushes na `main`; ele também pode ser disparado manualmente pela aba Actions. A
fonte de publicação do repositório deve estar configurada como `GitHub Actions`
em `Settings > Pages`. `public/404.html` transporta o path e a query do deep
link para `/`; o bootstrap restaura a URL antes da inicialização do router. Os
quatro documentos canônicos são:

- `/en`
- `/en/projects/dona-events`
- `/pt-br`
- `/pt-br/projetos/dona-events`

## Runtime de partículas e gates

Existe um único runtime 3D de produção: `ParticleExperience` seleciona o perfil
de qualidade e carrega `ParticleScene` sob demanda. A cena só monta quando
WebGL está disponível, movimento reduzido e Save-Data estão desativados, o
perfil de memória é elegível, o browser ficou ocioso, o hero está visível e a
aba está ativa. Perda de contexto desmonta a cena e mantém o fallback 2D. O
conteúdo semântico, as rotas e os CTAs não dependem do canvas.

O contrato de navegador cobre movimento reduzido, WebGL indisponível, limite
de zero ou um canvas, abertura do gate, ausência de overflow mobile e conteúdo
interativo abaixo do hero. Movimento reduzido, Save-Data, baixa memória e
WebGL indisponível também verificam zero requests do chunk pesado. Um perfil
elegível solicita exatamente um `ParticleScene` sob demanda.

## Performance e limites medidos

Build de produção medido em 2026-07-15:

| Artefato                                     | Minificado | Gzip (`gzip -c`) |
| -------------------------------------------- | ---------: | ---------------: |
| app `index-DmlQ1oVo.js`                      |   344132 B |         105041 B |
| cena + R3F/Three `ParticleScene-DiwRRYPO.js` |   875193 B |         230252 B |
| CSS `index-FudVdUwk.css`                     |    17877 B |                — |
| fonte WOFF2                                  |    22444 B |                — |

O limite legado era baseline `92,59 kB` + `10 kB` para o app. O app corrigido
mede `106,42 kB` no relatório do Vite e `105041 B` com `gzip -c`, portanto
ultrapassa o teto legado de `102590 B` em `2451 B`; essa diferença não é
ocultada por um chunk inicial auxiliar.

A medição anterior de `101201 B` era incompleta: `index.html` também fazia
`modulepreload` do vendor Three/R3F de `233094 B`, que continha dependências
compartilhadas do React e era importado estaticamente pelo entry. O critical
initial JavaScript real era aproximadamente `334747 B`. O grafo corrigido
entrega somente `105041 B` de JavaScript inicial, redução de aproximadamente
`68,6%`, e move R3F/Three integralmente para o único `ParticleScene` dinâmico.
O contrato de produção limita o total inicial corrigido a `106000 B` para evitar
novo drift. A fonte permanece abaixo de `50 kB`.

O build continua emitindo o warning conhecido de chunk acima de `500 kB` para
`ParticleScene`; ele é registrado e aceito, não ocultado. `modulePreload` foi
desativado porque a cena é um único boundary assíncrono, e os gates de browser
provam que perfis inelegíveis não baixam nem executam esse chunk.

Validação exata:

```bash
npm run check
npm run e2e
npm run build
find dist/assets -maxdepth 1 -type f -print0 | xargs -0 -n1 sh -c 'printf "%s " "$0"; wc -c < "$0"'
gzip -c dist/assets/index-*.js | wc -c
gzip -c dist/assets/ParticleScene-*.js | wc -c
npm audit --omit=dev
```

## Profiling instrumentado do runtime

Uma sessão Chromium contra o preview de produção instrumentou
`requestAnimationFrame` antes do bootstrap e instalou o hook de commits do
React. Em um intervalo estável de 1 segundo com um canvas animando, foi observado
máximo de `1` callback RAF pendente, `60` callbacks executados e `0` commits
React adicionais. Essa contagem de callbacks não é uma medição de FPS.

Ao navegar da home para Dona Events, o canvas passou de `1` para `0`, o RAF
pendente de `1` para `0` e houve `1` cancelamento. Ao despachar
`visibilitychange` com `visibilityState=hidden`, canvas e RAF pendente também
passaram a `0`; ao retornar para `visible`, o gate reabriu com `1` canvas e `1`
RAF pendente.

A evidência completa está fora do bundle em
`/tmp/elourenco-futuristic-captures/runtime-profile.json`. O teste de visibilidade
controla `document.visibilityState` antes do bootstrap e despacha o evento real,
portanto prova o boundary da aplicação, não uma troca de aba pelo sistema
operacional. A instrumentação não observa trabalho interno do compositor,
alocações da GPU nem liberação de recursos no driver. Não há alegação de FPS,
GPU resources, LCP, CLS ou INP.

## Resiliência e escalabilidade

O runtime é estático: throughput do servidor é delegado ao CDN do GitHub Pages.
Concorrência e latência críticas estão no browser (download, parse, shaders e
GPU). Falha de WebGL fica isolada pelo fallback 2D; conteúdo e CTAs continuam
operacionais. Falha de rota produz 404 localizado, e falha de locale recua para
inglês. Mudanças de conteúdo devem preservar IDs, estrutura recursiva e as
quatro rotas canônicas; os scripts de `check` falham deterministicamente em
drift.
