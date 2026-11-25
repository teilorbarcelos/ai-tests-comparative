# Ranking — Melhores Modelos para Programar Localmente

Ranking consolidado dos modelos avaliados com o [plano padronizado](plan/README.md)
(tarefas de backend + frontend em React/Node/TypeScript via LM Studio).

> **Como ler**: a **Nota geral (0–10)** mede a **qualidade** das respostas de programação.
> O **tps** e a **latência média** medem **velocidade** na mesma máquina (comparação relativa).
> Este arquivo é atualizado a cada modelo novo avaliado — o histórico fica versionado no git.

---

## Ranking atual (plano padrão)

| # | Modelo | Data | Nota geral | tps | Lat. média (s) | Destaque |
|---|---|---|---|---|---|---|
| 1 | **openai/gpt-oss-20b** | 2026-08-20 | **9.4** | 151.9 | 14.1 | Mais rápido + qualidade top |
| 2 | **google/gemma-4-e4b** | 2026-08-23 | **9.4** | 99.8 | 29.6 | Qualidade top, mais verboso |
| 3 | **thinkingmachines/inkling-2-mini** | 2026-11-25 | **9.4** | 16.2 | 194.1 | Qualidade top, porém muito lento |
| 4 | **mistralai/devstral-small-2-2512** | 2026-09-27 | **9.1** | 35.0 | 33.2 | Melhor frontend (9.5), lento |
| 5 | **qwen3.8-9b-distill** | 2026-08-26 | **9.0** | 90.5 | 24.5 | Melhor custo-benefício pequeno |
| 6 | **qwen/qwen3-14b** (reasoning on) | 2026-08-20 | **9.0** | 14.9 | 131.1 | Qualidade boa, muito lento |
| 7 | **deepseek/deepseek-r1-0528-qwen3-8b** | 2026-08-24 | **8.6** | 83.1 | 28.9 | Respostas diretas, alguns bugs |
| 8 | **qwen/qwen3.5-9b** | 2026-08-20 | **8.6** | 77.2 | 21.4 | Sólido, sem brilho |

> Os três primeiros empatam em **9.4**; a ordem segue o **tps** (critério de desempate).
> O `qwen/qwen3-14b (reasoning off)` é um experimento de velocidade (sem nota) — veja
> `results/COMPARATIVO.md`.

---

## Veredito por modelo

### 1. openai/gpt-oss-20b — 🏆 Melhor geral
- **Nota**: 9.4 (backend 9.5 · frontend 9.2) · **tps**: 152 · **Lat.**: 14s
- Código idiomático, bem tipado e explicado. Mais rápido de todos.
- **Fraqueza**: `Math.random()` como key no `frontend-04` (anti-padrão).
- **Estresse**: 9.5 em todos os níveis (capacidade máxima comprovada + validação por execução real).

### 2. google/gemma-4-e4b — 🥈 Excelente, empata em qualidade
- **Nota**: 9.4 (backend 9.4 · frontend 9.5) · **tps**: 100 · **Lat.**: 30s
- Respostas verbosas e muito bem explicadas; superou o GPT-OSS no `frontend-04` (key estável).
- **Fraqueza**: `any` no `backend-01` e sem exemplo de teste concreto no `backend-04`.

### 3. thinkingmachines/inkling-2-mini — 🥉 Qualidade de topo, mas inviável no uso interativo
- **Nota**: 9.4 (backend 9.4 · frontend 9.4) · **tps**: 16 · **Lat.**: 194s
- Empata em qualidade com GPT-OSS e Gemma: código correto, tipado e com boas práticas.
  Destaques: updates funcionais e `useRef` para IDs no `frontend-01`; refatoração com DI e
  testes Vitest no `backend-04`.
- **Fraqueza**: `UserNotFoundError` usado para todas as falhas no `backend-02`; `key`
  dependente de índice no `frontend-04`; **throughput baixíssimo (~16 tps, ~194s por tarefa)**.
- **Estresse**: não avaliado ainda.

### 4. mistralai/devstral-small-2-2512 — Melhor frontend, mas lento
- **Nota**: 9.1 (backend 8.6 · frontend 9.5) · **tps**: 35 · **Lat.**: 33s
- Frontend impecável: nota 9.5 em todas as 4 tarefas; `key={stat.label}` estável no `frontend-04`.
- Sem modo reasoning (modelo mais simples, direto ao ponto).
- **Fraqueza**: backend precisa de ajustes de tipagem para compilar em `strict` (1 import ausente
  real no `backend-04`; `@types/cors` ausente no `backend-01`) e **throughput baixo (~35 tps)**,
  apesar de rodar em GPU.

### 5. qwen3.8-9b-distill — Melhor entre os "pequenos"
- **Nota**: 9.0 (backend 8.9 · frontend 9.1) · **tps**: 91 · **Lat.**: 25s
- Boas explicações (tabelas) e testes Jest no `backend-04`. Melhor explicação de `key`.
- **Fraqueza**: 2 bugs reais no `backend-01` (`req.todo` inexistente e mismatch ObjectId/UUID
  na validação) que quebram a API ponta a ponta.

### 6. qwen/qwen3-14b (reasoning on) — Qualidade ok, inviável na prática
- **Nota**: 9.0 (backend 8.8 · frontend 9.3) · **tps**: ~15 · **Lat.**: 131s
- Roda majoritariamente em CPU → latência proibitiva para uso interativo.

### 7. deepseek/deepseek-r1-0528-qwen3-8b — Direto, com arestas
- **Nota**: 8.6 (backend 8.6 · frontend 8.5) · **tps**: 83 · **Lat.**: 29s
- Respostas corretas e diretas, reasoning pesado.
- **Fraqueza**: `key={index}` e componente que não compila no `frontend-04`; interface não
  definida no `backend-04`.

### 8. qwen/qwen3.5-9b — Sólido, sem destaque
- **Nota**: 8.6 (backend 8.5 · frontend 8.6) · **tps**: 77 · **Lat.**: 21s

---

## Ranking de estresse (capacidade máxima)

| # | Modelo | Data | Média geral | Obs. |
|---|---|---|---|---|
| 1 | **openai/gpt-oss-20b** | 2026-08-20 | **9.5** | Nota 9.5 em todos os níveis (1→5) |

> Só o GPT-OSS passou pelo teste de estresse até agora. Tarefas progressivas em
> `results-stress/COMPARATIVO.md`.

---

## Critério de desempate

1. **Nota geral** (qualidade) — critério principal.
2. **tps** (velocidade) — desempate em notas iguais.
3. **latência média** e **verbosidade** — contexto prático para uso interativo.

---

## Como adicionar um novo modelo ao ranking

1. Carregue o modelo no LM Studio e rode o teste padrão:

   ```powershell
   powershell -ExecutionPolicy Bypass -File "plan/eval-script.ps1" -ModelId "<id-do-modelo>"
   ```

   (Modelos de reasoning com `thinking` longo podem precisar de `max_tokens` maior em
   `plan/tasks.json` ou de `-Reasoning "off"`.)

2. Avalie as respostas em `results/<modelo>/raw-responses/` usando a [rubric](plan/rubric.md).
3. Preencha `results/<modelo>/report.md`.
4. Atualize `results/COMPARATIVO.md` e este `RANKING.md` (insira na posição correta e renumere).
5. Commit + push para manter o histórico versionado:

   ```powershell
   git add .
   git commit -m "Adiciona avaliacao do modelo <id> ao ranking"
   git push
   ```