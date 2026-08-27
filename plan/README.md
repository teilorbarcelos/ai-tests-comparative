# Plano de Avaliação de Modelos de IA Locais

Plano **padronizado e reutilizável** para avaliar o desempenho de modelos de LLM
locais (LM Studio) em tarefas de programação **backend e frontend** com
**React / Node / TypeScript**.

O objetivo é que o mesmo conjunto de tarefas e critérios seja aplicado a todos os
modelos, de forma **justa e comparável**, trocando apenas o modelo carregado na API.

---

## Como funciona

1. A API do LM Studio roda em `http://localhost:1234/v1` (OpenAI-compatible).
2. Um script (`eval-script.ps1`) envia uma série de prompts (tarefas) para a API,
   mede **latência**, **tokens de entrada/saída** e salva a **resposta crua** de cada tarefa.
3. As respostas são avaliadas manualmente (ou por heurística) conforme a
   [rubric](rubric.md) e consolidadas em um `report.md`.
4. Cada modelo tem sua própria pasta em `../results/<modelo>/`, permitindo comparar
   relatórios entre modelos.

---

## Estrutura do workspace

```
ia-tests/
├── plan/                      # Plano padronizado (compartilhado entre modelos)
│   ├── README.md              # Este arquivo
│   ├── rubric.md              # Critérios de pontuação
│   ├── eval-script.ps1        # Script de avaliação (envia prompts, mede métricas)
│   ├── backend-tasks/         # Tarefas de backend (Node + TypeScript)
│   └── frontend-tasks/        # Tarefas de frontend (React + TypeScript)
└── results/
    └── <nome-do-modelo>/      # Uma pasta por modelo avaliado
        ├── report.md          # Resultado consolidado
        └── raw-responses/     # Respostas cruas de cada tarefa (.json / .md)
```

---

## Como executar a avaliação

### Pré-requisitos
- LM Studio rodando com o modelo desejado carregado em `http://localhost:1234/v1`.
- PowerShell 5.1+ (Windows).

### Passos
1. **Carregue o modelo** no LM Studio (server) e confirme que a API responde:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:1234/v1/models"
   ```
   Anote o `id` exato do modelo (ex.: `openai/gpt-oss-20b`).

2. **Execute o script de avaliação** passando o id do modelo:
   ```powershell
   powershell -ExecutionPolicy Bypass -File "plan/eval-script.ps1" -ModelId "openai/gpt-oss-20b"
   ```
   O script:
   - Cria a pasta `results/<modelo>/` se não existir.
   - Executa todas as tarefas (backend + frontend) definidas em `plan/tasks.json`.
   - Salva as respostas cruas em `results/<modelo>/raw-responses/`.
   - Gera `results/<modelo>/metrics.json` com latência e tokens por tarefa.

   **Opções extras:**
   - `-Reasoning "off"`: desativa o raciocínio em modelos de reasoning (ex.: Qwen3).
     Usa o endpoint REST `/api/v1/chat` em vez do OpenAI-compatible.
   - `-LoadModel`: tenta carregar o modelo via API (`POST /api/v1/models/load`) antes de avaliar.
   - Exemplo combinado:
     ```powershell
     powershell -ExecutionPolicy Bypass -File "plan/eval-script.ps1" -ModelId "qwen/qwen3-14b" -Reasoning "off" -LoadModel
     ```

3. **Avalie e gere o relatório**:
   - Revise cada resposta crua aplicando a [rubric](rubric.md).
   - Preencha as notas no `report.md` (pode usar o template na seção abaixo).

4. **Para trocar de modelo**: carregue o novo modelo no LM Studio, repita o passo 2
   com o novo `-ModelId`. Nada no plano muda — a comparação permanece justa.

---

## Configuração das tarefas

As tarefas são definidas em `plan/tasks.json`:
- `id`: identificador único da tarefa.
- `category`: `backend` ou `frontend`.
- `title`: título curto.
- `task`: enunciado do prompt enviado ao modelo.
- `checkpoints`: pontos específicos a verificar na resposta (usados na rubric).
- `context`: arquivos/contexto fornecidos junto com o prompt (opcional).

Você pode adicionar/editar tarefas no `tasks.json` sem alterar o script. Para
fornecer **contexto** (ex.: um trecho de código), crie arquivos em
`plan/backend-tasks/` ou `plan/frontend-tasks/` e referencie o caminho relativo
no campo `context` da tarefa.

---

## Template de `report.md` (por modelo)

```markdown
# Avaliação — <Modelo>

- **Modelo**: openai/gpt-oss-20b
- **API**: http://localhost:1234/v1
- **Data**: YYYY-MM-DD
- **Config**: LM Studio (padrão)

## Resumo

| Métrica | Valor |
|---|---|
| Tempo total | — |
| Tokens de entrada (total) | — |
| Tokens de saída (total) | — |
| Nota média backend | —/10 |
| Nota média frontend | —/10 |
| Nota geral | —/10 |

## Tarefas de Backend

### [id] Título
- **Nota**: x/10
- **Checkpoints**: ...
- **Observações**: ...

## Tarefas de Frontend

### [id] Título
- **Nota**: x/10
- **Checkpoints**: ...
- **Observações**: ...

## Considerações finais
- ...
```

---

## Como adicionar um novo modelo à comparação

1. Troque o modelo no LM Studio.
2. Execute o script com o novo `-ModelId`.
3. Preencha o `report.md` do novo modelo.
4. Compare os `report.md` da pasta `results/`.

---

## Limitações / cuidados para comparação justa
- **Temperatura/parâmetros**: o script envia parâmetros fixos (temperatura, etc.)
  para todos os modelos, quando suportados. Mantenha-os iguais.
- **Determinismo**: modelos podem variar entre execuções; se necessário, rode 2x e
  use a média de latência.
- **Contexto**: o mesmo contexto é enviado a todos os modelos.
- **Hardware**: a latência depende da máquina. Use latência para **comparação relativa**
  na mesma máquina, não como valor absoluto universal.
