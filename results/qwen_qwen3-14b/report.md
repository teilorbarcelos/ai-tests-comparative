# Avaliação — Qwen 3 14B

- **Modelo**: `qwen/qwen3-14b`
- **API**: `http://localhost:1234/v1` (LM Studio)
- **Data**: 2026-08-20
- **Parâmetros**: `temperature=0.2`, `max_tokens=8000` (padrão do plano)
- **Tarefas**: 8 (4 backend + 4 frontend)
- **Plano aplicado**: `plan/` (padronizado, justo entre modelos)
- **Modo**: reasoning ON (padrão) — ver também `qwen_qwen3-14b_reasoning_off/` para a mesma arquitetura com reasoning desligado

---

## Resumo

| Métrica | Valor |
|---|---|
| Tempo total das chamadas | 1049.00 s (~17 min) |
| Tokens de entrada (total) | 1193 |
| Tokens de saída (total) | 15376 |
| Tokens totais | 16569 |
| Latência média por tarefa | 131.12 s |
| Throughput médio (tps) | 14.9 |
| **Nota média backend** | **8.8 / 10** |
| **Nota média frontend** | **9.3 / 10** |
| **Nota geral** | **9.0 / 10** |

> Nota técnica: todas as chamadas retornaram `finish_reason: stop` (nenhuma truncada). Este é um **modelo de raciocínio** — gasta uma parcela considerável dos tokens em "reasoning" antes de responder, o que explica a latência altíssima (~131s por tarefa) e o baixo throughput (~15 tps). O baixo tps indica que o modelo está rodando principalmente em **CPU** (a RTX 5070 Ti não está sendo totalmente aproveitada).

---

## Tarefas de Backend

### backend-01 — API REST com Express + TypeScript
- **Nota**: 9.2/10
- **Checkpoints**: Endpoints REST completos ✓ | Validação de título ✓ | Tipagem TS ✓ | Estrutura de pastas ✓ | Instruções ✓
- **Observações**: Solução completa e bem organizada (types, controller, router, server) com try/catch nos handlers. **Ponto fraco**: usa `PUT` em vez de `PATCH` para marcar como concluída (convenção menor) e não usa um middleware centralizado de erro.

### backend-02 — Serviço com TypeScript: tratamento de erros
- **Nota**: 8.2/10
- **Checkpoints**: `Promise<User>` tipada ✓ | Tratamento de erro HTTP ✓ | `UserNotFoundError` ✓ | Timeout 5s ✓ | Exemplo com try/catch ✓
- **Observações**: Implementa timeout com `AbortController` e validação de resposta. **Ponto fraco**: usa `UserNotFoundError` para **todos** os tipos de erro (rede, timeout, HTTP não-2xx, dados incompletos) — semântica incorreta, pois não distingue "usuário não encontrado" de outros tipos de falha.

### backend-03 — Tipos utilitários e genéricos
- **Nota**: 9.5/10
- **Checkpoints**: Partial ✓ | Pick ✓ | Omit ✓ | Readonly ✓ | ReturnType ✓ | Explicações ✓
- **Observações**: Todos os 5 utilitários aplicados corretamente à interface `Product`, com exemplos práticos e explicações claras. Sem anti-padrões (diferente do Qwen 3.5 9B). Excelente.

### backend-04 — Refatoração e boas práticas
- **Nota**: 8.4/10
- **Checkpoints**: Separa em módulos ✓ | Tipagem ✓ | Tratamento de erros ✓ | Testável (DI + Jest) ✓ | Explica mudanças ✓
- **Observações**: Estrutura clara (repository/service) com injeção de dependência e testes Jest. **Pontos fracos**: não valida email duplicado (o original devolvia o count para checagem), `find` de email é case-sensitive, e o tratamento de erros é genérico (`new Error`) sem classes de erro customizadas com status.

---

## Tarefas de Frontend

### frontend-01 — Componente React com TypeScript
- **Nota**: 9.5/10
- **Checkpoints**: Componente funcional tipado ✓ | **Props tipadas ✓ (recebe `initialItems`)** | Adicionar/marcar/remover ✓ | useState ✓ | Explicação ✓
- **Observações**: Cumpre corretamente o requisito da prop `initialItems`. Completo, tipado e bem explicado. Diferente do Qwen 3.5 9B, que ignorou a prop.

### frontend-02 — Custom hook com useEffect
- **Nota**: 9.5/10
- **Checkpoints**: Hook genérico `useDebounce<T>` ✓ | useEffect + setTimeout/cleanup ✓ | Exemplo de busca ✓ | Tipagem ✓
- **Observações**: Implementação correta do debounce com cleanup e exemplo de busca funcional.

### frontend-03 — Props, eventos e estado
- **Nota**: 9.5/10
- **Checkpoints**: Formulário email+senha ✓ | Validação ✓ | Mensagens de erro ✓ | Prop `onLogin` ✓ | Código tipado ✓
- **Observações**: Validação completa, mensagens de erro, e chamada de `onLogin` apenas no sucesso. Bem tipado e organizado.

### frontend-04 — Renderização condicional e listas
- **Nota**: 8.5/10
- **Checkpoints**: Lista com key ✓ | Renderização condicional "Sem dados" ✓ | Destaque >100 ✓ | Props tipadas ✓ | Explica keys ✓
- **Observações**: Cumpre os requisitos e explica bem o uso de keys. **Ponto fraco**: usa `index` como `key` (anti-padrão para listas dinâmicas) e o "destaque" de valores >100 é apenas cor/negrito do texto, não um realce de fundo mais evidente.

---

## Considerações finais

- O **Qwen 3 14B** entrega respostas de **boa qualidade**, com código tipado e explicações claras. É o mais equilibrado dos Qwen avaliados.
- **Ponto forte**: frontend — todas as tarefas atendidas corretamente, incluindo o uso correto da prop `initialItems` (o que o Qwen 3.5 9B falhou) e um `useDebounce` excelente.
- **Pontos fracos**: semântica de erros em `backend-02` (tudo vira `UserNotFoundError`) e detalhes de refatoração/keys nas demais tarefas.
- **Desempenho**: **muito lento** — modelo de raciocínio com latência média de ~131s por tarefa (~17 min no total) e ~15 tps, o mais lento dos modelos avaliados, rodando majoritariamente em CPU. Na prática, inviável para uso interativo real na mesma máquina.
- As respostas cruas estão em `raw-responses/` para revisão detalhada.
