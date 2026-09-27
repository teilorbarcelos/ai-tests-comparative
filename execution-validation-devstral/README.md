# Validação por Execução Real — mistralai/devstral-small-2-2512

Validamos o código gerado pelo modelo **mistralai/devstral-small-2-2512** (Devstral Small 2, 24B Q3_K_L, API local `http://localhost:1234/v1`, servida por LM Studio) compilando, rodando e testando o código de fato — não apenas avaliando a resposta de forma qualitativa.

Modelo avaliado: `mistralai/devstral-small-2-2512` · Plano padrão (`plan/`) · 8 tarefas (4 backend + 4 frontend).

---

## Fase 1 — API REST de todos (tarefa `backend-01`)

Fonte: `results/mistralai_devstral-small-2-2512/raw-responses/backend-01.md`
(backend · latência 56.39s · tokens out 1863 · tps 33.04)

### 1.1 O que foi materializado

Pasta `phase1-backend01-todo-api/`, seguindo exatamente a estrutura sugerida pelo modelo:

```
phase1-backend01-todo-api/
├─ src/
│  ├─ server.ts
│  ├─ app.ts                    (express.json + cors + monta rotas em /todos)
│  ├─ controllers/todoController.ts
│  ├─ models/types.ts           (Todo, CreateTodoInput)
│  ├─ models/todoModel.ts       (array em memória)
│  └─ routes/todoRoutes.ts      (GET/POST /, PATCH/DELETE /:id)
├─ package.json                 (gerado verbatim pelo modelo)
└─ tsconfig.json                (gerado verbatim pelo modelo)
```

Todo o código-fonte foi materializado **verbatim** (sem edições). A única alteração foi nos arquivos de configuração, descrita abaixo.

### 1.2 Comandos executados e resultados

| Passo | Estado cru (como gerado) | Após correções mínimas |
|-------|--------------------------|------------------------|
| `npm install` | OK (só warnings de dependências transitivas) | OK |
| `npm run build` | **FALHOU** — `TS7016` (sem tipos para `cors`) | **exit 0** |
| Smoke test HTTP (servidor real, porta 3000) | — | **OK** |

Smoke test com o servidor compilado (`node dist/server.js`):
- `GET /` → `API de Gerenciamento de Tarefas`
- `GET /todos` (vazio) → `[]`
- `POST /todos {"title":"Estudar TypeScript"}` → **201**, `id` gerado, `completed: false`
- `POST /todos {"title":""}` → **400** (validação de título)
- `PATCH /todos/:id` → `completed: true` (toggle)
- `PATCH /todos/naoexiste` → **404**
- `DELETE /todos/:id` → **204**; `DELETE /todos/naoexiste` → **404**

### 1.3 Problemas encontrados no estado cru

1. **Dependência de tipos `@types/cors` ausente no `package.json`**
   - `src/app.ts` importa `cors`, mas o `package.json` gerado não declara `@types/cors`.
   - **Correção:** `npm i --save-dev @types/cors` (1 linha em `devDependencies`).
   - **Classificação:** defeito de configuração de projeto, não de lógica de negócio.

### 1.4 Conclusão da Fase 1

**APROVADA.** A API REST de todos compila e roda após 1 correção de configuração (tipos do `cors`). Nenhum bug de lógica; todos os endpoints e validações funcionam conforme o enunciado.

---

## Fase 2 — Serviço `fetchUserData` com timeout (tarefa `backend-02`)

Fonte: `results/mistralai_devstral-small-2-2512/raw-responses/backend-02.md`
(backend · latência 22.79s · tokens out 788 · tps 34.58)

### 2.1 O que foi materializado

Pasta `phase2-backend02-fetch/` com `fetchUserData.ts` (verbatim) e `test.ts` (mock de `fetch` para exercitar sucesso, 404 e timeout).

### 2.2 Resultados

| Passo | Estado cru | Após correções mínimas |
|-------|-----------|------------------------|
| `npm run build` (tsc strict) | **FALHOU** — 4 erros de tipo | **exit 0** |
| Execução (`node dist/test.js`) | — | **OK** |

Execução real (com mock de fetch):
- Sucesso → retorna `{id, name, email}` corretamente
- Status 404 → lança `UserNotFoundError` (instância correta)
- Timeout → rejeita após ~5s com mensagem `Request timed out after 5000ms` (5011ms medidos)

### 2.3 Problemas encontrados no estado cru

1. **`Promise.race` com `Promise` sem tipo explícito** → o resultado fica `unknown` em strict mode (`TS18046` em 3 pontos).
   - **Correção:** `new Promise<never>((_, reject) => ...)` (1 token).
2. **`catch (error)` acessando `error.message`** → `error` é `unknown` em strict mode (`TS18046`).
   - **Correção:** `(error as Error).message` (1 cast).

**Classificação:** 2 defeitos de tipagem (strict mode) triviais, 1 token/cast cada. A lógica de timeout/erro funciona corretamente em runtime. Em um `tsconfig` sem `strict`, o código compilaria como gerado.

### 2.4 Conclusão da Fase 2

**APROVADA.** Lógica correta; exige 2 ajustes de tipo para compilar em `strict` (padrão do plano).

---

## Fase 3 — Refatoração com módulos e DI (tarefa `backend-04`)

Fonte: `results/mistralai_devstral-small-2-2512/raw-responses/backend-04.md`
(backend · latência 46.15s · tokens out 1589 · tps 34.43)

### 3.1 O que foi materializado

Pasta `phase3-backend04-refactor/` com a estrutura sugerida (verbatim):

