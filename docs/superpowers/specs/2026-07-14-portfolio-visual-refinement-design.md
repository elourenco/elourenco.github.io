# Refinamento visual fiel do portfolio

## Contexto

O portfolio atual preserva conteudo semantico, internacionalizacao, rotas e um
runtime progressivo de particulas, mas diverge da referencia visual aprovada.
O hero usa `src/assets/eduardo-profile.jpg`, um JPEG quadrado de 752 x 752 px
com praia incorporada. O canvas apenas sobrepoe particulas e nao remove nem
dissolve o fundo da imagem. A escala tipografica, os espacamentos verticais e o
rail lateral tambem produzem composicao diferente da referencia e quebras em
larguras intermediarias.

Esta entrega toma a imagem de referencia fornecida pelo usuario como autoridade
visual para o hero e aplica a mesma linguagem ao restante do conteudo existente.

## Objetivo

Reconstruir a apresentacao visual do portfolio para que o estado desktop em
1488 x 1058 px reproduza com alta fidelidade a referencia, mantendo:

- conteudo atual em portugues e ingles;
- rotas e destinos existentes;
- HTML semantico e navegacao por teclado;
- melhoria progressiva para animacoes e WebGL;
- fallback funcional em falhas ou dispositivos inelegiveis;
- custo previsivel de download, CPU e GPU.

## Abordagem escolhida

A solucao sera uma composicao hibrida:

1. HTML e CSS controlam conteudo, layout, gradientes, grid, cards e navegacao.
2. Um novo asset raster transparente representa o retrato sem a praia.
3. O runtime Three.js existente permanece isolado como aprimoramento decorativo
   para a dissolucao e o campo de particulas.
4. Uma composicao estatica equivalente permanece visivel quando o canvas nao
   deve ou nao pode ser montado.

Essa abordagem preserva fidelidade e responsividade sem transformar conteudo
interativo em uma imagem unica nem tornar o retrato dependente de WebGL.

## Arquitetura visual

### Fundo global

- Base preto-esverdeada, sem fotografia de fundo.
- Gradientes radiais sutis concentram luz no hero e no primeiro projeto.
- Grid tecnico com baixa opacidade e mascara progressiva.
- Ruido visual limitado para manter contraste, legibilidade e custo baixo.

### Hero

- Desktop amplo usa duas colunas dentro de container centralizado.
- A coluna esquerda contem nome, cargo, disciplinas, resumo e tres CTAs.
- O nome usa display condensado com limite superior de escala; o cargo usa
  estilo mono verde e permanece hierarquicamente secundario.
- Os tres CTAs permanecem na mesma linha quando houver espaco: projetos,
  LinkedIn e curriculo.
- A faixa de capacidades aparece abaixo dos CTAs.
- O inicio do card Dona Events permanece visivel na primeira dobra em
  1488 x 1058 px.

### Retrato e dissolucao

- O JPEG atual sera substituido no hero por asset com fundo transparente.
- O retrato nao tera frame quadrado, praia, legenda `EL-01` nem borda visivel.
- A metade esquerda do rosto permanece integra.
- Uma mascara progressiva parte da regiao central para a direita e mistura o
  retrato com particulas, pontos luminosos e conexoes.
- A base do busto recebe fade suave para integrar o asset ao fundo.
- As cores quentes da referencia sao preservadas.
- O canvas ocupa somente a area visual necessaria e nunca interfere com os
  CTAs ou com a coluna textual.

### Transicao para projetos

- A faixa de capacidades atua como divisor visual entre hero e projetos.
- Dona Events usa card largo com metrica e resumo a esquerda e preview real do
  produto a direita.
- Borda, halo verde e gradiente seguem a referencia sem comprometer contraste.

### Especialidades

- A faixa do hero comunica sistemas distribuidos, mobile, IA aplicada e
  observabilidade.
- A secao detalhada mantem o conteudo atual em cards compactos e alinhados.
- Icones devem vir de uma biblioteca consistente e acessivel.
- Cards evitam alturas artificiais baseadas na viewport.

### Carreira e contato

- A timeline usa ritmo compacto e hierarquia clara entre periodo, empresa,
  funcao e impacto.
- O contato ocupa altura proporcional ao conteudo.
- Nenhuma secao usa grandes vazios apenas para preencher a viewport.

## Navegacao

### Desktop amplo

- A partir de 1180 px, o rail vertical permanece fixo.
- O rail usa linha, nos numerados e estado ativo equivalente a referencia.
- Labels permanecem em uma linha e possuem area interativa minima de 44 px.
- A secao ativa e atualizada por `IntersectionObserver`.

### Tablet e mobile

