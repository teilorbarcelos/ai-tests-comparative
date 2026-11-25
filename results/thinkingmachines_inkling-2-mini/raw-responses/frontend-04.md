# Tarefa: RenderizaÃ§Ã£o condicional e listas

**ID**: frontend-04  **Categoria**: frontend
**Latencia**: 121.93s  **Tokens out**: 1974  **tps**: 16.19

---

```tsx
import type { FC } from 'react';

type Stat = {
  label: string;
  value: number;
};

interface DashboardProps {
  stats: Stat[];
}

const Dashboard: FC<DashboardProps> = ({ stats }) => {
  return (
    <section className="dashboard" aria-labelledby="dashboard-title">
      <h1 id="dashboard-title">Dashboard</h1>

      {stats.length === 0 ? (
        <p role="status">Sem dados</p>
      ) : (
        <ul className="stats-list">
          {stats.map((stat, index) => {
            const isHighlighted = stat.value > 100;

            return (
              <li
                key={`${stat.label}-${index}`}
                className={isHighlighted ? 'stat highlighted' : 'stat'}
              >
                <span className="stat-label">{stat.label}</span>
                <strong className="stat-value">{stat.value}</strong>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default Dashboard;
```

Exemplo de CSS:

```css
.stats-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 12px;
}

.stat {
  color: #1f2937;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.stat.highlighted {
  color: #b91c1c;
  font-weight: 700;
  border-color: #fca5a5;
  background-color: #fef2f2;
}

.stat-label {
  display: block;
  margin-bottom: 4px;
}
```

Uso de `key`: a `key` ajuda o React a identificar quais itens da lista mudaram, foram adicionados ou removidos entre renderizações. Ela deve ser **única entre os irmãos** e, idealmente, **estável** — ou seja, não mudar quando a ordem da lista muda.

Neste exemplo, como o tipo `Stat` só tem `label` e `value`, usamos `` `${stat.label}-${index}` `` para garantir unicidade dentro do array atual. Isso funciona, mas ainda é uma solução temporária: se houver reordenação, inserção ou remoção de itens, usar índice pode causar remontagens desnecessárias e perder estado interno dos elementos.

A melhor prática seria adicionar um identificador estável ao dado, por exemplo:

```ts
type Stat = {
  id: string;
  label: string;
  value: number;
};
```

E então usar `key={stat.id}`. Se não for possível alterar o tipo da prop, use índice apenas para listas estáticas e sem reordenação — ou gere uma chave derivada de forma determinística, mas documente essa limitação.
