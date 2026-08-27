# Tarefa: RenderizaÃ§Ã£o condicional e listas

**ID**: frontend-04  **Categoria**: frontend
**Latencia**: 19.02s  **Tokens out**: 1582  **tps**: 83.19

---

```tsx
import React from 'react';

// --- Tipagem da Prop ---
interface Stat {
  label: string;
  value: number;
}

// --- Componente Dashboard ---
const Dashboard: React.FC<{ stats: Stat[] }> = ({ stats }) => {
  // Verifica se o array está vazio e renderiza mensagem condicional
  if (stats.length === 0) {
    return <div className="dashboard">Sem dados</div>;
  }

  return (
    <div className="dashboard">
      {/* Título */}
      <h1>Dashboard de Estatísticas</h1>

      {/* Lista com chave única */}
      <ul className="stats-list">
        {stats.map((stat) => (
          // ⚠️ A CHAVE ÚNICA É OBRIGATÓRIA NO REACT
          <li key={stat.label}>
            <span>{stat.label}</span>
            <span
              className={`value ${stat.value > 100 ? 'highlight' : ''}`}
            >
              {stat.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Estilos (CSS-in-JS simples para demonstração) ---
const styles: Record<string, React.CSSProperties> = {
  dashboard: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  statsList: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    marginBottom: '8px',
  },
  value: (highlighted: boolean) => ({
    fontWeight: highlighted ? 'bold' : 'normal',
    color: highlighted ? '#d32f2f' : '#333',
    fontSize: highlighted ? '1.2em' : '1em',
  }),
};

// --- Exemplo de Uso ---
const App: React.FC = () => {
  const stats: Stat[] = [
    { label: 'Vendas', value: 50 },
    { label: 'Receita', value: 250 }, // > 100 → destacado
    { label: 'Clientes', value: 80 },
    { label: 'Problemas', value: 3 },
  ];

  return (
    <div>
      <Dashboard stats={stats} />
    </div>
  );
};

export default App;
```

---

## 📚 Explicação Detalhada

### 1. **Tipagem com TypeScript**
A interface `Stat` define claramente a estrutura de cada objeto do array:
```typescript
interface Stat {
  label: string;   // Nome da estatística (ex: "Vendas")
  value: number;   // Valor numérico (ex: 250)
}
```

### 2. **Renderização Condicional**
O React renderiza um único elemento `<div>` com o texto "Sem dados" quando `stats.length === 0`. Isso evita que a lista seja vazia e melhora a UX.

### 3. **Destaque Condicional (Valor > 100)**
```tsx
className={`value ${stat.value > 100 ? 'highlight' : ''}`}
```
- Se `value > 100`, aplica-se a classe CSS `.highlight` com cor vermelha e fonte em negrito.
- Caso contrário, o estilo padrão é aplicado.

### 4. **⚠️ O Uso de `key` (Crucial!)**

| ❌ Errado | ✅ Correto |
|-----------|------------|
| `<li>{stat.label}</li>` | `<li key={stat.label}>...</li>` |
| `<li>{index}</li>` | `<li key={stat.label}>...</li>` |

#### Por que `key` é obrigatório?

1. **Identificação única**: O React usa a `key` para identificar cada elemento na lista de forma estável, mesmo que a ordem mude ou itens sejam adicionados/removidos.
2. **Reutilização do DOM**: Em vez de recriar todo o DOM da lista, o React apenas atualiza os nós que mudaram (diffing).
3. **Performance**: Sem `key`, o React pode criar elementos desnecessariamente, causando bugs e lentidão.

#### Por que NÃO usar `index` como key?

```tsx
// ❌ EVITE ISSO — causa bugs ao reordenar ou remover itens!
{stats.map((stat, index) => (
  <li key={index}>...</li> // Se a ordem mudar, o React perde o estado!
))}
```

**Exemplo de bug com `index`:**
- Item A (índice 0), Item B (índice 1)
- Você remove o Item B → o Item C sobe para índice 1
- O React acha que o Item C é o mesmo do índice 1 anterior e **não atualiza seu estado**!

#### Por que usar `stat.label` como key?
- É único dentro da lista (assumindo labels distintos)
- É estável (não muda se a ordem mudar)
- É semântico (representa o item, não sua posição)

---

## 🎨 Resultado Visual

```
┌─────────────────────────────┐
│   Dashboard de Estatísticas  │
├─────────────────────────────┤
│ • Vendas           50       │
│ • Receita          250 🔴   │ ← destacado (valor > 100)
│ • Clientes         80       │
│ • Problemas        3        │
└─────────────────────────────┘
```

Se o array estiver vazio:
```
┌─────────────────────────────┐
│   Dashboard de Estatísticas  │
├─────────────────────────────┤
│      Sem dados              │
└─────────────────────────────┘
```
