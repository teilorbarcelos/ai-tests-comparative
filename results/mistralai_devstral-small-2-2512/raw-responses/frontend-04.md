# Tarefa: RenderizaÃ§Ã£o condicional e listas

**ID**: frontend-04  **Categoria**: frontend
**Latencia**: 19.39s  **Tokens out**: 697  **tps**: 35.95

---

Aqui está um componente React com TypeScript chamado `Dashboard` que atende aos requisitos:

```tsx
import React from 'react';

interface Stats {
  label: string;
  value: number;
}

interface DashboardProps {
  stats: Stats[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div className="dashboard">
      <h1>Painel de Estatísticas</h1>
      {stats.length === 0 ? (
        <p>Sem dados disponíveis</p>
      ) : (
        <ul className="stats-list">
          {stats.map((stat) => (
            <li
              key={stat.label}
              className={`stat-item ${stat.value > 100 ? 'highlight' : ''}`}
            >
              <span>{stat.label}: </span>
              <strong>{stat.value}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
```

### Explicação do código:

1. **Interfaces**:
   - `Stats`: Define a estrutura de cada item da lista (label e value).
   - `DashboardProps`: Define as props que o componente recebe.

2. **Renderização condicional**:
   - Se o array `stats` estiver vazio, exibe a mensagem "Sem dados disponíveis".
   - Caso contrário, renderiza uma lista com os itens.

3. **Destaque para valores > 100**:
   - Usamos um operador ternário na classe do `<li>` para adicionar a classe `highlight` quando o valor for maior que 100.
   - (Você precisaria adicionar CSS para estilizar essa classe, por exemplo: `.highlight { color: red; }`).

4. **Uso de `key`**:
   - As `keys` são essenciais no React para ajudar a identificar quais itens foram alterados, adicionados ou removidos.
   - Elas devem ser únicas entre irmãos (no mesmo array) e não precisam ser globais na aplicação.
   - No exemplo, usamos `stat.label` como key porque assume-se que os labels são únicos. Se não forem, você deveria usar um ID único.

### Exemplo de uso do componente:

```tsx
import React from 'react';
import Dashboard from './Dashboard';

const App: React.FC = () => {
  const statsData = [
    { label: 'Usuários', value: 42 },
    { label: 'Vendas', value: 150 },
    { label: 'Produtos', value: 8 },
  ];

  return <Dashboard stats={statsData} />;
};

export default App;
```

### Estilização opcional (CSS):
```css
.dashboard {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
}

.stats-list {
  list-style: none;
  padding: 0;
}

.stat-item {
  padding: 8px 16px;
  border-bottom: 1px solid #eee;
}

.highlight {
  color: red;
  font-weight: bold;
}
```

Este componente é tipado, reutilizável e segue boas práticas do React.
