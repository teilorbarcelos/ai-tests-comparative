# Avaliação — Thinking Machines Inkling 2 Mini

- **Modelo**: `thinkingmachines/inkling-2-mini`
- **API**: `http://localhost:1235/v1` (LM Studio)
- **Data**: 2026-11-25
- **Parâmetros**: `temperature=0.2`, `max_tokens=8000` (padrão do plano)
- **Tarefas**: 8 (4 backend + 4 frontend)
- **Plano aplicado**: `plan/` (padronizado, justo entre modelos)
- **Modo**: reasoning padrão do modelo (`high`), endpoint OpenAI-compat
- **Modelo**: 26.4B, quantização `Q4_K_M`, contexto carregado de 8704 tokens

---

## Resumo

| Métrica | Valor |
|---|---|
| Tempo total das chamadas | 1552.55 s (~25.9 min) |
| Tokens de entrada (total) | 1266 |
| Tokens de saída (total) | 25280 |
| Tokens totais | 26546 |
| Latência média por tarefa | 194.07 s |
| Throughput médio (tps) | 16.2 |
| **Nota média backend** | **9.4 / 10** |
| **Nota média frontend** | **9.4 / 10** |
| **Nota geral** | **9.4 / 10** |

> Nota técnica: todas as chamadas retornaram `finish_reason: stop` (nenhuma truncada).
> O reasoning padrão (`high`) consumiu boa parte do orçamento de saída — os tokens de
> `completion_tokens` incluem o raciocínio interno, enquanto as respostas cruas salvas
> contêm apenas o texto final. Apesar do contexto carregado de 8704 tokens, a maior
> tarefa (backend-04) usou 7459 tokens no total e concluiu normalmente.

---

## Tarefas de Backend

### backend-01 — API REST com Express + TypeScript
- **Nota**: 9.5/10
- **Checkpoints**: Endpoints REST completos (GET, POST, PATCH, DELETE) ✓ | Validação de título obrigatório ✓ | Tipagem TS estrita ✓ | Estrutura de pastas e código executável ✓ | Instruções de execução + curl ✓
- **Observações**: Solução completa e idiomática, separada em `types`, `store`, `routes`, `app` e `server`. Validação de `title` como string não vazia, status HTTP corretos (201 na criação, 400 na validação, 404 inexistente, 204 na exclusão), middleware central de erros e cópia defensiva na listagem. **Ponto menor**: `CreateTaskInput.title?: unknown` com cast posterior — funciona, mas um tipo mais preciso seria mais limpo — e o endpoint de conclusão usa `PATCH /:id/complete` (adequado, mas diferente de um `PUT` genérico).

### backend-02 — Serviço com TypeScript: tratamento de erros
- **Nota**: 9.0/10
- **Checkpoints**: `Promise<User>` tipada ✓ | Tratamento de erro de rede e status HTTP não-2xx ✓ | `UserNotFoundError` customizado ✓ | Timeout de 5s (`AbortController`) ✓ | Exemplo com try/catch ✓
- **Observações**: Implementação robusta, com `AbortController`, distinção de causas (`not_found`, `http_error`, `network_error`, `timeout`, `invalid_response`), validação do formato da resposta e `clearTimeout` no `finally`. **Ponto negativo (semântica)**: erros de rede, timeout e até `userId` inválido são lançados como `UserNotFoundError`; o campo `reason` ajuda no tratamento, mas a classe não representa corretamente todas as falhas (o mesmo padrão observado em outros modelos).

### backend-03 — Tipos utilitários e genéricos
- **Nota**: 9.5/10
- **Checkpoints**: Partial ✓ | Pick ✓ | Omit ✓ | Readonly ✓ | ReturnType ✓ | Explicações em português ✓
- **Observações**: Todos os cinco utilitários aplicados à interface `Product`, com exemplo prático e resumo final. Explicações corretas, incluindo os detalhes de que `Readonly` é raso e de que `Awaited<ReturnType<...>>` é necessário para funções assíncronas. **Ponto menor**: erro gramatical em "de forma raso" (seria "rasa").

