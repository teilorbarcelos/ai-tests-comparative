# Avaliação — OpenAI GPT-OSS 20B

- **Modelo**: `openai/gpt-oss-20b`
- **API**: `http://localhost:1234/v1` (LM Studio)
- **Data**: 2026-08-20
- **Parâmetros**: `temperature=0.2`, `max_tokens=4000` (padrão do plano)
- **Tarefas**: 8 (4 backend + 4 frontend)
- **Plano aplicado**: `plan/` (padronizado, justo entre modelos)

---

## Resumo

| Métrica | Valor |
|---|---|
| Tempo total das chamadas | 112.83 s |
| Tokens de entrada (total) | 1603 |
| Tokens de saída (total) | 9804 |
| Tokens totais | 11407 |
| Latência média por tarefa | 14.10 s |
| Throughput médio (tps) | 151.9 |
| **Nota média backend** | **9.5 / 10** |
| **Nota média frontend** | **9.2 / 10** |
| **Nota geral** | **9.4 / 10** |

> Nota técnica: todas as chamadas retornaram `finish_reason: stop` (nenhuma truncada por `max_tokens`). A tarefa backend-01 levou 64.8s nesta execução (variação de geração do modelo), elevando a latência média.

---

## Tarefas de Backend

### backend-01 — API REST com Express + TypeScript
- **Nota**: 9.5/10
- **Checkpoints**: Endpoints REST completos (GET, POST, PATCH, DELETE) ✓ | Validação de título obrigatório ✓ | Tipagem TS estrita ✓ | Estrutura de pastas (controllers/services/routes/models) ✓ | Instruções de execução ✓
- **Observações**: Solução muito completa e idiomática, com separação de responsabilidades, middleware de erro e exemplos de curl.

### backend-02 — Serviço com TypeScript: tratamento de erros
- **Nota**: 9.5/10
- **Checkpoints**: `Promise<User>` tipada ✓ | Tratamento de erro de rede e status HTTP ✓ | `UserNotFoundError` customizado ✓ | Timeout de 5s com `AbortController` ✓ | Exemplo com try/catch ✓
- **Observações**: Código robusto, incluindo validação de formato da resposta e cleanup do timeout no `finally`.

### backend-03 — Tipos utilitários e genéricos
- **Nota**: 9.5/10
- **Checkpoints**: Partial ✓ | Pick ✓ | Omit ✓ | Readonly ✓ | ReturnType ✓ | Explicações em português ✓
- **Observações**: Todos os 5 utilitários aplicados corretamente à interface `Product`, com exemplos práticos e tabela-resumo.

### backend-04 — Refatoração e boas práticas
- **Nota**: 9.5/10
- **Checkpoints**: Separa em módulos ✓ | Tipagem completa ✓ | Tratamento de erros ✓ | Código testável (DI + Jest) ✓ | Explica as mudanças ✓
- **Observações**: Refatoração exemplar com interface de repositório, injeção de dependência, exceções customizadas e testes unitários.

---

## Tarefas de Frontend

### frontend-01 — Componente React com TypeScript
- **Nota**: 9.5/10
- **Checkpoints**: Componente funcional tipado ✓ | Props tipadas ✓ | Adicionar/marcar/remover ✓ | useState ✓ | Explicação breve ✓
- **Observações**: `TodoList` completo com `React.FC`, tipagem estrita, prevenção de itens vazios e uso correto de `setTodos(prev => ...)`.

### frontend-02 — Custom hook com useEffect
- **Nota**: 9.5/10
- **Checkpoints**: Hook genérico `useDebounce<T>` ✓ | useEffect + setTimeout/cleanup ✓ | Exemplo de busca ✓ | Tipagem ✓
- **Observações**: Implementação correta do debounce com cleanup do timer. Exemplo prático de busca que filtra lista.

### frontend-03 — Props, eventos e estado
- **Nota**: 9.5/10
- **Checkpoints**: Formulário email+senha ✓ | Validação ✓ | Mensagens de erro ✓ | Prop `onLogin` ✓ | Código tipado ✓
- **Observações**: Validação com feedback visual (borda vermelha + mensagem), `noValidate`, e chamada de `onLogin` apenas no sucesso.

### frontend-04 — Renderização condicional e listas
- **Nota**: 9.0/10
- **Checkpoints**: Lista com key ✓ | Renderização condicional "Sem dados" ✓ | Destaque >100 ✓ | Props tipadas ✓ | Explica keys ✓
- **Observações**: Cumpre todos os requisitos e explica bem o uso de `key`. **Ponto negativo**: usa `Math.random()` como `key`, anti-padrão (regenera a cada render e pode causar perda de estado). Ideal seria usar `label` ou um `id` estável.

---

## Considerações finais

- O **GPT-OSS 20B** entrega respostas de **alta qualidade** em tarefas de backend e frontend com React/Node/TypeScript, com código tipado, idiomático e bem explicado em português.
- **Ponto forte**: separação de responsabilidades, boas práticas (DI, tratamento de erros, testes) e clareza das explicações.
- **Ponto fraco**: em `frontend-04`, o uso de `Math.random()` como `key` no React.
- **Desempenho**: ~152 tps; latência média ~14s (afetada pela geração longa de backend-01).
- As respostas cruas estão em `raw-responses/` para revisão detalhada.
