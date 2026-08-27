# Comparativo de Estresse (Capacidade Máxima)

Tabela dos modelos avaliados no [plano de estresse](../plan-stress/README.md) —
tarefas de **complexidade progressiva** (nível 1 a 5). Atualize a cada modelo avaliado
em `results-stress/<modelo>/report.md`.

> Estes resultados refletem o **teto de capacidade** do modelo (arquitetura, debug,
> full-stack), separados do [comparativo padrão](COMPARATIVO.md).

| Modelo | Data | N1 Básico | N2 Interm. | N3 Avanç. | N4 Desaf. | N5 Extremo | Média geral |
|---|---|---|---|---|---|---|---|
| openai/gpt-oss-20b | 2026-08-20 | 9.5 | 9.5 | 9.5 | 9.5 | 9.5 | **9.5** |

---

## Como adicionar um modelo

```powershell
powershell -ExecutionPolicy Bypass -File "plan/eval-script.ps1" `
  -ModelId "<id>" -PlanDir "plan-stress" -ResultsRoot "results-stress"
```

Avalie cada tarefa com a [rubric](../plan/rubric.md) e preencha o `report.md` do modelo.
