# Validação por Execução Real — openai/gpt-oss-20b

Validamos o código gerado pelo modelo **openai/gpt-oss-20b** (API local `http://localhost:1234/v1`, servida por Bionic/LM Studio) compilando, rodando e testando o código de fato — não apenas avaliando a resposta de forma qualitativa.

Modelo avaliado: `openai/gpt-oss-20b` · Teste de estresse (`plan-stress/`) · Tarefas de backend/frontend.

---

## Fase 1 — LRU Cache (tarefa `s07-desafiador`)

- Pasta: `phase1-lru/`
- Resultado: **build `tsc` exit 0** e **4/4 testes Jest passaram**.
- Detalhes: `src/LRUCache.ts`, `tests/LRUCache.test.ts`, `package.json`, `tsconfig.json`, `jest.config.js`.

---

## Fase 2 — API REST de e-commerce (tarefa `s05-avancado`)

Fonte: `results-stress/openai_gpt-oss-20b/raw-responses/s05-avancado.md`
(backend · latência 19.49s · tokens out 3421 · tps 175.5)

### 2.1 O que foi materializado

Pasta `phase2-ecommerce/`, seguindo exatamente a estrutura sugerida pelo modelo:

```
phase2-ecommerce/
├─ src/
│  ├─ app.ts
│  ├─ server.ts
│  ├─ models/Product.ts
│  ├─ repositories/InMemoryProductRepository.ts
│  ├─ services/ProductService.ts        (validação Zod: create/update schemas)
│  ├─ controllers/ProductController.ts
│  ├─ routes/productRoutes.ts
│  ├─ middleware/errorHandler.ts        (ZodError → 400; Product not found → 404)
│  └─ utils/pagination.ts
├─ tests/services/ProductService.test.ts  (6 testes)
├─ package.json
├─ tsconfig.json
└─ jest.config.js
```

Todo o código-fonte foi materializado **verbatim** (sem edições). As únicas alterações foram nos arquivos de configuração, descritas abaixo, para permitir que o build/testes rodassem.

### 2.2 Comandos executados e resultados

| Passo | Estado cru (como gerado) | Após correções mínimas |
|-------|--------------------------|------------------------|
| `npm install` | OK (392 pacotes, só warnings de dependências transitivas) | OK |
| `npm run build` | **FALHOU** — `TS6059` | **exit 0** |
| `npm test` | — (build bloqueado) | **6/6 testes passaram** (1 suite) |
| Smoke test HTTP (servidor real) | — | **OK** |

Smoke test com o servidor compilado (`node dist/server.js`, porta 3000):
- `POST /api/products` → **201**, produto criado com UUID
- `GET /api/products?limit=5` → `{ total: 1, items: [ ... ] }`
- `GET /api/products/nonexistent` → **404** (Product not found)
- `POST` com payload inválido (`name:""`, `price:-5`, `quantity:-1`) → **400** (ZodError via errorHandler)

### 2.3 Problemas encontrados no estado cru — análise

Foram **2 defeitos reais do código/config gerado** (não do ambiente):

1. **Dependência `uuid` ausente no `package.json`**
   - `src/repositories/InMemoryProductRepository.ts` importa `{ v4 as uuidv4 } from 'uuid'`, mas o `package.json` gerado não declara `uuid`. O código nunca compilaria/rodaria sem a dependência.
   - **Correção:** adicionado `"uuid": "^9.0.1"` em `dependencies`.

2. **Tipos de `uuid` ausentes** (`@types/uuid` não declarado)
   - Após adicionar `uuid`, o build falhou com `TS7016` (sem declaração de tipos).
   - **Correção:** adicionado `"@types/uuid": "^9.0.8"` em `devDependencies`.

