# Avaliação — DeepSeek R1 0528 (Qwen3 8B)

- **Modelo**: `deepseek/deepseek-r1-0528-qwen3-8b`
- **API**: `http://localhost:1234/v1` (LM Studio)
- **Data**: 2026-08-24
- **Parâmetros**: `temperature=0.2`, `max_tokens=8000` (padrão do plano)
- **Tarefas**: 8 (4 backend + 4 frontend)
- **Plano aplicado**: `plan/` (padronizado, justo entre modelos)
- **Modo**: reasoning padrão do modelo (on), endpoint OpenAI-compat

---

## Resumo

| Métrica | Valor |
|---|---|
| Tempo total das chamadas | 231.05 s (~4 min) |
| Tokens de entrada (total) | 1113 |
| Tokens de saída (total) | 19074 |
| Tokens totais | 20187 |
| Latência média por tarefa | 28.88 s |
| Throughput médio (tps) | 83.1 |
| **Nota média backend** | **8.6 / 10** |
| **Nota média frontend** | **8.5 / 10** |
| **Nota geral** | **8.6 / 10** |

> Nota técnica: todas as chamadas retornaram `finish_reason: stop` (nenhuma truncada por
> `max_tokens`). O reasoning é pesado (ex.: ~3.2k tokens de thinking no backend-01) mas coube
> no orçamento de 8000. Respostas mais **concisas** que as do GPT-OSS/Gemma (menos tokens de
> saída), com foco em código direto e explicações curtas.

---

## Tarefas de Backend

### backend-01 — API REST com Express + TypeScript
- **Nota**: 9.0/10
- **Checkpoints**: Endpoints REST completos (GET, POST, PATCH, DELETE) ✓ | Validação de título obrigatório ✓ | Tipagem TS ✓ | Estrutura de pastas (controllers/models/routes) ✓ | Instruções de execução ✓
- **Observações**: Código completo e funcional, com separação em camadas e tsconfig. **Pontos negativos**: `toggleTodo` busca o estado atual de dentro do controller (acoplado ao repositório) e não há middleware de erro global — cada handler trata por conta própria.

### backend-02 — Serviço com TypeScript: tratamento de erros
- **Nota**: 9.0/10
- **Checkpoints**: `Promise<User>` tipada ✓ | Tratamento de erro de rede e status HTTP ✓ | `UserNotFoundError` customizado ✓ | Timeout de 5s (`AbortController`) ✓ | Exemplo com try/catch ✓
- **Observações**: Implementação correta com `AbortController` + cleanup no `finally`. **Ponto negativo**: lança `UserNotFoundError` para **qualquer** status não-2xx (não só 404), o que é semanticamente impreciso.

### backend-03 — Tipos utilitários e genéricos
- **Nota**: 8.5/10
- **Checkpoints**: Partial ✓ | Pick ✓ | Omit ✓ | Readonly ✓ | ReturnType ✓ | Explicações em português ✓
- **Observações**: Todos os 5 utilitários aplicados à interface `Product` com exemplo de uso. Explicações **corretas porém curtas** — sem a profundidade/tabela-resumo do GPT-OSS e do Gemma.

### backend-04 — Refatoração e boas práticas
- **Nota**: 8.0/10
- **Checkpoints**: Separa em módulos ✓ | Tipagem completa ✓ | Tratamento de erros ✓ | Código testável ✓ (Jest) | Explica as mudanças ✓
- **Observações**: Estrutura com interface, repositório abstrato + in-memory, DI no `UserService` e **exemplo de teste Jest**. **Pontos negativos**: a interface `UserRepository` é referenciada mas **não é definida** no código apresentado (erro de compilação), e `UserService` chama `validateInput` (método só do repositório concreto) através do tipo da interface.

---

## Tarefas de Frontend

### frontend-01 — Componente React com TypeScript
- **Nota**: 9.0/10
- **Checkpoints**: Componente funcional tipado ✓ | Props tipadas ✓ | Adicionar/marcar/remover ✓ | useState ✓ | Explicação ✓
- **Observações**: `TodoList` completo com `useState`, key por `id`, submit via formulário e explicação. Não usa `React.FC` (apenas função tipada), o que é aceitável conforme o enunciado.

### frontend-02 — Custom hook com useEffect
- **Nota**: 9.0/10
- **Checkpoints**: Hook genérico `useDebounce<T>` ✓ | useEffect + setTimeout/cleanup ✓ | Exemplo de busca ✓ | Tipagem ✓
- **Observações**: Implementação correta do debounce com cleanup. **Ponto negativo**: a lista `items` é recriada a cada render (poderia ser `useMemo`/constante fora do componente).

### frontend-03 — Props, eventos e estado
- **Nota**: 9.0/10
- **Checkpoints**: Formulário email+senha ✓ | Validação (@ e senha ≥ 6) ✓ | Mensagens de erro ✓ | Prop `onLogin` ✓ | Código tipado ✓
- **Observações**: Validação granular por campo com regex, feedback visual com classes CSS e limpeza do form após sucesso. Resposta correta e completa.

### frontend-04 — Renderização condicional e listas
- **Nota**: 7.0/10
- **Checkpoints**: Lista com key ✓ | Renderização condicional "Sem dados" ✓ | Destaque >100 ✓ | Props tipadas ✓ | Explica keys ✓
- **Observações**: O componente `Dashboard` base cumpre os requisitos. **Pontos negativos**: (1) usa `key={index}` — a pior prática de keys (a tarefa pede chave única; o próprio texto reconhece a limitação); (2) o componente exportado (`DashboardWithStyles`) renderiza um `<style>` com objeto como children e dois elementos adjacentes sem fragment — **não compila**.

---

## Considerações finais

- O **DeepSeek R1 0528** entrega respostas **corretas e diretas**, porém menos refinadas que o
  GPT-OSS e o Gemma 4 E4B: explicações mais curtas, alguns anti-padrões (`key={index}`,
  `any`, interface não definida) e código ocasionalmente não compilável.
- **Ponto forte**: bom raciocínio no `backend-04` (DI + testes) e velocidade consistente (~83 tps).
- **Ponto fraco**: falhas de compilação/design em `backend-04` e `frontend-04`, e concisão
  excessiva nas explicações.
- **Desempenho**: ~83 tps e latência média ~29s — mais lento que GPT-OSS (~152 tps) e Gemma (~100 tps).
- As respostas cruas estão em `raw-responses/` para revisão detalhada.