- Entre 768 e 1179 px, o rail e substituido por header horizontal compacto.
- Abaixo de 768 px, o header abre um painel de navegacao curto.
- O painel fecha por selecao, `Escape` e mudanca de rota; o foco retorna ao
  controle quando fechado por teclado.
- PT/EN permanece acessivel no header em todas as larguras.
- O scroll para ancora considera a altura do header.

## Tipografia e espacamento

- A escala continua fluida, mas cada `clamp` recebe limites que impedem
  crescimento excessivo em telas ultrawide.
- Nome, titulos de secao, corpo, labels e metricas usam escalas independentes.
- O container e os gutters sao derivados das proporcoes da referencia.
- Paddings verticais sao definidos por densidade do conteudo, nao por `100vh`.
- O hero pode usar `min-height` para preservar composicao, sem ocultar o inicio
  do primeiro projeto na viewport de referencia.

## Movimento

- O conteudo do hero entra com fade e deslocamento vertical de 12 a 16 px.
- O retrato entra por mascara horizontal.
- As particulas usam deriva lenta, pulso sutil e pequena variacao de
  profundidade.
- Cards animam uma unica vez quando entram na viewport.
- Hovers usam `transform` e opacidade, sem recalculo de layout.
- `prefers-reduced-motion: reduce` entrega imediatamente o estado final.

## Performance, concorrencia e throughput

- O runtime mantem no maximo um canvas.
- O chunk de Three.js continua carregado sob demanda e somente para perfis
  elegiveis.
- O canvas pausa quando o hero sai da viewport ou a aba fica oculta.
- O asset transparente e entregue em formato e dimensoes adequados para evitar
  download ou decode excessivo.
- Largura e altura intrinsecas reservam o espaco do retrato e evitam CLS.
- Animacao nao dispara atualizacoes React por frame; o loop permanece isolado
  no renderer.
- A aplicacao estatica continua delegando throughput de servidor ao CDN; o
  principal limite de concorrencia permanece no download, parse e GPU do
  cliente.

## Falhas e resiliencia

- Sem WebGL, com Save-Data, baixa memoria ou movimento reduzido, o retrato e o
  fundo estatico permanecem completos.
- Perda de contexto WebGL desmonta a cena sem remover conteudo ou CTAs.
- Falha do asset exibe fallback decorativo sem quebrar o layout.
- Menu, locale, links e rotas nao dependem do canvas.
- Erros da experiencia visual permanecem isolados pelo boundary existente.

## Acessibilidade

- Estrutura semantica, heading principal, skip link e landmarks permanecem.
- O retrato mantem texto alternativo localizado; particulas e ornamentos ficam
  fora da arvore acessivel.
- Foco visivel, contraste e areas interativas serao verificados.
- O menu funciona por teclado e nao cria armadilha de foco.
- A secao ativa nao depende apenas de cor.
- Reflow e ausencia de overflow serao verificados em zoom e larguras reduzidas.

## Estrategia de testes

### Testes automatizados

- Testes unitarios cobrem estados do retrato e contratos do hero.
- Testes de componentes cobrem abertura, fechamento e foco do menu.
- Testes CSS validam limites criticos de escala e geometria.
- Playwright cobre 390, 768, 1024, 1440 e 1488 px, ausencia de overflow,
  navegacao, locale, fallback sem WebGL e limite de um canvas.
- Alteracoes comportamentais seguem ciclo red-green-refactor.

### Design QA

- A referencia e a implementacao serao capturadas em 1488 x 1058 px e
  comparadas no mesmo estado.
- `design-qa.md` registra diferencas por prioridade.
- P0, P1 e P2 devem ser corrigidos antes do aceite.
- Diferencas P3 podem permanecer apenas se documentadas e sem impacto no alvo.

## Criterios de aceite

- O hero em 1488 x 1058 px acompanha a estrutura, escala e proporcoes da
  referencia.
- Nao existe praia, frame quadrado ou fundo incorporado ao retrato.
- A dissolucao e perceptivel na metade direita e se integra ao campo de
  particulas.
- Nome, cargo, disciplinas, resumo e CTAs mantem hierarquia equivalente a
  referencia.
- A faixa de capacidades e o inicio de Dona Events aparecem na primeira dobra.
- O menu nao quebra nem sobrepoe conteudo em desktop, tablet ou mobile.
- Nao existe overflow horizontal nas larguras cobertas.
- Ha no maximo um canvas e o fallback sem WebGL permanece funcional.
- `npm run check` e `npm run e2e` concluem sem falhas.
- `design-qa.md` termina com `final result: passed`.

## Fora de escopo

- Alterar o conteudo editorial ou historico profissional.
- Criar backend, CMS, analytics ou persistencia.
- Adicionar novas rotas ou novos projetos.
- Transformar a pagina em uma experiencia 3D integral.
- Redesenhar a identidade para outra direcao visual.
