# Tarefa: RenderizaÃ§Ã£o condicional e listas

**ID**: frontend-04  **Categoria**: frontend
**Latencia**: 5.27s  **Tokens out**: 923  **tps**: 175.1

---

## ✅ Componente `Dashboard` – React + TypeScript

```tsx
/* Dashboard.tsx */
import React from 'react';

/**
 * Tipo da estatística que será exibida.
 *
 * @property label - Texto descritivo (ex.: "Usuários ativos")
 * @property value - Valor numérico associado à estatística
 */
export interface Stat {
  label: string;
  value: number;
}

/**
 * Props do componente Dashboard
 *
 * @property stats - Array de objetos `Stat`
 */
interface DashboardProps {
  stats: Stat[];
}

/**
 * Componente funcional que exibe um dashboard simples.
 *
 * - Renderiza um título (`<h2>`).
 * - Se o array `stats` estiver vazio, mostra a mensagem “Sem dados”.
 * - Caso contrário, lista cada estatística em `<li>`.
 *   • Cada item recebe uma chave única (key) baseada no índice do
 *     elemento. Em cenários reais, use um identificador único real.
 *   • Se o valor for maior que 100, aplica a classe CSS `highlight`
 *     para destacar o item.
 *
 * @param {DashboardProps} props - Propriedades recebidas pelo componente
 */
const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <section className="dashboard">
      <h2>Resumo do Sistema</h2>

      {/* Mensagem condicional */}
      {stats.length === 0 ? (
        <p>Sem dados</p>
      ) : (
        <ul>
          {stats.map((stat, index) => {
            // Se o valor for >100, adiciona a classe 'highlight'
            const itemClass = stat.value > 100 ? 'highlight' : '';

            return (
              /* 
               * Chave (key) é fundamental para que o React
               * consiga identificar quais itens mudaram, foram
               * adicionados ou removidos. Aqui usamos o índice
               * do array como chave porque os dados são estáticos.
               *
               * Em aplicações reais, prefira usar um identificador
               * único (ex.: id) para evitar problemas quando a ordem
               * dos itens mudar.
               */
              <li key={index} className={itemClass}>
                <strong>{stat.label}</strong>: {stat.value}
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

### Estilos (opcional)

```css
/* styles.css */
.dashboard ul {
  list-style: none;
  padding-left: 0;
}

.dashboard li {
  margin-bottom: 8px;
  padding: 4px 8px;
  border-radius: 4px;
}

/* Destaque para valores > 100 */
.highlight {
  background-color: #ffeb3b; /* amarelo claro */
  color: #000;
}
```

### Como usar

```tsx
/* App.tsx */
import React from 'react';
import Dashboard, { Stat } from './Dashboard';

const statsData: Stat[] = [
  { label: 'Usuários ativos', value: 85 },
  { label: 'Pedidos processados', value: 120 }, // >100 → destaque
  { label: 'Vendas mensais', value: 45 }
];

function App() {
  return (
    <div className="App">
      <Dashboard stats={statsData} />
    </div>
  );
}

export default App;
```

### Explicação das `keys`

- **O que são?**  
  A propriedade `key` em listas React ajuda o algoritmo de *reconciliation* a identificar quais itens foram alterados, adicionados ou removidos. Sem uma chave única e estável, o React pode re‑renderizar tudo ou manter estados internos incorretamente.

- **Por que usar índices aqui?**  
  O exemplo usa `index` porque os dados são estáticos e não há risco de reordenar a lista. Em cenários dinâmicos (ex.: itens removidos/adiados), é melhor usar um identificador real (`id`) para evitar bugs de UI.

- **Resultado:**  
  Cada `<li>` recebe uma chave única, permitindo que o React otimize a renderização e mantenha a consistência da interface.