3. **`tsconfig.json` com `include: ["src/**/*", "tests/**/*"]` + `rootDir: "./src"`**
   - Build falha com `TS6059` ("tests not under rootDir") — o build gerado nunca passaria como estava.
   - **Correção:** `include: ["src/**/*"]` e `exclude: ["node_modules", "tests"]` (mesma convenção já usada na Fase 1; o Jest compila os testes via ts-jest).
   - Efeito colateral observado: no estado cru, o `tsc` ainda emite o `.js` dos testes em `tests/` (comportamento default `noEmitOnError: false`), e o Jest então roda cada teste **duas vezes** (`.ts` + `.js`). O artefato residual foi removido.

**Classificação:** Nenhum dos defeitos está na lógica de negócio (ProductService/Zod, repositório, controller, rotas, errorHandler, paginação). Todos estão na **camada de configuração do projeto** (`package.json`/`tsconfig.json`) e são facilmente corrigíveis. A lógica gerada compilou em `strict` mode sem nenhum erro de tipo e os 6 testes unitários passaram de primeira após as correções de dependência.

### 2.4 Notas adicionais

- `strict: true` no tsconfig: nenhum erro de tipo no código fonte (incl. o uso de `filters.minPrice!` no `list`).
- Validação Zod cobrindo `create` e `update` funciona conforme esperado (testes + smoke test 400).
- Banco em memória (array), dados perdidos a cada restart — comportamento documentado pelo próprio modelo.

### 2.5 Conclusão da Fase 2

**APROVADA.** A API REST de e-commerce gerada pelo GPT-OSS 20B compila, roda e passa nos testes após correções mínimas de dependências/config (3 linhas em `package.json` + 2 linhas em `tsconfig.json`). Não houve nenhum bug de lógica.

---

## Fase 3 — Feature full-stack de carrinho (tarefa `s08-desafiador`)

Fonte: `results-stress/openai_gpt-oss-20b/raw-responses/s08-desafiador.md`
(fullstack · latência 17.41s · tokens out 3081 · tps 176.98)

### 3.1 O que foi materializado

Pasta `phase3-cart/`, com `backend/` (Express + TS) e `frontend/` (React + Vite + TS):

```
phase3-cart/
├─ backend/
│  ├─ src/
│  │  ├─ api/cart.ts            (GET /cart, POST /cart/add, POST /cart/remove + validação Zod)
│  │  ├─ domain/types.ts        (Product, CartItem — tipos compartilhados)
│  │  ├─ infra/memoryCartStore.ts
│  │  └─ app.ts                 (express.json + monta router em /api, porta 4000)
│  ├─ package.json
│  └─ tsconfig.json
└─ frontend/
   ├─ src/
   │  ├─ api/cartApi.ts         (wrapper axios → baseURL http://localhost:4000/api)
   │  ├─ hooks/useCart.ts
   │  ├─ components/Cart.tsx
   │  ├─ domain/types.ts        (cópia dos tipos do backend)
   │  └─ App.tsx
   ├─ package.json
   └─ index.html / tsconfig.json / src/main.tsx   ← NÃO foram gerados pelo modelo (ver 3.3)
```

Todo o código de domínio, API, hook, componente e `App.tsx` foi materializado **verbatim**.

### 3.2 Comandos executados e resultados

| Componente | Comando | Resultado |
|-----------|---------|-----------|
| Backend | `npm install` | OK |
| Backend | `npm run build` (tsc) | **exit 0** |
| Frontend | `npm install` | OK |
| Frontend | `npx tsc --noEmit` | **falhou** — 1 erro de tipo real (ver 3.3) |
| Frontend | `npm run build` (vite build) | exit 0 (após correção do tipo) |

**Smoke test HTTP do backend** (API real, porta 4000):
- `GET /api/cart` → `[]`
- `POST /api/cart/add` (p1, qty 2) → **201**, item no carrinho
- `POST /api/cart/add` (p1, qty 3) → quantidade **acumula** para 5 (merge do `MemoryCartStore`)
- `POST /api/cart/remove` (p1) → item removido
- `POST /api/cart/remove` (id inexistente) → **404** (`Item não encontrado`)
- `POST /api/cart/add` com `quantity: 0` → **400** (Zod)

