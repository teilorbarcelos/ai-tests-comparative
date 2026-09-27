# Avaliação — Mistral Devstral Small 2 2512

- **Modelo**: `mistralai/devstral-small-2-2512`
- **API**: `http://localhost:1234/v1` (LM Studio)
- **Data**: 2026-09-27
- **Parâmetros**: `temperature=0.2`, `max_tokens=8000` (padrão do plano)
- **Tarefas**: 8 (4 backend + 4 frontend)
- **Plano aplicado**: `plan/` (padronizado, justo entre modelos)
- **Modo**: default (sem reasoning — o modelo não possui capacidade de reasoning no LM Studio)
- **Config**: 24B · Q3_K_L · contexto 8704 · flash attention

---

## Resumo

| Métrica | Valor |
|---|---|
| Tempo total das chamadas | 265.96 s (~4.4 min) |
| Tokens de entrada (total) | 1117 |
| Tokens de saída (total) | 9234 |
| Tokens totais | 10351 |
| Latência média por tarefa | 33.24 s |
| Throughput médio (tps) | 35.0 |
| **Nota média backend** | **8.6 / 10** |
| **Nota média frontend** | **9.5 / 10** |
| **Nota geral** | **9.1 / 10** |

> Nota técnica: todas as chamadas retornaram `finish_reason: stop` (nenhuma truncada por
> `max_tokens`). O modelo não tem modo reasoning (capacidade ausente no LM Studio), então não
> consome tokens de `thinking`. É o modelo mais lento já testado no plano padrão (~35 tps vs
> ~77–152 dos demais), apesar de rodar em GPU — o throughput é limitado pelo tamanho (24B Q3_K_L).

---

## Tarefas de Backend

### backend-01 — API REST com Express + TypeScript
- **Nota**: 9.0/10
- **Checkpoints**: Endpoints REST completos (GET, POST, PATCH, DELETE) ✓ | Validação de título obrigatório ✓ | Tipagem TS ✓ | Estrutura de pastas (controllers/models/routes/app/server) ✓ | Instruções de execução + exemplos curl ✓
- **Observações**: Solução muito completa, com separação de responsabilidades, 400/404/204 corretos e exemplos de curl. **Pontos negativos**: usa `Math.random().toString(36)` como id (frágil, mas aceitável para memória); o `package.json` gerado não declara `@types/cors`, então o build falha até instalar a dependência de tipos (validado por execução real).

### backend-02 — Serviço com TypeScript: tratamento de erros
- **Nota**: 8.5/10
- **Checkpoints**: `Promise<User>` tipada ✓ | Tratamento de erro de rede e status HTTP ✓ | `UserNotFoundError` customizado ✓ | Timeout de 5s (`Promise.race`) ✓ | Exemplo com try/catch ✓
- **Observações**: Lógica correta e comprovada por execução real (sucesso, 404 → `UserNotFoundError`, timeout em ~5s). **Ponto negativo**: em `strict` mode o código não compila — `Promise` sem tipo no `Promise.race` (resultado `unknown`) e `catch (error)` sem narrowing de `error`. Requer 2 correções de 1 token/cast.

### backend-03 — Tipos utilitários e genéricos
- **Nota**: 9.0/10
- **Checkpoints**: Partial ✓ | Pick ✓ | Omit ✓ | Readonly ✓ | ReturnType ✓ | Explicações em português ✓
- **Observações**: Todos os 5 utilitários aplicados à interface `Product`, cada um com tipo derivado nomeado e uso prático executável, além de tabela-resumo. **Ponto negativo**: repete a definição da interface `Product` 5 vezes em vez de defini-la uma única vez (duplicação de código).

### backend-04 — Refatoração e boas práticas
- **Nota**: 8.0/10
- **Checkpoints**: Separa em módulos ✓ | Tipagem completa ✓ | Tratamento de erros e validações ✓ | Código testável (DI + exemplo Jest) ✓ | Explica as mudanças ✓
- **Observações**: Boa arquitetura (Builder + Repository + Service + DI), validação de unicidade de e-mail e exemplo de teste Jest. **Pontos negativos (validados por execução real)**: o build **falha como gerado** — 1 bug real de código (`UserBuilder` usado sem import em `UserService.ts`) e 2 ajustes de tipagem strict (`spread` de `Partial<User>` não estreita o tipo; `error.message` em `catch`). Após 3 correções, roda e produz UUID corretamente.

---

## Tarefas de Frontend

### frontend-01 — Componente React com TypeScript
- **Nota**: 9.5/10
- **Checkpoints**: Componente funcional tipado (React.FC) ✓ | Props tipadas ✓ | Adicionar/marcar/remover ✓ | useState ✓ | Explicação ✓
- **Observações**: `TodoList` completo com `key={todo.id}` (estável), prevenção de itens vazios, stats e exemplo de uso. Compila em strict e renderiza corretamente (SSR test).

### frontend-02 — Custom hook com useEffect
- **Nota**: 9.5/10
- **Checkpoints**: Hook genérico `useDebounce<T>` ✓ | useEffect + setTimeout/cleanup ✓ | Exemplo de busca ✓ | Tipagem ✓
- **Observações**: Implementação correta do debounce com cleanup e dependências `[value, delay]`; exemplo de busca com filtro real que renderiza/filtra corretamente. Único nit: import de `React` não usado no componente de exemplo (não falha no tsconfig padrão do Vite).

### frontend-03 — Props, eventos e estado
- **Nota**: 9.5/10
- **Checkpoints**: Formulário email+senha ✓ | Validação (@ e senha ≥ 6) ✓ | Mensagens de erro ✓ | Prop `onLogin` ✓ | Código tipado ✓
- **Observações**: Validação centralizada, mensagens de erro por campo, chamada de `onLogin(email)` apenas no sucesso e exemplo de uso no componente pai. Compila e renderiza corretamente.

### frontend-04 — Renderização condicional e listas
- **Nota**: 9.5/10
- **Checkpoints**: Lista com key única ✓ | Renderização condicional "Sem dados" ✓ | Destaque >100 ✓ | Props tipadas ✓ | Explica keys ✓
- **Observações**: Usa `key={stat.label}` (chave estável, boa prática — como o Gemma, e diferente do `Math.random()` do GPT-OSS), destaque com classe `highlight` para valores > 100, mensagem "Sem dados disponíveis" e explicação correta sobre keys.

---

## Considerações finais

- O **Devstral Small 2** entrega respostas de **alta qualidade no frontend** (9.5 em todas as 4 tarefas) e qualidade **sólida no backend** (8.6), com código tipado e bem organizado em português.
- **Ponto forte**: qualidade consistente no React/TS; `frontend-04` usa key estável (melhor que o GPT-OSS). No backend, a refatoração (backend-04) tem ótima arquitetura (DI, builder, testes).
- **Ponto fraco**: tipagem em `strict` no backend — 6 correções de tipo necessárias para compilar (incl. 1 import ausente real em `backend-04` e dependência de tipos `@types/cors` ausente em `backend-01`). Modelo sem reasoning (mais simples, mas também sem o "pensar antes de responder").
- **Desempenho**: **~35 tps** — o mais lento do comparativo padrão (contra 77–152 dos demais) e latência média ~33s. Mesmo em GPU, o throughput é limitado (24B Q3_K_L).
- **Validação por execução real**: ver [`execution-validation-devstral/README.md`](../execution-validation-devstral/README.md) — compila e roda em todas as fases após correções mínimas; nenhum bug de lógica de negócio.
- As respostas cruas estão em `raw-responses/` para revisão detalhada.