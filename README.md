# AI Tests Comparative

Benchmark padronizado para avaliar **modelos de LLM locais** (via [LM Studio](https://lmstudio.ai))
em tarefas de programação **backend** (Node.js + TypeScript) e **frontend** (React + TypeScript).

O mesmo conjunto de tarefas e critérios é aplicado a todos os modelos, trocando apenas o modelo
carregado na API — permitindo comparar **qualidade** e **desempenho** de forma justa na mesma máquina.

---

## Tabela de Conteúdo

- [Visão geral](#visão-geral)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Pré-requisitos](#pré-requisitos)
- [Passo a passo: executar a avaliação](#passo-a-passo-executar-a-avaliação)
  - [1. Carregar o modelo no LM Studio](#1-carregar-o-modelo-no-lm-studio)
  - [2. Teste padrão (front + backend)](#2-teste-padrão-front--backend)
  - [3. Teste de estresse (opcional)](#3-teste-de-estresse-opcional)
- [Como gerar o relatório de desempenho](#como-gerar-o-relatório-de-desempenho)
- [Ranking dos melhores modelos](#ranking-dos-melhores-modelos)
- [Como comparar modelos](#como-comparar-modelos)
- [Resultados atuais](#resultados-atuais)
- [Validação por execução real](#validação-por-execução-real)
- [Cuidados para comparação justa](#cuidados-para-comparação-justa)

---

## Visão geral

- **API**: `http://localhost:1234/v1` (endpoint OpenAI-compatible do LM Studio).
- **Plano padrão**: 8 tarefas (4 backend + 4 frontend) — uso comum de programação.
- **Plano de estresse**: 10 tarefas de complexidade progressiva (nível 1 a 5) — capacidade máxima.
- **Saídas por modelo**: respostas cruas, `metrics.json` (latência, tokens, tps) e `report.md` (notas 0–10).
- **Comparação**: tabela consolidada em `results/COMPARATIVO.md` (padrão) e `results-stress/COMPARATIVO.md` (estresse).

---

## Estrutura do repositório

```
ia-tests/
├── plan/                     # Plano padronizado (compartilhado entre modelos)
│   ├── README.md             # Documentação do plano padrão
│   ├── rubric.md             # Critérios de pontuação (0–10)
│   ├── eval-script.ps1       # Script de avaliação (envia prompts, mede métricas)
│   └── tasks.json            # 8 tarefas: backend + frontend
├── plan-stress/              # Plano de estresse (complexidade progressiva)
│   ├── README.md
│   └── tasks.json            # 10 tarefas: nível 1 (básico) → 5 (extremo)
├── results/                  # Resultados do plano padrão
│   ├── COMPARATIVO.md        # Tabela consolidada
│   └── <modelo>/
│       ├── report.md         # Resultado avaliado (notas 0–10)
│       ├── metrics.json      # Latência, tokens, tps por tarefa
│       └── raw-responses/    # Resposta crua de cada tarefa (.md)
├── results-stress/           # Resultados do plano de estresse
│   ├── COMPARATIVO.md
│   └── <modelo>/...
└── execution-validation/     # Código gerado por modelos, compilado/testado de verdade
```

---

## Pré-requisitos

- **LM Studio** rodando com o modelo desejado carregado no servidor (`http://localhost:1234/v1`).
- **PowerShell 5.1+** (Windows).

Confirme que a API responde:

```powershell
Invoke-RestMethod -Uri "http://localhost:1234/v1/models"
```

Anote o **`id` exato** do modelo (ex.: `openai/gpt-oss-20b`, `google/gemma-4-e4b`).

---

## Passo a passo: executar a avaliação

### 1. Carregar o modelo no LM Studio

Carregue o modelo na aba *Developer → Server* (ou use `-LoadModel` no script, que carrega via API).

### 2. Teste padrão (front + backend)

Execute o script apontando o id do modelo:

```powershell
powershell -ExecutionPolicy Bypass -File "plan/eval-script.ps1" -ModelId "<id-do-modelo>"
```

O script:
- Cria `results/<modelo>/` (sanitizado: `/` e `:` viram `_`).
- Executa as 8 tarefas de `plan/tasks.json`.
- Salva as respostas cruas em `results/<modelo>/raw-responses/`.
- Gera `results/<modelo>/metrics.json` (latência, tokens, tps, finish_reason por tarefa).

**Opções extras:**

| Opção | Descrição |
|---|---|
| `-Reasoning "off"` | Desliga o reasoning (modelos de reasoning, ex.: Qwen3). Usa o endpoint REST `/api/v1/chat`. |
| `-LoadModel` | Carrega o modelo via API antes de avaliar. |
| `-UnloadFirst` | Descarrega todos os modelos antes (estado limpo). |
| `-ContextLength N` | Contexto ao carregar (padrão 8192). Menor contexto = menos KV cache = mais folga de VRAM. |
| `-PlanDir "plan-stress"` | Usa outro plano. |
| `-ResultsRoot "results-stress"` | Salva em outra pasta. |

Exemplo combinado (modelo de reasoning, off, com sampling ajustado):

```powershell
powershell -ExecutionPolicy Bypass -File "plan/eval-script.ps1" `
  -ModelId "qwen3.8-27b" -Reasoning "off" -UnloadFirst -LoadModel `
  -ContextLength 8192 -TopK 20 -PresencePenalty 1.5 -RepeatPenalty 1.0
```

### 3. Teste de estresse (opcional)

Mesmo script, apontando o plano e a pasta de estresse:

```powershell
powershell -ExecutionPolicy Bypass -File "plan/eval-script.ps1" `
  -ModelId "<id-do-modelo>" -PlanDir "plan-stress" -ResultsRoot "results-stress"
```

---

## Como gerar o relatório de desempenho

1. **Revise cada resposta crua** em `results/<modelo>/raw-responses/` aplicando a
   [rubric](plan/rubric.md) (dimensões: correção 40%, completude 20%, qualidade 15%,
   clareza 15%, fidelidade 10%).
2. **Preencha `results/<modelo>/report.md`** com as notas por tarefa, observações e o resumo
   (latência média, tps, tokens totais, notas por categoria).
3. **Adicione a linha no comparativo** `results/COMPARATIVO.md` (e/ou `results-stress/COMPARATIVO.md`).

Template pronto em [`plan/README.md`](plan/README.md) (seção "Template de report.md").

---

## Ranking dos melhores modelos

Consulte o [**RANKING.md**](RANKING.md) para ver o ranking atualizado dos modelos por nota
geral (qualidade) e velocidade, com o veredito de cada um. Ele é atualizado a cada modelo novo
avaliado — o histórico fica versionado no git.

---

## Como comparar modelos

| Métrica | Definição | O que indica |
|---|---|---|
| **Nota (0–10)** | Qualidade das respostas (rubric) | Capacidade de programação |
| **tps** | Tokens/s = `completion_tokens / latency_s` | Velocidade de geração (relativa, mesma máquina) |
| **Latência média** | Tempo médio por tarefa | Responsividade |
| **Tokens out** | Total de tokens gerados | Verborragia/cobertura |

> As tabelas completas estão em `results/COMPARATIVO.md` e `results-stress/COMPARATIVO.md`.

---

## Resultados atuais

### Plano padrão (`results/COMPARATIVO.md`)

| Modelo | Data | Modo | Lat. média (s) | tps médio | Tokens out (total) | Nota backend | Nota frontend | Nota geral |
|---|---|---|---|---|---|---|---|---|
| openai/gpt-oss-20b | 2026-08-20 | default | 14.10 | 151.9 | 9804 | 9.5 | 9.2 | 9.4 |
| google/gemma-4-e4b | 2026-08-23 | default (reasoning on) | 29.55 | 99.8 | 23539 | 9.4 | 9.5 | 9.4 |
| mistralai/devstral-small-2-2512 | 2026-09-27 | default (sem reasoning) | 33.24 | 35.0 | 9234 | 8.6 | 9.5 | 9.1 |
| qwen3.8-9b-distill | 2026-08-26 | default (reasoning on) | 24.53 | 90.5 | 17903 | 8.9 | 9.1 | 9.0 |
| deepseek/deepseek-r1-0528-qwen3-8b | 2026-08-24 | default (reasoning on) | 28.88 | 83.1 | 19074 | 8.6 | 8.5 | 8.6 |
| qwen/qwen3.5-9b | 2026-08-20 | default | 21.41 | 77.2 | 13056 | 8.5 | 8.6 | 8.6 |
| qwen/qwen3-14b | 2026-08-20 | reasoning on | 131.12 | 14.9 | 15376 | 8.8 | 9.3 | 9.0 |
| qwen/qwen3-14b | 2026-08-20 | reasoning off | 74.08 | 15.4 | 8969 | — | — | — |

### Plano de estresse (`results-stress/COMPARATIVO.md`)

| Modelo | Data | N1 Básico | N2 Interm. | N3 Avanç. | N4 Desaf. | N5 Extremo | Média geral |
|---|---|---|---|---|---|---|---|
| openai/gpt-oss-20b | 2026-08-20 | 9.5 | 9.5 | 9.5 | 9.5 | 9.5 | **9.5** |

---

## Validação por execução real

Além da avaliação qualitativa, o código gerado pelo **GPT-OSS 20B** no teste de estresse foi
**compilado, rodado e testado de verdade** em `execution-validation/` (10 fases: LRU Cache, API
e-commerce, carrinho full-stack, hooks, SPA auth, dashboard, monorepo, etc.). Resumo:

- **100% das tarefas compilam e rodam** após correções mínimas.
- Defeitos mais comuns: **dependências/config ausentes** (`uuid`, `jsonwebtoken`, `react-redux`,
  scaffolding Vite) — nenhum na lógica de negócio.
- 2 **bugs funcionais reais** (token de login no s03; proteção de ID no PUT do s09) — triviais.
- Nenhum defeito nas tarefas de frontend puro (s02, s04, s06).

Detalhes em [`execution-validation/README.md`](execution-validation/README.md).

### Devstral Small 2 (plano padrão)

O código gerado pelo **mistralai/devstral-small-2-2512** no plano padrão também foi validado por
execução real em `execution-validation-devstral/` (4 fases: API todos, `fetchUserData`, refatoração
com DI, componentes React). Resumo:

- **Compila e roda em todas as fases** após correções mínimas.
- Defeitos mais comuns: **tipagem strict mode** (6 correções de 1 token/cast) — 1 import ausente
  real (`UserBuilder` no backend-04) e 1 dependência de tipos ausente (`@types/cors` no backend-01).
- **Nenhuma lógica de negócio com falha estrutural**; frontend puro (4 componentes) sem bugs,
  todos renderizando corretamente (9/9 asserções SSR).

Detalhes em [`execution-validation-devstral/README.md`](execution-validation-devstral/README.md).

---

## Cuidados para comparação justa

- **Parâmetros fixos**: `temperature=0.2`, `max_tokens=8000` (mesmo `tasks.json` para todos).
- **Determinismo**: modelos variam entre execuções; rode 2x e use a média de latência se necessário.
- **Contexto**: o mesmo enunciado é enviado a todos os modelos.
- **Hardware**: latência/tps dependem da máquina — use como **comparação relativa** na mesma máquina.
- **Reasoning**: em modelos de reasoning (Qwen3, DeepSeek R1), o `thinking` consome parte do
  orçamento de tokens. Se estourar `max_tokens`, a resposta final pode vir vazia/truncada —
  aumente o budget ou desligue o reasoning (`-Reasoning "off"`).