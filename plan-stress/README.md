# Plano de Estresse — Avaliação de Capacidade Máxima

Plano **separado** do [plano padrão](../plan/README.md), com o objetivo de **estressar** um
modelo com tarefas de **complexidade progressiva** (nível 1 a 5) em backend e frontend
com **React / Node / TypeScript**. Serve para medir o teto de capacidade de um modelo
(além do teste padrão de "programação comum").

---

## Diferença vs. plano padrão

| | Plano padrão (`plan/`) | Plano de estresse (`plan-stress/`) |
|---|---|---|
| Objetivo | Comparar modelos de forma justa | Explorar capacidade máxima |
| Tarefas | 8 tarefas médias, fixas | 10 tarefas progressivas (nível 1→5) |
| Complexidade | Uniforme | Crescente (básico → extremo) |
| Resultados | `results/` | `results-stress/` |
| Uso | Todo modelo avaliado | Modelos considerados fortes |

---

## Níveis de complexidade

| Nível | Nome | Tarefas | Foco |
|---|---|---|---|
| 1 | Básico | s01, s02 | Tipos/generics avançados, hooks customizados |
| 2 | Intermediário | s03, s04 | DI + padrões, roteamento + estado global |
| 3 | Avançado | s05, s06 | API completa + testes, dashboard + fetching |
| 4 | Desafiador | s07, s08 | LRU Cache O(1), feature full-stack integrada |
| 5 | Extremo | s09, s10 | Debug de código com bugs, arquitetura full-stack completa |

Cada nível adiciona requisitos: arquitetura, testes, segurança, performance, design de sistema.

---

## Como executar

Requisito: modelo carregado no servidor (`http://localhost:1234/v1`).

```powershell
# Apenas o GPT-OSS (modelo forte) no plano de estresse:
powershell -ExecutionPolicy Bypass -File "plan/eval-script.ps1" `
  -ModelId "openai/gpt-oss-20b" `
  -PlanDir "plan-stress" `
  -ResultsRoot "results-stress"
```

O mesmo script do plano padrão é reutilizado; apenas apontamos `-PlanDir` e `-ResultsRoot`
para as pastas de estresse. O resultado fica em `results-stress/<modelo>/`.

---

## Estrutura

```
plan-stress/
├── README.md        # Este arquivo
└── tasks.json       # Tarefas progressivas (nível 1 a 5)
results-stress/
├── COMPARATIVO.md   # Tabela de estresse entre modelos (quando houver mais de um)
└── <modelo>/
    ├── report.md
    ├── metrics.json
    └── raw-responses/
```

---

## Como avaliar os resultados

Use a [rubric](../plan/rubric.md) para notas (0–10), mas observe o **nível**: atingir
nota alta em níveis 4–5 (arquitetura, debug, full-stack) indica maior capacidade real.
Um modelo pode ter nota alta no plano padrão mas cair nos níveis altos de estresse.
