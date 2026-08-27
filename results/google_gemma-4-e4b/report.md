# Avaliação — Google Gemma 4 E4B

- **Modelo**: `google/gemma-4-e4b`
- **API**: `http://localhost:1234/v1` (LM Studio)
- **Data**: 2026-08-23
- **Parâmetros**: `temperature=0.2`, `max_tokens=8000` (padrão do plano)
- **Tarefas**: 8 (4 backend + 4 frontend)
- **Plano aplicado**: `plan/` (padronizado, justo entre modelos)
- **Modo**: reasoning padrão do modelo (on), endpoint OpenAI-compat

---

## Resumo

| Métrica | Valor |
|---|---|
| Tempo total das chamadas | 236.42 s (~4 min) |
| Tokens de entrada (total) | 1154 |
| Tokens de saída (total) | 23539 |
| Tokens totais | 24693 |
| Latência média por tarefa | 29.55 s |
| Throughput médio (tps) | 99.8 |
| **Nota média backend** | **9.4 / 10** |
| **Nota média frontend** | **9.5 / 10** |
| **Nota geral** | **9.4 / 10** |

> Nota técnica: todas as chamadas retornaram `finish_reason: stop` (nenhuma truncada por
> `max_tokens`). O reasoning do Gemma 4 E4B é compacto (~200–300 tokens por tarefa), então
> o orçamento de 8000 tokens foi suficiente — ao contrário do qwen3.8-27b, que estourava
> o limite só no thinking. O modelo é verboso na resposta final (mais tokens de saída que o
> GPT-OSS), o que eleva a latência média (~30s) apesar do bom throughput.

---

## Tarefas de Backend

### backend-01 — API REST com Express + TypeScript
- **Nota**: 9.5/10
- **Checkpoints**: Endpoints REST completos (GET, POST, PATCH, DELETE) ✓ | Validação de título obrigatório ✓ | Tipagem TS ✓ | Estrutura de pastas ✓ | Instruções de execução + exemplos curl ✓
- **Observações**: Solução muito completa, com serviço/rotas/tipos separados, validação dupla (roteador e serviço), 404/400/204 corretos e tabela de testes curl. **Ponto negativo**: usa `ApiResponse<any>` e `any` no handler de erro global — tipagem fraca nesses pontos.

### backend-02 — Serviço com TypeScript: tratamento de erros
- **Nota**: 9.5/10
- **Checkpoints**: `Promise<User>` tipada ✓ | Tratamento de erro de rede e status HTTP ✓ | `UserNotFoundError` customizado ✓ | Timeout de 5s (`Promise.race`) ✓ | Exemplo com try/catch ✓
- **Observações**: Código robusto, com `TimeoutError` adicional, re-lançamento de erros customizados e cenários de exemplo (sucesso, 404, timeout). Explicação detalhada das camadas de erro.

### backend-03 — Tipos utilitários e genéricos
- **Nota**: 9.5/10
- **Checkpoints**: Partial ✓ | Pick ✓ | Omit ✓ | Readonly ✓ | ReturnType ✓ | Explicações em português ✓
- **Observações**: Todos os 5 utilitários aplicados à interface `Product`, cada um com tipo derivado nomeado e uso prático executável, além de tabela-resumo final.

### backend-04 — Refatoração e boas práticas
- **Nota**: 9.0/10
- **Checkpoints**: Separa em módulos ✓ | Tipagem completa ✓ | Tratamento de erros ✓ | Código testável ✓ | Explica as mudanças ✓
- **Observações**: Refatoração em 3 arquivos (types/service/demo) com classe encapsulada, validação de unicidade de e-mail e explicação clara das mudanças. **Ponto negativo**: explica a testabilidade mas não entrega um exemplo de teste (Jest) — o GPT-OSS apresentou o teste concreto.

---

## Tarefas de Frontend

### frontend-01 — Componente React com TypeScript
- **Nota**: 9.5/10
- **Checkpoints**: Componente funcional tipado (React.FC) ✓ | Props tipadas ✓ | Adicionar/marcar/remover ✓ | useState ✓ | Explicação ✓
- **Observações**: `TodoList` completo com `useCallback`, imutabilidade via `map/filter`, key por `id` e estilização inline. Previne itens vazios.

### frontend-02 — Custom hook com useEffect
- **Nota**: 9.5/10
- **Checkpoints**: Hook genérico `useDebounce<T>` ✓ | useEffect + setTimeout/cleanup ✓ | Exemplo de busca ✓ | Tipagem ✓
- **Observações**: Implementação correta do debounce com cleanup, dependências `[value, delay]` e exemplo de busca que filtra lista. Explicação do "porquê" do debounce muito boa.

### frontend-03 — Props, eventos e estado
- **Nota**: 9.5/10
- **Checkpoints**: Formulário email+senha ✓ | Validação (@ e senha ≥ 6) ✓ | Mensagens de erro ✓ | Prop `onLogin` ✓ | Código tipado ✓
- **Observações**: Validação centralizada com regex de e-mail, limpeza de erros ao digitar, chamada de `onLogin(email)` apenas no sucesso e exemplo de uso no componente pai. Código completo e bem explicado.

### frontend-04 — Renderização condicional e listas
- **Nota**: 9.5/10
- **Checkpoints**: Lista com key ✓ | Renderização condicional "Sem dados" ✓ | Destaque >100 ✓ | Props tipadas ✓ | Explica keys ✓
- **Observações**: Usa `key={stat.label}` (chave estável, diferente do `Math.random()` do GPT-OSS), destaque com estilo + badge de alerta, e explicação completa sobre boas/más práticas de keys.

---

## Considerações finais

- O **Gemma 4 E4B** entrega respostas de **alta qualidade** em backend e frontend com React/Node/TypeScript, com código tipado, organizado e bem explicado em português — **muito próximo do GPT-OSS 20B** em qualidade (9.4 vs 9.4 geral).
- **Ponto forte**: qualidade consistente e clareza das explicações; em `frontend-04` supera o GPT-OSS ao usar key estável em vez de `Math.random()`.
- **Ponto fraco**: tipagem com `any` em `backend-01` e ausência de exemplo de teste concreto em `backend-04`.
- **Desempenho**: ~100 tps (contra ~152 do GPT-OSS) e latência média ~30s (contra ~14s). O modelo gera ~2.4x mais tokens de saída que o GPT-OSS, o que explica a latência maior apesar do bom throughput.
- As respostas cruas estão em `raw-responses/` para revisão detalhada.