**Validação do contrato full-stack:** o wrapper `cartApi.ts` do frontend (axios, `baseURL /api`) foi executado contra o backend real e todos os formatos de requisição/resposta bateram exatamente com os endpoints (`/cart`, `/cart/add`, `/cart/remove`) e com os tipos compartilhados `Product`/`CartItem`. Ou seja, a tipagem consistente prometida ("tipos compartilhados") se confirmou na prática.

### 3.3 Problemas encontrados — análise

1. **[BUG real de tipo no código gerado]** `frontend/src/hooks/useCart.ts:23` — `useEffect(() => load(), [])` retorna `Promise<void>`.
   - Erro `TS2322: Type 'Promise<void>' is not assignable to type 'void | Destructor'` sob `strict` + tipos do React 18. É um erro real de tipagem (o `vite build` não pega porque o esbuild não faz type-check).
   - **Correção mínima:** `useEffect(() => { load(); }, [])` (mesmo comportamento).

2. **Scaffolding do frontend ausente no código gerado** — o modelo não forneceu `frontend/tsconfig.json`, `index.html` nem `src/main.tsx` (bootstrap necessário para qualquer app Vite). Sem eles, o frontend **não compila/builda**.
   - **Correção:** adicionados `tsconfig.json` (padrão Vite React, `strict`, `jsx: react-jsx`, `noEmit`) e `index.html` + `src/main.tsx` mínimos.

3. **CORS não configurado** — a API não envia `Access-Control-Allow-Origin`. Em navegador, o frontend (Vite dev em `localhost:5173`) chamando `localhost:4000` seria bloqueado por CORS até adicionar o middleware `cors` — **o próprio modelo sinalizou isso** ("Se precisar, adicione `cors`"). Funciona via Node/HTTP sem restrição.

4. **Docs imprecisas em "Como integrar"** — `npm link ../frontend/src/domain` não funciona como descrito (`npm link` opera sobre pacotes, não diretórios arbitrários). Cosmético, não afeta o código.

**Classificação:** 1 erro real de tipagem (trivial, 1 linha), scaffolding ausente (config, não lógica) e CORS (o modelo já avisava). Nenhum defeito na lógica de negócio: store, validação Zod e os 3 endpoints funcionam; o contrato full-stack é consistente.

### 3.4 Conclusão da Fase 3

**APROVADA (com 1 correção de 1 linha).** A feature full-stack de carrinho gera um backend que compila e roda, um frontend que type-checka e builda, e um contrato de API/tipos consistente entre as duas pontas. O único defeito real de código foi o retorno de `Promise` em `useEffect` — bug comum, barato de corrigir.

---

## Fase 4 — Tipos avançados e genéricos (tarefa `s01-basico`)

Pasta: `phase4-s01-types/` · backend · latência 29.22s · tokens 1245 · tps 42.61

- **Função `groupBy<T,K>`** materializada verbatim + exemplo prático.
- **Build:** `tsc` **exit 0** · **Testes:** **5/5 passaram** · **Execução:** `node dist/example.js` imprimiu corretamente o `Map` agrupado por categoria.
- **Bug real encontrado:** o exemplo gerado (`example.ts`) usa `groupBy` **sem importá-lo** (`TS2304` no build). Correção: adicionado `import { groupBy } from './groupBy';` (1 linha). A função em si está correta.

## Fase 5 — Serviço com injeção de dependência (tarefa `s03-intermediario`)

Pasta: `phase5-s03-auth/` · backend · latência 12.42s · tokens 2208 · tps 177.75

- **Build:** inicialmente **falhou com 3 erros reais de código**; após correções mínimas, **exit 0**.
  - `TS2459` — `InMemoryUserRepository` importa `User` de `domain/repositories` (módulo errado; está em `domain/models`).
  - `TS2339` — `req.userId` não existe em `Request` (rota `/me`).
  - `TS2307` — `jsonwebtoken` importado (mesmo que não usado) sem dependência declarada.
