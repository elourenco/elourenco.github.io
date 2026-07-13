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

O deploy publica `dist/` no GitHub Pages. `public/404.html` transporta o path e
a query do deep link para `/`; o bootstrap restaura a URL antes da inicialização
do router. Os quatro documentos canônicos são:

- `/en`
- `/en/projects/dona-events`
- `/pt-br`
- `/pt-br/projetos/dona-events`

## Performance e limites medidos

Baseline do build de produção em 2026-07-13:

| Artefato              | Minificado |      Gzip |
| --------------------- | ---------: | --------: |
| app principal         |  293,13 kB |  92,59 kB |
| `AdaptiveCanvas`      |    6,98 kB |   2,59 kB |
| vendor Three/R3F/Drei |  899,17 kB | 239,74 kB |
| runtime do bundler    |    0,69 kB |   0,42 kB |

O vendor 3D é um chunk separado, mas atualmente é solicitado logo após o
primeiro render. O build emite o warning de chunk acima de 500 kB. O custo é
aceito como budget explícito desta versão porque o conteúdo semântico não
depende dele; visibility/idle gating deve ser a próxima otimização se medição
em dispositivo mostrar contenção de rede/main thread. Não foi adicionada
complexidade de scheduling sem essa evidência.

Lighthouse não estava instalado no ambiente de validação, portanto não há
números inventados de LCP, CLS ou INP. Também não foi feita medição de FPS em
dispositivo representativo. Os gates automatizados provam apenas carregamento
desktop/mobile, rotas diretas, equivalência de locale e usabilidade sem WebGL;
não provam os pisos de 60/30 FPS. Nenhum warning de API Three depreciada foi
observado em build, testes ou E2E; upgrades de Three/R3F/Drei devem manter o
chunk isolado e repetir profiling de dispositivo.

## Resiliência e escalabilidade

O runtime é estático: throughput do servidor é delegado ao CDN do GitHub Pages.
Concorrência e latência críticas estão no browser (download, parse, shaders e
GPU). Falha de WebGL fica isolada pelo fallback 2D; conteúdo e CTAs continuam
operacionais. Falha de rota produz 404 localizado, e falha de locale recua para
inglês. Mudanças de conteúdo devem preservar IDs, estrutura recursiva e as
quatro rotas canônicas; os scripts de `check` falham deterministicamente em
drift.
