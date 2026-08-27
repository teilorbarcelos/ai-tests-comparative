# Avaliação — Qwen 3.5 9B

- **Modelo**: `qwen/qwen3.5-9b`
- **API**: `http://localhost:1234/v1` (LM Studio)
- **Data**: 2026-08-20
- **Parâmetros**: `temperature=0.2`, `max_tokens=4000` (padrão do plano)
- **Tarefas**: 8 (4 backend + 4 frontend)
- **Plano aplicado**: `plan/` (padronizado, justo entre modelos)

---

## Resumo

| Métrica | Valor |
|---|---|
| Tempo total das chamadas | 171.26 s |
| Tokens de entrada (total) | 1130 |
| Tokens de saída (total) | 13056 |
| Tokens totais | 14186 |
| Latência média por tarefa | 21.41 s |
| Throughput médio (tps) | 77.2 |
| **Nota média backend** | **8.5 / 10** |
| **Nota média frontend** | **8.6 / 10** |
| **Nota geral** | **8.6 / 10** |

> Nota técnica: todas as chamadas retornaram `finish_reason: stop` (nenhuma truncada). O Qwen é mais verboso que o GPT-OSS (gera ~13k tokens de saída contra ~9.8k), por isso precisou de `max_tokens=4000`.

---

## Tarefas de Backend

### backend-01 — API REST com Express + TypeScript
- **Nota**: 9.2/10
- **Checkpoints**: Endpoints REST completos ✓ | Validação de título ✓ | Tipagem TS ✓ | Estrutura de pastas ✓ | Instruções de execução ✓
- **Observações**: Solução completa e bem organizada (types, controller, routes, server), com validação. **Ponto fraco**: define um middleware de validação com `zod` (`validateCreateTodo`) mas não o conecta às rotas — o código de validação fica duplicado/redundante com a checagem manual no controller.

### backend-02 — Serviço com TypeScript: tratamento de erros
- **Nota**: 8.0/10
- **Checkpoints**: `Promise<User>` tipada ✓ | Tratamento de erro HTTP ✓ | `UserNotFoundError` ✓ | Timeout 5s ✓ | Exemplo com try/catch ✓
- **Observações**: Implementa timeout com `AbortController` e exceção customizada. **Pontos fracos**: (1) **bug de escopo** — a variável `response` é usada no bloco `catch`, mas foi declarada com `const` dentro do `try`, sendo inacessível no `catch` (erro de compilação/escopo em TS). (2) Trata `401` como `UserNotFoundError`, semântica conceitualmente incorreta (401 = não autorizado).

### backend-03 — Tipos utilitários e genéricos
- **Nota**: 8.2/10
- **Checkpoints**: Partial ✓ | Pick ✓ | Omit ✓ | Readonly ✓ | ReturnType ✓ | Explicações ✓
- **Observações**: Todos os 5 utilitários aplicados com exemplos e explicações claras. **Ponto fraco**: no exemplo de `Omit`, usa `id: undefined as never` / `createdAt: undefined as never` para "remover" campos — isso é um anti-padrão que não demonstra o uso correto de `Omit` (o tipo derivado deveria simplesmente não conter esses campos; o objeto não deveria precisar declará-los).

### backend-04 — Refatoração e boas práticas
- **Nota**: 8.5/10
- **Checkpoints**: Separa em módulos ✓ | Tipagem ✓ | Tratamento de erros ✓ | Testável (DI + Jest) ✓ | Explica mudanças ✓
- **Observações**: Estrutura clara (types/repository/service/errors) com DI e testes unitários. **Ponto fraco**: usa `EmailNotFoundError` para sinalizar "email já existe em uso" — semântica confusa (deveria ser `DuplicateEmailError`), além de o `findByEmail` lançar erro em vez de retornar `null` no `UserRepository`.

---

## Tarefas de Frontend

### frontend-01 — Componente React com TypeScript
- **Nota**: 7.0/10
- **Checkpoints**: Componente funcional ✓ | **Props tipadas ✗ (ignorou `initialItems`)** | Adicionar/marcar/remover ✓ | useState ✓ | Explicação ✓
- **Observações**: Componente funcional e bem estilizado, com resumo de progresso. **Falha importante**: o enunciado exigia a prop `initialItems: Todo[]`, mas o componente foi definido como `React.FC` **sem receber nenhuma prop** e inicializa o estado com `[]`. Não atende ao requisito central da tarefa, apesar de ser funcionalmente útil.

### frontend-02 — Custom hook com useEffect
- **Nota**: 9.5/10
- **Checkpoints**: Hook genérico `useDebounce<T>` ✓ | useEffect + setTimeout/cleanup ✓ | Exemplo de busca ✓ | Tipagem ✓
- **Observações**: Implementação correta do debounce, incluindo cleanup e tratamento do caso `delay <= 0`. Exemplo de busca completo com feedback visual e boas práticas.

### frontend-03 — Props, eventos e estado
- **Nota**: 9.4/10
- **Checkpoints**: Formulário email+senha ✓ | Validação ✓ | Mensagens de erro ✓ | Prop `onLogin` ✓ | Código tipado ✓
- **Observações**: Validação completa com mensagens de erro, chamada de `onLogin` no sucesso e código tipado. Bem organizado e completo.

### frontend-04 — Renderização condicional e listas
- **Nota**: 8.6/10
- **Checkpoints**: Lista com key ✓ | Renderização condicional "Sem dados" ✓ | Destaque >100 ✓ | Props tipadas ✓ | Explica keys ✓
- **Observações**: Cumpre todos os requisitos, com destaque visual de valores >100 e boa explicação sobre `key`. **Ponto fraco**: usa `stat.label` como `key`, que pode não ser única se houver labels repetidos — o ideal seria um `id` estável.

---

## Considerações finais

- O **Qwen 3.5 9B** entrega respostas **boas** e detalhadas, com código tipado e explicações claras. É mais verboso que o GPT-OSS, gerando respostas mais longas.
- **Ponto forte**: clareza das explicações e completude das respostas em tarefas de frontend (useDebounce e formulário de login ficaram excelentes).
- **Pontos fracos**: mais erros conceituais/de escopo que o GPT-OSS — destaque para `frontend-01` (ignorou a prop `initialItems`), o bug de escopo em `backend-02`, e o uso de `Omit` incorreto em `backend-03`.
- **Desempenho**: ~77 tps (metade do GPT-OSS), latência média ~21s — mais lento na mesma máquina.
- As respostas cruas estão em `raw-responses/` para revisão detalhada.