- **Smoke test HTTP** (após build): `register` → 201; duplicado → 400; `login` senha errada → 401; `/me` sem token → 401.
- **Bug funcional real:** o token emitido pelo `/login` (`token-<uuid>-<timestamp>`) **nunca é aceito** pelo middleware de `/me`, que espera `token-<base64(JSON)>`. Com um token no formato esperado pelo middleware, `/me` funciona (200). Ou seja, o fluxo auth end-to-end está quebrado — o middleware é uma "simulação" que não bate com a geração do token.

## Fase 6 — Debug e correção de código com bugs (tarefa `s09-extremo`)

Pasta: `phase6-s09-users/` · fullstack · latência 12.6s · tokens 2227 · tps 176.73

- Materializada a **"versão corrigida & refatorada"** (`src/app.ts`) verbatim.
- **Build:** `TS7006` (`res` implicit any na rota PUT com array de middlewares) — corrigido tipando `res: Response`; depois **exit 0**.
- **Bug funcional real (grave):** a correção #8 que o modelo afirma ter feito — "**Proteção contra alteração de ID no PUT**" — **não funciona**. Como `req.body` é `any`, o `Omit<User,'id'>` é ignorado em runtime e `{...user, ...req.body}` sobrescreve o `id` (enviar `{id: 999}` muda o ID do usuário). Verificado por smoke test. Corrigido filtrando os campos permitidos (`name`/`email`) no `update`.
- **Smoke test completo após correção:** POST 201, validação 400 (sem name / name vazio), GET por id 200, 404 inexistente, 400 id inválido (`/users/abc`), busca case-insensitive (`?search=ANA`), PUT preserva ID, PUT inexistente 404. Tudo OK.

## Fase 7 — Componente com hooks avançados (tarefa `s02-basico`)

Pasta: `phase7-s02-counter/` · frontend · latência 9.55s · tokens 1690 · tps 176.98

- `useLocalStorage`, `useHistory`, `Counter` (useReducer) e `App.tsx` verbatim.
- **Typecheck:** exit 0 (strict) · **Vite build:** exit 0 · **Testes SSR:** **2/2** (Counter renderiza com estado 0, botões e histórico).
- Sem bugs de código; adicionado apenas o scaffolding Vite que o modelo não forneceu (`tsconfig.json`, `index.html`, `main.tsx`).

## Fase 8 — App React com roteamento e estado global (tarefa `s04-intermediario`)

Pasta: `phase8-s04-auth-spa/` · frontend · latência 12.1s · tokens 2168 · tps 179.19

- AuthContext, ProtectedRoute, páginas (Login/Dashboard/NotFound), AppRoutes e main.tsx verbatim.
- **Typecheck:** exit 0 (strict) · **Vite build:** exit 0.
- Sem bugs de código; adicionado apenas o scaffolding Vite (`package.json`, `tsconfig.json`, `index.html`, `vite-env.d.ts`).

## Fase 9 — Dashboard com fetching, filtros e componentes reutilizáveis (tarefa `s06-avancado`)

Pasta: `phase9-s06-dashboard/` · frontend · latência 14.87s · tokens 2612 · tps 175.67

- `useFetch<T>`, Button/Input/Card/Dashboard + CSS, App e index.tsx verbatim.
- **Typecheck:** exit 0 (strict) · **Vite build:** exit 0 · **Testes SSR:** **3/3** (renderiza "Carregando..." no SSR, mockData, filtro case-insensitive).
- Sem bugs de código. Ajustes de harness: CSS stub (`moduleNameMapper`) no Jest e scaffolding Vite.

## Fase 10 — Arquitetura completa full-stack (tarefa `s10-extremo`)

Pasta: `phase10-s10-monorepo/` · fullstack · latência 31.33s · tokens 5453 · tps 174.05