```
phase3-backend04-refactor/
├─ src/
│  ├─ index.ts                   (composição DI + exemplo de uso)
│  ├─ models/User.ts             (interface User + UserBuilder)
│  ├─ models/UserRepository.ts   (interface + InMemoryUserRepository)
│  └─ services/UserService.ts    (createUser, getUserByEmail, getAllUsers)
├─ package.json
└─ tsconfig.json
```

### 3.2 Resultados

| Passo | Estado cru | Após correções mínimas |
|-------|-----------|------------------------|
| `npm run build` (tsc strict) | **FALHOU** — 3 erros de tipo | **exit 0** |
| Execução (`node dist/index.js`) | — | **OK** |

Execução real: criou usuário com UUID (`crypto.randomUUID()`), `findByEmail` encontrou, `findAll` listou 1 usuário.

### 3.3 Problemas encontrados no estado cru

1. **[BUG real de código]** `UserService.ts` usa `new UserBuilder()` **sem importá-lo** (`TS2304: Cannot find name 'UserBuilder'`).
   - **Correção:** `import { User, UserBuilder } from "../models/User";` (1 linha).
2. **`build()` com spread de `Partial<User>`** → TS não estreita o tipo após as validações de `name`/`email` (`TS2322`).
   - **Correção:** extrair `name`/`email` para consts tipadas antes do `return`.
3. **`catch (error)` com `error.message` no `index.ts`** → `unknown` em strict (`TS18046`).
   - **Correção:** `(error as Error).message`.

**Classificação:** 1 bug real de import ausente (não compilava) + 2 ajustes de tipagem strict. A lógica de negócio (builder, repositório, DI, unicidade de e-mail) está correta e roda bem. O modelo entregou também exemplo de teste Jest (não executado aqui por falta de Jest no setup).

### 3.4 Conclusão da Fase 3

**APROVADA (com 3 correções de tipo/import).** Refatoração com boa arquitetura (DI + repositório + builder); 1 bug de import ausente impede o build como gerado.

---

## Fase 4 — Componentes React (tarefas `frontend-01` a `frontend-04`)

Fonte: `results/mistralai_devstral-small-2-2512/raw-responses/frontend-*.md`
(frontend · latência 19–32s · tps ~35)

### 4.1 O que foi materializado

Pasta `phase4-frontend-components/` (Vite + React 18 + TS strict). Componentes verbatim:
- `src/TodoList.tsx` (frontend-01) — adicionar, toggle, remover, key por `id`, stats
- `src/useDebounce.ts` + `src/SearchComponent.tsx` (frontend-02) — hook genérico com cleanup
- `src/LoginForm.tsx` (frontend-03) — validação de e-mail (`@`) e senha (≥6), mensagens de erro
- `src/Dashboard.tsx` (frontend-04) — lista com `key={stat.label}`, "Sem dados", destaque >100
- `src/main.tsx` (harness) e `src/ssr-test.tsx` (teste de renderização)

### 4.2 Resultados

| Passo | Resultado |
|-------|-----------|
| `npm run typecheck` (tsc --noEmit, strict) | **exit 0** (após 1 correção) |
| `npm run build` (vite build) | **exit 0** |
| Teste SSR (`renderToStaticMarkup`) | **9/9 asserções OK** |

Testes SSR verificados:
- TodoList renderiza título e item inicial
- SearchComponent renderiza e filtra (não mostra `Apple` sem termo)
- LoginForm renderiza campos e botão
- Dashboard renderiza stats, aplica classe `highlight` para valor > 100, e mostra "Sem dados disponíveis" quando vazio

### 4.3 Problemas encontrados

1. **[Trivial]** `SearchComponent.tsx` importa `React` sem usar (`TS6133` em strict com `noUnusedLocals`).
   - **Correção:** `import { useState } from 'react';` (remover `React,`).

**Classificação:** 1 import não usado (regra de lint/strict), zero bugs de lógica. Todos os 4 componentes frontend funcionam.

### 4.4 Conclusão da Fase 4

**APROVADA.** Frontend puro sem bugs de código. Destaque: `Dashboard` usa `key={stat.label}` (estável, boa prática) e explica o uso de keys.

---

## Resumo consolidado

| Fase | Tarefa | Tipo | Build | Execução | Defeitos reais no código gerado |
|------|--------|------|-------|----------|--------------------------------|
| 1 | backend-01 Todo API | backend | ✅ (1 dep de tipos) | smoke HTTP OK | 1 (config: `@types/cors`) |
| 2 | backend-02 fetchUserData | backend | ✅ (2 ajustes strict) | sucesso/404/timeout OK | 2 (tipagem strict) |
| 3 | backend-04 Refatoração | backend | ✅ (3 ajustes) | DI + builder OK | 3 (1 import ausente + 2 tipos) |
| 4 | frontend-01..04 | frontend | ✅ (1 ajuste) | 9/9 SSR | 1 (import não usado) |

**Veredito geral (execução):** o código gerado **compila e roda** em todas as tarefas avaliadas após correções mínimas. Defeitos mais comuns: **tipagem strict mode** (6 correções de 1 token/cast), **1 import ausente real** (`UserBuilder` em backend-04) e **1 dependência de tipos ausente** (`@types/cors`). Nenhuma lógica de negócio apresentou falha estrutural; frontend puro não teve nenhum bug de lógica. O padrão é semelhante ao do GPT-OSS, mas com mais ajustes de tipagem (o modelo "esquece" tipos de `Promise`/`catch` em strict).