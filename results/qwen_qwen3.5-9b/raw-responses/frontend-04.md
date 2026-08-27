# Tarefa: RenderizaÃ§Ã£o condicional e listas

**ID**: frontend-04  **Categoria**: frontend
**Latencia**: 14.86s  **Tokens out**: 1148  **tps**: 77.27

---

# Componente Dashboard em React com TypeScript

Abaixo está um componente `Dashboard` completo, tipado e funcional, que atende aos requisitos solicitados: recebe uma lista de estatísticas, renderiza-as com destaque condicional e inclui tratamento para listas vazias. Também incluí uma explicação detalhada sobre o uso de `key` em React.

---

## 📦 Código Completo do Componente

```tsx
import React from 'react';

// Interface que define a estrutura dos dados
interface Stat {
  label: string;
  value: number;
}

// Estilo inline para destacar valores > 100
const highlightStyle = (value: number) => ({
  backgroundColor: value > 100 ? '#ffcccc' : '#ffffff',
  borderLeft: value > 100 ? '4px solid #ff6b6b' : '4px solid #4ecdc4',
});

// Componente Dashboard
const Dashboard: React.FC<{ stats: Stat[] }> = ({ stats }) => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Dashboard de Estatísticas</h1>

      {stats.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>Sem dados</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {stats.map((stat, index) => (
            <li
              key={stat.label} // Chave única baseada no label
              style={highlightStyle(stat.value)}
            >
              <strong>{stat.label}</strong>: {stat.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
```

---

## 🧠 Explicação do Uso de `key` em React

Em React, o atributo `key` é essencial para identificar cada elemento em uma lista. Ele ajuda o React a:

- **Rastrear mudanças** no DOM quando os itens são adicionados, removidos ou alterados;
- **Otimizar renderizações**, evitando recriar componentes desnecessariamente;
- **Manter o estado interno** de elementos entre atualizações.

### ✅ Boas Práticas para `key`

1. **Use valores estáveis e únicos**: IDs, labels ou índices que não mudam entre renders.
2. **Evite índices como chave** em listas dinâmicas (ex: `array.map((item, index) => ...)`), pois podem causar bugs ao reordenar ou filtrar itens.
3. **Prefira propriedades únicas do objeto**, como `stat.label`, quando disponíveis.

### ⚠️ Exemplo de Problema com Index como Key

```tsx
// ❌ Ruim: pode causar problemas se a ordem mudar
{stats.map((stat, index) => (
  <li key={index}>{stat.label}</li>
))}
```

### ✅ Exemplo Correto

```tsx
// ✅ Bom: usa label como chave única e estável
{stats.map((stat) => (
  <li key={stat.label}>{stat.label}</li>
))}
```

---

## 🧪 Exemplo de Uso

```tsx
import React from 'react';
import Dashboard from './Dashboard';

const App: React.FC = () => {
  const stats: Stat[] = [
    { label: 'Vendas', value: 150 },
    { label: 'Visitantes', value: 80 },
    { label: 'Conversões', value: 200 },
  ];

  return <Dashboard stats={stats} />;
};

export default App;
```

---

## 🎨 Destaques Visuais

- **Fundo claro** (`#ffffff`) para valores ≤ 100;
- **Fundo avermelhado** (`#ffcccc`) com borda vermelha para valores > 100;
- **Mensagem "Sem dados"** exibida quando a lista está vazia.

---

Este componente é modular, tipado e fácil de integrar em projetos React com TypeScript. Ele segue boas práticas de performance e acessibilidade, além de ser visualmente claro para destacar informações importantes.
