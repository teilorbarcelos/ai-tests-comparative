<#
.SYNOPSIS
    Script de avaliacao padronizado para modelos locais (LM Studio / OpenAI-compatible API).
.DESCRIPTION
    Envia as tarefas de plan/tasks.json para http://localhost:1234/v1/chat/completions,
    mede latencia e tokens, salva respostas cruas e metricas em results/<modelo>/.
.PARAMETER ModelId
    Id exato do modelo carregado no LM Studio (ex.: openai/gpt-oss-20b).
.PARAMETER ApiBase
    URL base da API (padrao: http://localhost:1234/v1).
.PARAMETER PlanDir
    Diretorio do plano (padrao: plan).
.PARAMETER Reasoning
    Controle de raciocinio para modelos de reasoning (ex.: "off"). Quando definido,
    usa o endpoint REST /api/v1/chat em vez do OpenAI-compatible. Valor padrao: vazio (nao usa).
.PARAMETER LoadModel
    Se true, tenta carregar o modelo via POST /api/v1/models/load antes de avaliar.
.PARAMETER UnloadFirst
    Se true, descarrega TODOS os modelos carregados antes de iniciar (estado limpo),
    evitando multiplas instancias/memorias duplicadas. Recomendado para consistencia.
.PARAMETER ContextLength
    Contexto (em tokens) usado ao carregar o modelo via -LoadModel. Padrao: 8192.
    Menor contexto = menos memoria de KV cache = mais folga de VRAM.
.PARAMETER TopK
    Valor de top_k para amostragem (apenas no modo REST/reasoning). Se vazio, usa padrao do modelo.
.PARAMETER PresencePenalty
    Valor de presence_penalty para amostragem (apenas no modo REST/reasoning). Se vazio, usa padrao do modelo.
.PARAMETER RepeatPenalty
    Valor de repeat_penalty para amostragem (apenas no modo REST/reasoning). Se vazio, usa padrao do modelo.
.PARAMETER ResultsRoot
    Pasta raiz onde salvar os resultados. Padrao: "results". Use outro valor (ex.: "results-stress")
    para separar testes especificos (ex.: estresse) do comparativo padrao.
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File "plan/eval-script.ps1" -ModelId "openai/gpt-oss-20b"
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File "plan/eval-script.ps1" -ModelId "qwen/qwen3-14b" -Reasoning "off"
.EXAMPLE
    powershell -ExecutionPolicy Bypass -File "plan/eval-script.ps1" -ModelId "qwen3.8-27b" -Reasoning "off" -UnloadFirst -LoadModel -ContextLength 8192 -TopK 20 -PresencePenalty 1.5 -RepeatPenalty 1.0
#>
param(
    [Parameter(Mandatory = $true)][string]$ModelId,
    [string]$ApiBase = "http://localhost:1234/v1",
    [string]$PlanDir = "plan",
    [string]$Reasoning = "",
    [switch]$LoadModel,
    [switch]$UnloadFirst,
    [int]$ContextLength = 8192,
    [double]$TopK = 0,
    [double]$PresencePenalty = 0,
    [double]$RepeatPenalty = 0,
    [string]$ResultsRoot = "results"
)

$ErrorActionPreference = "Stop"

# ---- Resolve caminhos ----
$root = (Resolve-Path ".").Path
$planFull = if ([System.IO.Path]::IsPathRooted($PlanDir)) { $PlanDir } else { Join-Path $root $PlanDir }
$tasksFile = Join-Path $planFull "tasks.json"

if (-not (Test-Path -LiteralPath $tasksFile)) {
    Write-Error "Arquivo de tarefas nao encontrado: $tasksFile"
}

# ---- Sanitiza nome do modelo para pasta ----
$safeModel = ($ModelId -replace '[/:]', '_')
$resultDir = Join-Path $root "$ResultsRoot\$safeModel"
$rawDir = Join-Path $resultDir "raw-responses"
New-Item -ItemType Directory -Path $rawDir -Force | Out-Null

Write-Host "== Avaliacao do modelo: $ModelId ==" -ForegroundColor Cyan
Write-Host "Resultados em: $resultDir"

# ---- Le tarefas ----
$cfg = Get-Content -LiteralPath $tasksFile -Raw | ConvertFrom-Json
$params = $cfg.params

# ---- Descarrega todos os modelos (opcional, estado limpo) ----
if ($UnloadFirst) {
    $restBase = $ApiBase -replace '/v1$', ''
    try {
        $list = Invoke-RestMethod -Uri "$restBase/api/v1/models" -Method Get -TimeoutSec 60
        $loaded = @($list.models | Where-Object { $_.loaded_instances.Count -gt 0 })
        if ($loaded.Count -gt 0) {
            foreach ($lm in $loaded) {
                foreach ($inst in $lm.loaded_instances) {
                    $unloadBody = @{ instance_id = $inst.id } | ConvertTo-Json -Depth 3
                    try {
                        Invoke-RestMethod -Uri "$restBase/api/v1/models/unload" -Method Post -ContentType "application/json" -Body $unloadBody -TimeoutSec 120 | Out-Null
                        Write-Host "Descarregado: $($inst.id)" -ForegroundColor Yellow
                    } catch {
                        Write-Warning "Falha ao descarregar $($inst.id): $($_.Exception.Message)"
                    }
                }
            }
            Start-Sleep -Seconds 2
        } else {
            Write-Host "Nenhum modelo carregado para descarregar." -ForegroundColor Green
        }
    } catch {
        Write-Warning "Nao foi possivel listar modelos para unload: $($_.Exception.Message)"
    }
}

# ---- Carrega modelo (opcional) via REST ----
if ($LoadModel) {
    $restBase = $ApiBase -replace '/v1$', ''
    $loadBody = @{ model = $ModelId; context_length = $ContextLength; flash_attention = $true; echo_load_config = $true } | ConvertTo-Json -Depth 5
    try {
        $lr = Invoke-RestMethod -Uri "$restBase/api/v1/models/load" -Method Post -ContentType "application/json" -Body $loadBody -TimeoutSec 300
        Write-Host "Modelo carregado: $($lr.status) em $($lr.load_time_seconds)s" -ForegroundColor Green
    } catch {
        Write-Warning "Falha ao carregar modelo via API: $($_.Exception.Message). Continuando (talvez ja esteja carregado)."
    }
}

# ---- Define endpoint e formato de resposta ----
# Se Reasoning foi informado, usa o endpoint REST /api/v1/chat (suporta reasoning off).
$useRest = -not [string]::IsNullOrWhiteSpace($Reasoning)
if ($useRest) {
    $restBase = $ApiBase -replace '/v1$', ''
    $api = "$restBase/api/v1/chat"
} else {
    $api = "$ApiBase/chat/completions"
}

# ---- Helper: contexto opcional ----
function Get-ContextText {
    param([string]$Category, [string]$ContextPath)
    if ([string]::IsNullOrWhiteSpace($ContextPath)) { return "" }
    $sub = if ($Category -eq "frontend") { "frontend-tasks" } else { "backend-tasks" }
    $path = Join-Path $planFull "$sub\$ContextPath"
    if (-not (Test-Path -LiteralPath $path)) {
        Write-Warning "Contexto nao encontrado: $path (ignorado)"
        return ""
    }
    return (Get-Content -LiteralPath $path -Raw)
}

$metrics = @()

foreach ($task in $cfg.tasks) {
    $id = $task.id
    Write-Host ""
    Write-Host ">> [$id] $($task.title) ($($task.category))" -ForegroundColor Yellow

    # Monta a mensagem do usuario (task + contexto opcional)
    $contextText = Get-ContextText -Category $task.category -ContextPath $task.context
    $userContent = $task.task
    if ($contextText -ne "") {
        $userContent = $task.task + "`n`n=== CONTEXTO ===`n" + $contextText
    }

    if ($useRest) {
        $body = @{
            model          = $ModelId
            input          = $userContent
            system_prompt  = "Voce e um assistente especialista em desenvolvimento de software com Node.js, React e TypeScript. Responda com codigo completo, tipado e explicacoes claras em portugues."
            reasoning      = $Reasoning
            max_output_tokens = $params.max_tokens
            temperature    = $params.temperature
            stream         = $false
        }
        if ($TopK -gt 0)          { $body.top_k = $TopK }
        if ($PresencePenalty -gt 0) { $body.presence_penalty = $PresencePenalty }
        if ($RepeatPenalty -gt 0)  { $body.repeat_penalty = $RepeatPenalty }
        $body = $body | ConvertTo-Json -Depth 6
    } else {
        $body = @{
            model    = $ModelId
            messages = @(
                @{ role = "system"; content = "Voce e um assistente especialista em desenvolvimento de software com Node.js, React e TypeScript. Responda com codigo completo, tipado e explicacoes claras em portugues." },
                @{ role = "user"; content = $userContent }
            )
            temperature = $params.temperature
            max_tokens  = $params.max_tokens
            stream      = $false
        } | ConvertTo-Json -Depth 6
    }

    try {
        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        $resp = Invoke-RestMethod -Uri $api -Method Post -ContentType "application/json" -Body $body -TimeoutSec 1800
        $sw.Stop()
        $latency = $sw.Elapsed.TotalSeconds

        if ($useRest) {
            $stats = $resp.stats
            $msgItem = $resp.output | Where-Object { $_.type -eq "message" } | Select-Object -First 1
            $content = $msgItem.content
            $usage = [pscustomobject]@{
                prompt_tokens     = $stats.input_tokens
                completion_tokens = $stats.total_output_tokens
                total_tokens      = ($stats.input_tokens + $stats.total_output_tokens)
                reasoning_tokens  = $stats.reasoning_output_tokens
            }
            $finish = "stop"
        } else {
            $content = $resp.choices[0].message.content
            $usage = $resp.usage
            $finish = $resp.choices[0].finish_reason
        }

        $m = [ordered]@{
            id                = $id
            category          = $task.category
            title             = $task.title
            model             = $ModelId
            latency_s         = [math]::Round($latency, 3)
            prompt_tokens     = $usage.prompt_tokens
            completion_tokens = $usage.completion_tokens
            total_tokens      = $usage.total_tokens
            tps               = if ($latency -gt 0) { [math]::Round($usage.completion_tokens / $latency, 2) } else { 0 }
            finish_reason     = $finish
            raw_file          = "$id.md"
        }
        $metrics += [pscustomobject]$m

        # Salva resposta crua
        $rawContent = "# Tarefa: $($task.title)`n`n**ID**: $id  **Categoria**: $($task.category)`n**Latencia**: $([math]::Round($latency,2))s  **Tokens out**: $($usage.completion_tokens)  **tps**: $([math]::Round($usage.completion_tokens/$latency,2))`n`n---`n`n" + $content
        $rawFile = Join-Path $rawDir "$id.md"
        Set-Content -LiteralPath $rawFile -Value $rawContent -Encoding UTF8

        Write-Host "    OK - latencia $([math]::Round($latency,2))s, tokens out $($usage.completion_tokens), tps $([math]::Round($usage.completion_tokens/$latency,2))"
    } catch {
        Write-Warning "Falha na tarefa $id : $($_.Exception.Message)"
        $metrics += [pscustomobject][ordered]@{
            id = $id; category = $task.category; title = $task.title; model = $ModelId
            latency_s = $null; prompt_tokens = $null; completion_tokens = $null
            total_tokens = $null; tps = $null; finish_reason = "error"; raw_file = $null
        }
    }
}

# ---- Salva metricas ----
$metricsObj = [pscustomobject]@{
    meta = [ordered]@{
        model   = $ModelId
        api     = $ApiBase
        date    = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
        params  = $params
        reasoning = $(if ($useRest) { $Reasoning } else { "default" })
        endpoint = $(if ($useRest) { "REST /api/v1/chat" } else { "OpenAI-compat /v1/chat/completions" })
        total_tasks = $cfg.tasks.Count
        tasks_per_category = ($cfg.tasks | Group-Object category | ForEach-Object { "$($_.Name)=$($_.Count)" }) -join ", "
    }
    metrics = $metrics
}
$metricsFile = Join-Path $resultDir "metrics.json"
$metricsObj | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $metricsFile -Encoding UTF8

Write-Host ""
Write-Host "== Concluido ==" -ForegroundColor Green
Write-Host "Metricas: $metricsFile"
Write-Host "Respostas cruas: $rawDir"
Write-Host ""
Write-Host "Proximo passo: avalie cada resposta usando plan/rubric.md e preencha $resultDir\report.md"
