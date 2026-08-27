# Avaliação — Qwen3.8 9B Distill

- **Modelo**: `qwen3.8-9b-distill`
- **API**: `http://localhost:1234/v1` (LM Studio)
- **Data**: 2026-08-26
- **Parâmetros**: `temperature=0.2`, `max_tokens=8000` (padrão do plano)
- **Tarefas**: 8 (4 backend + 4 frontend)
- **Plano aplicado**: `plan/` (padronizado, justo entre modelos)
- **Modo**: reasoning padrão do modelo (on), endpoint OpenAI-compat

---

## Resumo

| Métrica | Valor |
|---|---|
| Tempo total das chamadas | 196.25 s (~3.3 min) |
| Tokens de entrada (total) | 1130 |
| Tokens de saída (total) | 17903 |
| Tokens totais | 19033 |
| Latência média por tarefa | 24.53 s |
| Throughput médio (tps) | 90.5 |
| **Nota média backend** | **8.9 / 10** |
| **Nota média frontend** | **9.1 / 10** |
| **Nota geral** | **9.0 / 10** |

> Nota técnica: todas as chamadas retornaram `finish_reason: stop` (nenhuma truncada).
> Reasoning moderado (~1.2k tokens no backend-01), dentro do orçamento de 8000.
> Respostas detalhadas e bem estruturadas, com explicações em tabelas e exemplos completos.

---

## Tarefas de Backend

### backend-01 — API REST com Express + TypeScript
- **Nota**: 8.0/10
- **Checkpoints**: Endpoints REST completos (GET, POST, PUT, DELETE) ✓ | Validação de título obrigatório ✓ | Tipagem TS ✓ | Estrutura de pastas ✓ | Instruções de execução + curl ✓
- **Observações**: Estrutura muito completa (controllers/routes/types/middleware/server) com middleware de validação e erro global. **Pontos negativos (bugs reais)**: (1) `toggleTodo` referencia `req.todo.completed`, mas `req.todo` não existe no tipo `Request` — erro de compilação/execução; (2) o middleware `validateId` exige 24 hex (`ObjectId`) enquanto os IDs gerados são UUID v4 (36 chars com hífens) — GET/PUT/DELETE por ID gerado retornariam 400.

### backend-02 — Serviço com TypeScript: tratamento de erros
- **Nota**: 9.0/10
- **Checkpoints**: `Promise<User>` tipada ✓ | Tratamento de erro de rede e status HTTP ✓ | `UserNotFoundError` customizado ✓ | Timeout de 5s (`AbortController`) ✓ | Exemplo com try/catch ✓
- **Observações**: Implementação robusta com `AbortController`, tratamento de `AbortError` e `TypeError` (rede) e validação do formato da resposta. **Ponto negativo**: lança `UserNotFoundError` para qualquer erro de rede também (semanticamente impreciso).

### backend-03 — Tipos utilitários e genéricos
- **Nota**: 9.0/10
- **Checkpoints**: Partial ✓ | Pick ✓ | Omit ✓ | Readonly ✓ | ReturnType ✓ | Explicações em português ✓
- **Observações**: Todos os 5 utilitários com exemplo prático, bônus de combinação `Omit<Partial<>>`, tabela-resumo e exemplo completo de `ProductController`. **Ponto negativo**: a afirmação de que `Partial<Omit<Product,...>>` deixa `id`/`createdAt` existentes é **incorreta** — as duas ordens são equivalentes.

### backend-04 — Refatoração e boas práticas
- **Nota**: 9.5/10
- **Checkpoints**: Separa em módulos ✓ | Tipagem completa ✓ | Tratamento de erros ✓ | Código testável ✓ | Explica as mudanças ✓
- **Observações**: Excelente — 5 módulos (types/errors/repository/service/index), DI no construtor, custom errors tipados, validação, normalização de e-mail e **testes Jest completos** com `clear()`. **Ponto negativo**: `saveUser` envolve **qualquer** erro do repositório como `EmailAlreadyExistsError` (mascararia erros de persistência).

---

## Tarefas de Frontend

### frontend-01 — Componente React com TypeScript
- **Nota**: 9.0/10
- **Checkpoints**: Componente funcional tipado (React.FC) ✓ | Props tipadas ✓ | Adicionar/marcar/remover ✓ | useState ✓ | Explicação ✓
- **Observações**: `TodoList` completo com key por `id`, suporte a Enter, contador de concluídas e estilos CSS-in-JS. **Ponto negativo**: usa `setTodos([...todos, ...])`/`setTodos(todos.map(...))` com o estado direto em vez de update funcional (`prev =>`), podendo causar stale state em updates concorrentes.

### frontend-02 — Custom hook com useEffect
- **Nota**: 9.5/10
- **Checkpoints**: Hook genérico `useDebounce<T>` ✓ | useEffect + setTimeout/cleanup ✓ | Exemplo de busca ✓ | Tipagem ✓
- **Observações**: Hook correto com cleanup; exemplo realista (`BuscadorDeProdutos`) com dados constantes fora do componente e filtro case-insensitive. Explicação visual do debounce muito boa.

### frontend-03 — Props, eventos e estado
- **Nota**: 9.0/10
- **Checkpoints**: Formulário email+senha ✓ | Validação (@ e senha ≥ 6) ✓ | Mensagens de erro ✓ | Prop `onLogin` ✓ | Código tipado ✓
- **Observações**: Validação em funções separadas, feedback visual (borda + mensagem), limpeza de erro ao digitar e chamada de `onLogin` apenas no sucesso. Completo e correto.

### frontend-04 — Renderização condicional e listas
- **Nota**: 9.0/10
- **Checkpoints**: Lista com key ✓ | Renderização condicional "Sem dados" ✓ | Destaque >100 ✓ | Props tipadas ✓ | Explica keys ✓
- **Observações**: `key={stat.label}` (chave estável), destaque condicional e **melhor explicação de keys entre os modelos testados** (inclusive por que não usar `index`). **Ponto negativo**: o objeto `styles` é definido mas não usado (o componente usa `className`), inconsistência cosmética.

---

## Considerações finais

- O **Qwen3.8 9B Distill** entrega respostas de **alta qualidade e muito bem explicadas**,
  próximas ao GPT-OSS e Gemma em frontend (9.1), mas com bugs de compilação/logica no
  `backend-01` que o seguram no geral (9.0).
- **Ponto forte**: explicações didáticas (tabelas), testes Jest no `backend-04` e a melhor
  explicação de `key` do comparativo.
- **Ponto fraco**: `req.todo` inexistente e mismatch de validação de ID (ObjectId vs UUID)
  no `backend-01` — os dois problemas impedem a API de funcionar ponta a ponta.
- **Desempenho**: ~90.5 tps e latência média ~24.5s — mais rápido que Gemma/DeepSeek em
  latência, mas abaixo do GPT-OSS (~152 tps, ~14s).
- As respostas cruas estão em `raw-responses/` para revisão detalhada.