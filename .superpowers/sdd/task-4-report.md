# Task 4 Report: Semantic Constructed Reality hero

## Status

DONE

## RED

- Adicionados testes para o heading acessível composto, contratos dos três CTAs, conteúdo localizado, composição sibling entre retrato e partículas e estados do retrato.
- Comando: `npm test -- --run src/features/home/HomeHero.test.tsx src/features/home/HomePage.test.tsx`
- Resultado esperado observado: exit 1. `HomeHero` ainda não existia e os dois testes de `HomePage` falharam porque o `h1` expunha somente `Principal Software Engineer`.
- Primeiro GREEN intermediário também capturou a concatenação sem espaço entre spans (`Eduardo LourencoPrincipal Software Engineer`), corrigida com separação textual explícita.

## GREEN

- Comando: `npm test -- --run src/features/home/HomeHero.test.tsx src/features/home/HomePage.test.tsx src/features/home/HeroPortrait.test.tsx`
- Resultado: exit 0, 3 arquivos e 8 testes passaram, output limpo.
- Comando: `npm test -- --run src/app/App.test.tsx`
- Resultado: exit 0, 1 arquivo e 1 teste passou, output limpo.
- Comando: `npm run typecheck`
- Resultado: exit 0.
- Comando: `npm run lint`
- Resultado: exit 0.
- Comando: `npm run test:run`
- Resultado: exit 0, 20 arquivos/50 testes Vitest e 6 testes Node passaram, output limpo.

## Implementação

- `HomeHero` concentra a composição semântica, mantém `HeroActions` privado e preserva URLs, labels e ordem dos destinos existentes.
- O `h1` combina nome e cargo em spans distintos com nome acessível separado corretamente.
- `HeroPortrait` mantém imagem DOM prioritária, dimensões intrínsecas 752×752 e estados `loading`, `ready` e `fallback`.
- Em erro, a imagem quebrada fica oculta e `EL` permanece em camada decorativa `aria-hidden`.
- `ParticleExperience` é sibling do `HeroPortrait` dentro de `.home-hero__visual`, fora do `figure`.
- `HomePage` não mantém mais observation/scene mapping nem o canvas adaptativo global; renderiza `HomeHero` diretamente.
- `pageInternalLinks(locale, 'home')` permaneceu validado por igualdade nos testes existentes.
- `App.test.tsx` declara explicitamente jsdom sem WebGL (`getContext` retorna `null`) para eliminar warnings introduzidos pela nova composição, sem alterar sua assertion funcional. Ajuste autorizado pelo coordenador.

## Arquivos

- Criado: `src/features/home/HomeHero.tsx`
- Criado: `src/features/home/HomeHero.test.tsx`
- Criado: `src/features/home/HeroPortrait.tsx`
- Criado: `src/features/home/HeroPortrait.test.tsx`
- Modificado: `src/features/home/HomePage.tsx`
- Modificado: `src/features/home/HomePage.test.tsx`
- Modificado: `src/app/App.test.tsx`
- Removido: `src/features/profile/HeroSection.tsx`
- Removido: `src/components/ProfilePortrait.tsx`
- Removido: `src/components/ProfilePortrait.test.tsx`

## Concerns

- Nenhum concern funcional no escopo da Task 4.
- As novas classes estruturais ainda não recebem o styling final; isso foi deliberadamente reservado para a Task 5 conforme o brief.