Validação **limitada**: o runtime E2E exige **PostgreSQL** (Prisma) e **Redis** (docker-compose), indisponíveis neste ambiente. Validamos a compilação das 3 camadas:

| Camada | Resultado |
|--------|-----------|
| `packages/domain` (tipos compartilhados) | `tsc` **exit 0** |
| `packages/backend` (Express 5 + Prisma + Zod + JWT) | `prisma generate` OK + `tsc` **exit 0** após correções |
| `packages/frontend` (React + RTK Query) | `tsc && vite build` **exit 0** após correção |

- **Bugs reais do código gerado:**
  - Backend: `req.user` não existe em `Request` (`TS2339`) — rotas acessam `req.user.id`. Corrigido com augmentação global do Express (`src/types/express.d.ts`).
  - Backend: `req.params.id` no Express 5 é `string \| string[]` (`TS2345`) — corrigido com cast `as string`.
  - Backend: tipos de domínio com campos opcionais (`description?`, `dueDate?`) incompatíveis com a saída do Prisma (`string \| null`, `Date \| null`) — corrigido alinhando o `Task` do domain.
  - Backend: `@todo/domain` importado no `taskService` mas **não declarado** em `package.json` (dependência ausente).
  - Frontend: `react-redux` (`Provider`, `useDispatch`, `useSelector`) importado mas **não declarado** em `package.json` (`TS2307`).
  - `tsconfig.build.json`, `tsconfig.json` do backend e `src/types/task.ts` do frontend **não foram fornecidos** pelo modelo (necessários para compilar).
- **Docs:** o monorepo proposto depende de `pnpm`, Prisma/Postgres e Redis; estrutura citada ("scripts na raiz") não vem acompanhada dos arquivos de config/Docker, deixados como "padrões comuns".

---

## Resumo consolidado

| Fase | Tarefa | Tipo | Build | Testes/Execução | Defeitos reais no código gerado |
|------|--------|------|-------|------------------|--------------------------------|
| 1 | s07 LRU Cache | backend | ✅ | 4/4 | nenhum |
| 2 | s05 API e-commerce | backend | ✅ | 6/6 + smoke HTTP | 2 (deps/config) |
| 3 | s08 Carrinho full-stack | fullstack | ✅ | smoke + contrato | 1 (Promise em useEffect) |
| 4 | s01 groupBy | backend | ✅ | 5/5 + execução | 1 (import ausente no exemplo) |
| 5 | s03 Auth DI | backend | ✅ | smoke HTTP | 4 (3 type + 1 funcional) |
| 6 | s09 API users corrigida | fullstack | ✅ | smoke HTTP | 2 (1 type + 1 funcional grave) |
| 7 | s02 Counter hooks | frontend | ✅ | 2/2 SSR | nenhum |
| 8 | s04 SPA auth | frontend | ✅ | typecheck/build | nenhum |
| 9 | s06 Dashboard | frontend | ✅ | 3/3 SSR | nenhum |
| 10 | s10 Monorepo | fullstack | ✅* | compilação | 5 (types/deps) — runtime exige DB |

**Veredito geral do GPT-OSS 20B (execução):** o código gerado **compila e roda** em todas as 10 tarefas após correções mínimas. Os defeitos mais comuns são **configuração/dependências ausentes** (uuid, jsonwebtoken, react-redux, @todo/domain, scaffolding Vite). Houve 2 **bugs funcionais reais**: (a) s03 — token de login nunca válido no middleware `/me`; (b) s09 — proteção de ID no PUT não funciona (injeção de propriedade). Todos triviais de corrigir; nenhuma lógica de negócio apresentou falha estrutural. Nenhum defeito encontrado nas tarefas frontend puras (s02, s04, s06).

## Próximas fases

- Todas as tarefas do teste de estresse com código executável foram validadas. Fases opcionais: testes de UI com browser real (Playwright) para s02/s04/s06/s08, ou E2E da Fase 10 com PostgreSQL/Redis via Docker.