### backend-04 — Refatoração e boas práticas
- **Nota**: 9.5/10
- **Checkpoints**: Separa em módulos ✓ | Tipagem completa ✓ | Tratamento de erros ✓ | Código testável ✓ | Explica as mudanças ✓
- **Observações**: Excelente refatoração com `types`, `errors`, validação pura, interface de repositório, implementação em memória e service com **injeção de dependência** (inclusive gerador de ID injetável). Inclui 7 testes Vitest cobrindo normalização, validações e duplicidade, cópias defensivas e explicação das mudanças e do breaking change. **Pontos menores**: normalização de e-mail repetida no service e no repositório, e `findUserByEmail` lança `ValidationError` para e-mail malformado (decisão de design discutível).

---

## Tarefas de Frontend

### frontend-01 — Componente React com TypeScript
- **Nota**: 9.5/10
- **Checkpoints**: Componente funcional tipado ✓ | Props tipadas (`initialItems: Todo[]`) ✓ | Adicionar/marcar/remover ✓ | useState + hooks apropriados ✓ | Explicação ✓
- **Observações**: Componente correto e bem cuidado: input controlado, updates funcionais (`prev =>`), `useRef` para gerar IDs sem colisão, estado vazio, `key={todo.id}` e atributos de acessibilidade. **Ponto menor**: não reage a mudanças posteriores em `initialItems` (limitação reconhecida na explicação).

### frontend-02 — Custom hook com useEffect
- **Nota**: 9.5/10
- **Checkpoints**: Hook genérico `useDebounce<T>` ✓ | useEffect + setTimeout/cleanup ✓ | Exemplo de uso em busca ✓ | Tipagem ✓
- **Observações**: Hook correto, com valor inicial já debounced e cleanup do timer. Exemplo realista de busca com `useMemo`, contagem de resultados e estado vazio, além de observações pertinentes sobre chamadas assíncronas e referências instáveis.

### frontend-03 — Props, eventos e estado
- **Nota**: 9.5/10
- **Checkpoints**: Formulário email + senha ✓ | Validação de `@` e senha ≥ 6 ✓ | Mensagens de erro ✓ | Prop `onLogin` chamada no sucesso ✓ | Código tipado ✓
- **Observações**: Validação centralizada, erros por campo, `role="alert"`/`aria-invalid`/`aria-describedby`, `noValidate` e chamada de `onLogin` apenas quando válido. **Ponto menor**: os erros não são limpos ao digitar (reconhecido como possível melhoria).

### frontend-04 — Renderização condicional e listas
- **Nota**: 9.0/10
- **Checkpoints**: Lista com chave única ✓ | Renderização condicional "Sem dados" ✓ | Destaque para valores > 100 ✓ | Props tipadas ✓ | Explica keys ✓
- **Observações**: Componente correto, com estado vazio, destaque condicional e CSS de exemplo. **Ponto negativo**: usa `key={`${stat.label}-${index}`}`, que inclui o índice e não é estável sob reordenação/inserção; a resposta reconhece a limitação e recomenda adicionar um `id` estável, mas a implementação entregue não segue a melhor prática que ela mesma descreve.

---

## Considerações finais

- O **Inkling 2 Mini** entrega **qualidade de topo no plano padrão (9.4)**, empatando com GPT-OSS 20B e Gemma 4 E4B em nota geral. As respostas são corretas, bem tipadas e com boas práticas consistentes — com destaque para os updates funcionais e o controle de IDs no `frontend-01` e para a refatoração com DI e testes no `backend-04`.
- **Pontos fortes**: correção acima da média, código idiomático, boa cobertura de edge cases, acessibilidade no frontend e explicações claras.
- **Pontos fracos**: (1) `UserNotFoundError` usado para todas as falhas no `backend-02`; (2) `key` dependente de índice no `frontend-04`; (3) pequenos deslizes de tipagem/gramática.
- **Desempenho**: ~**16.2 tps** e **194 s** de latência média — o teste padrão mais lento depois do `qwen/qwen3-14b` (reasoning on). O tempo total de ~25.9 min inviabiliza uso interativo, embora a qualidade compense em tarefas assíncronas.
- **Verbosidade**: 25.280 tokens de saída, o maior volume do comparativo padrão — em parte pelo reasoning `high` incluído na contagem.
- **Estresse**: não executado nesta avaliação (conforme solicitado); a linha de estresse do ranking permanece apenas com o GPT-OSS 20B.
- As respostas cruas estão em `raw-responses/` para revisão detalhada.
