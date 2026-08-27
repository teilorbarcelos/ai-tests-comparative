# Rubric de Avaliação

Cada tarefa é pontuada de **0 a 10**, avaliando a qualidade da resposta do modelo
para uma tarefa de programação (backend Node/TS ou frontend React/TS).

---

## Dimensões avaliadas

| Dimensão | Peso | O que observar |
|---|---|---|
| **Correção** | 40% | O código está funcionalmente correto? Faz o que o enunciado pede? |
| **Completude** | 20% | A resposta cobre todos os requisitos e edge cases? |
| **Qualidade de código** | 15% | TypeScript tipado, boas práticas, organização, sem bugs óbvios? |
| **Clareza** | 15% | Explicação e comentários ajudam a entender a solução? |
| **Fidelidade ao contexto** | 10% | Usa corretamente o contexto/stack pedida (React, Node, TS)? |

---

## Escala de pontuação

| Nota | Nível | Descrição |
|---|---|---|
| 9–10 | Excelente | Solução completa, correta, bem tipada e explicada. Sem erros. |
| 7–8 | Bom | Funciona bem, cobre a maioria dos requisitos, poucos ajustes. |
| 5–6 | Regular | Funciona parcialmente, faltam requisitos ou há erros corrigíveis. |
| 3–4 | Fraco | Muitos erros, solução incompleta ou não funcional. |
| 0–2 | Ruim | Não resolve, resposta irrelevante ou código quebrado. |

---

## Como pontuar

1. Leia a **tarefa** em `plan/tasks.json` e os **checkpoints** dela.
2. Leia a **resposta crua** em `results/<modelo>/raw-responses/<id>.md`.
3. Atribua nota por dimensão (0–10) e calcule a nota ponderada:
   ```
   nota = 0.40*Correção + 0.20*Completude + 0.15*Qualidade + 0.15*Clareza + 0.10*Fidelidade
   ```
4. Registre a nota e observações no `report.md`.

---

## Métricas técnicas (medidas pelo script, não subjetivas)

| Métrica | Definição |
|---|---|
| `latency_s` | Tempo da chamada à API (resposta completa). |
| `prompt_tokens` | Tokens de entrada (prompt + contexto). |
| `completion_tokens` | Tokens de saída. |
| `total_tokens` | Soma dos anteriores. |
| `tps` | Tokens por segundo = `completion_tokens / latency_s`. |

> A latência/`tps` serve para comparar **velocidade** entre modelos na **mesma máquina**.
> A nota (0–10) serve para comparar **qualidade** das respostas.
