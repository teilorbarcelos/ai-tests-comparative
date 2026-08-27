# Teste de Estresse — OpenAI GPT-OSS 20B

- **Modelo**: `openai/gpt-oss-20b`
- **API**: `http://localhost:1234/v1` (Bionic/LM Studio)
- **Data**: 2026-08-20
- **Parâmetros**: `temperature=0.2`, `max_tokens=8000`
- **Plano**: `plan-stress/` (complexidade progressiva, níveis 1 a 5)
- **Tarefas**: 10 (2 por nível)
- **Resultado em**: `results-stress/`

---

## Resumo

| Métrica | Valor |
|---|---|
| Tempo total | 169.1 s (~3 min) |
| Latência média por tarefa | 16.9 s |
| Throughput médio | 163.1 tps |
| Tokens de entrada (total) | 2207 |
| Tokens de saída (total) | 25881 |
| **Nota média (geral)** | **9.5 / 10** |

> Todas as 10 tarefas retornaram `finish_reason: stop` (nenhuma truncada), mesmo nas
> tarefas longas de arquitetura. Velocidade impressionante para o volume de código gerado
> (~26k tokens em ~3 min).

---

## Notas por nível

| Nível | Tarefas | Nota média |
|---|---|---|
| 1 — Básico | s01, s02 | 9.5 |
| 2 — Intermediário | s03, s04 | 9.5 |
| 3 — Avançado | s05, s06 | 9.5 |
| 4 — Desafiador | s07, s08 | 9.5 |
| 5 — Extremo | s09, s10 | 9.5 |

---

## Tarefas

### Nível 1 — Básico

#### s01 — Tipos avançados e genéricos (backend) — **9.5**
- `groupBy<T,K>` genérico correto com `Map<K,T[]>`, tipos utilitários (`Record`, `Partial`, `Pick`) e exemplo prático agrupando `Product` por categoria. Explicação clara.
- **Obs.:** Nada a apontar. Solução limpa e didática.

#### s02 — Componente com hooks avançados (frontend) — **9.5**
- `useLocalStorage<T>` (com SSR guard), `useReducer` para o contador, e `useHistory<T>` com `useRef`. Componente `Counter` completo e tipado.
- **Obs.:** Implementação correta e explicada. Pequeno detalhe: `useHistory` retorna o array de `useRef` (referência mutável), mas funcionalmente adequado.

### Nível 2 — Intermediário

#### s03 — Serviço com injeção de dependência e padrões (backend) — **9.5**
- Arquitetura em camadas (domain/infrastructure/application/presentation), interface `UserRepository`, `InMemoryUserRepository`, `AuthService` com DI via construtor, hash de senha, e middleware de autorização.
- **Obs.:** Modelo exemplar. Hash "fake" claramente sinalizado como demo.

#### s04 — App React com roteamento e estado global (frontend) — **9.5**
- `AuthContext` com Context API, `ProtectedRoute` com `<Navigate>`, roteamento com React Router v6 e persistência em localStorage. Fluxo de redirecionamento bem documentado.

### Nível 3 — Avançado

#### s05 — API REST completa com validação, banco e testes (backend) — **9.5**
- CRUD de produtos com Zod, repositório em memória, paginação/filtros, `errorHandler` centralizado (trata `ZodError`) e testes Jest abrangentes. Estrutura de pastas completa.
- **Obs.:** Cobertura excepcional; testes incluem validação, paginação e erros.

#### s06 — Dashboard React com fetching, filtros e componentes (frontend) — **9.5**
- `useFetch<T>` com cleanup (`isMounted`), filtros de busca/ordenação com `useMemo`, componentes reutilizáveis tipados (Button/Input/Card) com CSS, e responsividade.
- **Obs.:** Fluxo de dados e estilização bem resolvidos.

### Nível 4 — Desafiador

#### s07 — Algoritmo e estrutura de dados com testes (backend) — **9.5**
- `LRUCache<K,V>` com `Map` + lista duplamente ligada, `get`/`put` em **O(1)**, evicção do LRU correta, validação de capacidade e testes Jest (inserção, evict, atualização, capacidade zero).
- **Obs.:** Implementação O(1) correta e testes que cobrem os cenários críticos. Explicação da complexidade precisa.

#### s08 — Feature full-stack integrada (fullstack) — **9.5**
- Backend (Express + Zod + repositório em memória), frontend (hook `useCart` + componente `Cart`), tipos de domínio compartilhados, e fluxo de comunicação/integração documentado (incluindo CORS e `npm link`).

### Nível 5 — Extremo

#### s09 — Debug e correção de código com bugs (fullstack) — **9.5**
- Identificou **9 bugs** (tipagem `any`, injeção de propriedade no PUT, `NaN` no parse de ID, case-sensitivity, ausência de 404, falta de validação, tratamento de erro global, escopo global, etc.) e entregou versão refatorada com repositório, middlewares de validação/parse e tratamento de erros. Tabela bug→correção.
- **Obs.:** Análise de segurança (injeção de `id`) e robustez acima da média.

#### s10 — Arquitetura completa full-stack (fullstack) — **9.5**
- Monorepo (pnpm), pacote `domain` compartilhado, backend completo (Express 5 + Prisma + Zod + JWT + helmet + errorHandler + authMiddleware), frontend completo (Redux Toolkit + RTK Query + React Router), Prisma schema, e seções de segurança/escalabilidade/CI-CD. Resposta de ~5.5k tokens.
- **Obs.:** Design de sistema maduro; tratamento de autorização por dono (`ownerId`) no serviço. Escalabilidade e segurança abordadas com profundidade.

---

## Conclusão

- O **GPT-OSS 20B** mantém **qualidade excelente e consistente** do nível 1 ao nível 5,
  incluindo tarefas que exigem raciocínio arquitetural, debug de código com bugs e
  design de sistema full-stack.
- **Não houve degradação perceptível** nas tarefas mais difíceis — nota 9.5 em todos os níveis.
- **Velocidade**: ~163 tps, 10 tarefas de estresse (~26k tokens) em ~3 min — inviável de
  alcançar com os modelos Qwen testados.
- **Observação de justiça**: este é um teste de *capacidade máxima*, separado do
  [comparativo padrão](../results/COMPARATIVO.md). As respostas cruas estão em `raw-responses/`.
