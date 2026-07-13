# Architect's Nexus - Portfolio Redesign

## 1. Resumo executivo

O portfolio de Eduardo Lourenco sera refeito como uma experiencia bilingue, moderna e cinematografica chamada **Architect's Nexus**. O site posicionara Eduardo como **Principal Software Engineer - AI, Mobile & Software Architecture**, usando uma estacao orbital realista como metafora para uma carreira que conecta inteligencia artificial, mobile, backend, cloud e arquitetura.

Three.js sera uma camada narrativa progressiva. Conteudo, navegacao, SEO e acessibilidade permanecerao em HTML semantico. O site continuara utilizavel sem WebGL, com movimento reduzido ou em dispositivos que nao sustentem a experiencia completa.

## 2. Objetivos

- Promover o posicionamento profissional do LinkedIn.
- Demonstrar autoridade em IA, mobile e arquitetura com experiencia verificavel.
- Usar Dona Events como prova principal de execucao end-to-end sem revelar arquitetura proprietaria.
- Criar uma experiencia memoravel, rapida, acessivel e indexavel.
- Oferecer paridade completa entre ingles e portugues do Brasil.
- Substituir Create React App por uma fundacao atual e sustentavel.

## 3. Fora de escopo

- Expor fornecedores sensiveis, dados internos ou diagramas proprietarios do Dona Events.
- Exigir interacao 3D para acessar informacoes.
- Sincronizar automaticamente dados do LinkedIn.
- Implementar CMS, autenticacao ou backend na primeira versao.
- Inventar metricas, responsabilidades ou competencias.

## 4. Posicionamento

### Ingles

```text
Eduardo Lourenco
Principal Software Engineer
AI · Mobile · Software Architecture

I design and build intelligent digital products,
from system architecture to production.
```

### Portugues do Brasil

```text
Eduardo Lourenco
Principal Software Engineer
IA · Mobile · Arquitetura de Software

Projeto e construo produtos digitais inteligentes,
da arquitetura de sistemas ate a producao.
```

CTAs: ver trabalhos, conectar no LinkedIn e baixar curriculo.

## 5. Direcao visual

**Cosmic Intelligence com realismo cinematografico.** O visitante chega a uma estacao orbital plausivel que representa o Architect's Nexus. Um AI Core conecta os dominios profissionais. A estacao deve parecer infraestrutura funcional, nao interface gamer.

- Metal escovado, vidro, ceramica e superficies tecnicas.
- Preto espacial, azul petroleo, cinza metalico e ciano frio.
- Iluminacao indireta, volumetria discreta e bloom limitado.
- Telemetria com significado, evitando numeros decorativos aleatorios.
- Tipografia limpa, internacional e com contraste WCAG AA.
- A foto fornecida sera uma identidade holografica, sem substituir o perfil textual.

### Movimento

- Camera com massa, inercia, aceleracao e desaceleracao naturais.
- Parallax sutil; o cursor nao controla grandes rotacoes diretamente.
- Movimentos ambientais lentos e funcionais.
- Viagens mais rapidas apenas apos selecao explicita.
- Movimento reduzido remove viagens e efeitos continuos sem remover conteudo.

## 6. Arquitetura de informacao

1. **Arrival / Identity** - nome, posicionamento, proposta e CTAs.
2. **AI Core / Featured Work** - Dona Events como case principal.
3. **System Map / Expertise** - AI, Mobile e Software Architecture.
4. **Flight Log / Career Highlights** - da infraestrutura ate IA.
5. **Open Channel / Contact** - LinkedIn, GitHub, curriculo e contato.

Projetos completos podem ter rotas proprias. A homepage permanece curta; detalhes ficam fora do fluxo principal.

### Conteudo profissional

- **Artificial Intelligence:** produtos orientados por IA, experiencias generativas e workflows inteligentes.
- **Mobile Engineering:** React Native, Swift, iOS e Android em producao.
- **Software Architecture:** sistemas distribuidos, APIs, cloud, performance, observabilidade e resiliencia.
- **Career Highlights:** IXC Soft, Midway, VAI Car, Quero Bolsa e Claro.
- **Authority:** certificacoes recentes selecionadas, artigos, GitHub e LinkedIn.

## 7. Dona Events

Dona Events sera apresentado como produto criado por Eduardo de ponta a ponta, cobrindo produto, mobile, web, backend, infraestrutura e IA.

```text
Dona Events
Creator & Principal Engineer

AI-powered event platform with mobile apps, digital invitations,
real-time RSVP, event management and digital gifts.
```

Evidencias publicas permitidas: geracao de imagens e conteudo com Dona IA, convites digitais, convidados, RSVP, notificacoes, Pix/cartao e mais de 35 mil eventos criados. Modelos, provedores, custos, latencias, diagramas internos e dados privados nao serao publicados.

## 8. Internacionalizacao

Idiomas: `en` e `pt-BR`, com paridade de conteudo.

```text
/en
/en/projects/dona-events
/pt-br
/pt-br/projetos/dona-events
```

