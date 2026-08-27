# Comparativo de Modelos Locais

Tabela consolidada dos modelos avaliados com o [plano padronizado](../plan/README.md).
Atualize esta tabela a cada modelo avaliado. Cada modelo tem seu relatório detalhado em `results/<modelo>/report.md`.

> **Importante para comparação justa**: todos usam o mesmo `plan/tasks.json`, os mesmos
> parâmetros (`temperature=0.2`, `max_tokens=8000`) e rodam na mesma máquina via LM Studio.

| Modelo | Data | Modo | Lat. média (s) | tps médio | Tokens out (total) | Nota backend | Nota frontend | Nota geral |
|---|---|---|---|---|---|---|---|---|
| openai/gpt-oss-20b | 2026-08-20 | default | 14.10 | 151.9 | 9804 | 9.5 | 9.2 | 9.4 |
| google/gemma-4-e4b | 2026-08-23 | default (reasoning on) | 29.55 | 99.8 | 23539 | 9.4 | 9.5 | 9.4 |
| qwen3.8-9b-distill | 2026-08-26 | default (reasoning on) | 24.53 | 90.5 | 17903 | 8.9 | 9.1 | 9.0 |
| deepseek/deepseek-r1-0528-qwen3-8b | 2026-08-24 | default (reasoning on) | 28.88 | 83.1 | 19074 | 8.6 | 8.5 | 8.6 |
| qwen/qwen3.5-9b | 2026-08-20 | default | 21.41 | 77.2 | 13056 | 8.5 | 8.6 | 8.6 |
| qwen/qwen3-14b | 2026-08-20 | reasoning on | 131.12 | 14.9 | 15376 | 8.8 | 9.3 | 9.0 |
| qwen/qwen3-14b | 2026-08-20 | reasoning off | 74.08 | 15.4 | 8969 | — | — | — |

> A linha `qwen/qwen3-14b (reasoning off)` é um experimento de velocidade (dados em `qwen_qwen3-14b_reasoning_off/`).
> Observação: desligar o reasoning acelera um pouco a geração, mas o ganho é limitado porque o modelo roda
> majoritariamente em **CPU** — o tps (~15) não sobe muito. Para o 27B ser viável, é essencial garantir o
> **offload para a GPU (RTX 5070 Ti)** no LM Studio.

---

## Como adicionar um novo modelo

1. Baixe/garanta o modelo no LM Studio.
2. Carregue o modelo (ou use `-LoadModel` para carregar via API).
3. Execute:
   ```powershell
   # Padrão (OpenAI-compat):
   powershell -ExecutionPolicy Bypass -File "plan/eval-script.ps1" -ModelId "<id-do-modelo>"

   # Modelo de reasoning (ex.: Qwen3) com reasoning desligado (mais rápido, usa REST /api/v1/chat):
   powershell -ExecutionPolicy Bypass -File "plan/eval-script.ps1" -ModelId "<id>" -Reasoning "off" -LoadModel
   ```
4. Avalie as respostas em `results/<modelo>/raw-responses/` usando a [rubric](../plan/rubric.md).
5. Preencha `results/<modelo>/report.md`.
6. Adicione uma linha na tabela acima com os valores de resumo.

---

## Leitura rápida

- **Nota (0–10)**: qualidade das respostas de programação (backend/frontend).
- **tps (tokens/s)**: velocidade de geração na mesma máquina — comparação relativa.
- **Latência média**: tempo médio de resposta por tarefa.

Veja o detalhamento do critério em [plan/rubric.md](../plan/rubric.md) e as tarefas em [plan/tasks.json](../plan/tasks.json).