- Ingles e o fallback internacional.
- No primeiro acesso, `navigator.language` direciona portugues para `/pt-br` e os demais para `/en`.
- Uma escolha persistida prevalece sobre deteccao automatica.
- A troca preserva pagina equivalente, estado relevante e preferencias visuais.
- `hreflang`, canonical, sitemap e Open Graph serao localizados.
- Nomes de produtos e tecnologias nao serao traduzidos.

## 9. Arquitetura frontend

```text
src/
├── app/                 # bootstrap, router e providers
├── experience/          # Canvas, cenas, camera, efeitos e qualidade
├── features/            # profile, expertise, projects, career, contact
├── content/             # fontes tipadas en e pt-BR
├── components/          # componentes visuais compartilhados
├── i18n/                # deteccao, roteamento e contratos de locale
└── styles/              # tokens, reset e estilos globais
```

- `experience` recebe estados semanticos e nao conhece textos localizados.
- `content` contem dados tipados e nao importa componentes.
- Features renderizam HTML e comandam a cena por interface estreita.
- O canvas nao controla roteamento nem conteudo.
- Estado por frame fica fora do React para evitar reconciliacao continua.

## 10. Stack e modernizacao

O projeto atual usa React 18 e Create React App 5. A implementacao migrara para:

- Vite 8, React 19 e TypeScript.
- Three.js, React Three Fiber e Drei.
- i18next e react-i18next.
- Vitest, Testing Library, ESLint e Prettier.

Dependencias diretas usarao versoes estaveis exatas, sem `^` ou `~`, e toda a arvore sera fixada no lockfile e validada quanto a compatibilidade. Prereleases transitivos introduzidos por pacotes estaveis sao aceitos quando permanecem fixados no lockfile e o `npm audit` nao reporta vulnerabilidades. `react-scripts`, configuracoes legadas, dependencias sem uso e traducoes duplicadas serao removidos.

Sequencia: CRA para Vite/TypeScript; React 19; testes; i18n; conteudo semantico; fundacao Three.js; cena e acabamento.

## 11. Performance, latencia e concorrencia

- Conteudo principal visivel antes da cena completa.
- 60 FPS em desktop adequado e piso de 30 FPS em mobile suportado.
- DPR adaptativo e limite por perfil de qualidade.
- GLB comprimido e texturas WebP/AVIF ou KTX2 sob demanda.
- Sombras, pos-processamento e particulas reduzidos em GPUs fracas.
- Nenhum update por frame provoca reconciliacao React.
- Analise de bundle no CI; budgets definidos apos medir o baseline.

O portfolio e estatico. A concorrencia relevante esta no browser: downloads, decodificacao, shaders e GPU. O carregador limita trabalho simultaneo e prioriza HTML, fontes essenciais e primeiro quadro antes de assets secundarios.

## 12. Falhas e resiliencia

- WebGL indisponivel: fallback 2D automatico.
- Context loss: uma restauracao controlada; HTML continua funcional.
- Asset ausente: geometria ou imagem local leve, sem bloquear a pagina.
- Falha de idioma: ingles.
- Rota inexistente: 404 no idioma da rota e links equivalentes.
- Erro de animacao: error boundary isola a experiencia.
- Conteudo central nao depende de recursos externos em runtime.

## 13. Acessibilidade e SEO

- HTML semantico, teclado, foco visivel e landmarks.
- Canvas apresentacional quando nao possuir controle equivalente.
- Alternativa HTML para controles 3D.
- `prefers-reduced-motion`, contraste AA e texto redimensionavel.
- Metadados, JSON-LD, canonical, `hreflang`, sitemap e robots por idioma.
- Informacao essencial nunca depende de hover, cor ou canvas.

## 14. Testes e verificacao

- Testes unitarios de selecao e persistencia de locale.
- Contratos garantindo paridade entre idiomas.
- Componentes: hero, projetos, carreira, contato e fallbacks.
- Integracao: rotas localizadas e troca de idioma.
- E2E dos fluxos principais em desktop e mobile.
- Auditoria automatizada e verificacao manual de acessibilidade.
- WebGL desabilitado e movimento reduzido.
- Bundle, Lighthouse e FPS/frame time em dispositivos representativos.
- Build de producao e validacao de links antes do deploy.

## 15. Deploy e operacao

O site permanecera compativel com hospedagem estatica no GitHub Pages. Rotas localizadas usarao fallback de SPA ou entradas estaticas compativeis. O pipeline executara lint, typecheck, testes e build. Telemetria futura sera minima, consentida e nao bloqueante.

## 16. Criterios de aceite

- Posicionamento aprovado consistente nos dois idiomas.
- Dona Events como case central sem detalhes proprietarios.
- Fluxos essenciais funcionam sem WebGL.
- Troca de idioma preserva pagina equivalente e preferencia.
- Conteudo, SEO e acessibilidade independem do canvas.
- Cosmic Realism com movimento fisico contido e qualidade adaptativa.
- Stack modernizada sem `react-scripts` ou dependencias obsoletas sem uso.
- Testes, lint, typecheck e build passam no pipeline.
