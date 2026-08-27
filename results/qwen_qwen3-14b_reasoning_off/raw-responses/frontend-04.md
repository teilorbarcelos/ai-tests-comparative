# Tarefa: RenderizaÃ§Ã£o condicional e listas

**ID**: frontend-04  **Categoria**: frontend
**Latencia**: 58.98s  **Tokens out**: 855  **tps**: 14.5

---

Abaixo está um componente React com TypeScript chamado `Dashboard`, que:

- Recebe uma propriedade `stats` do tipo `{ label: string; value: number }[]`.
- Renderiza um título.
- Mostra uma lista das estatísticas, usando chaves únicas para cada item (importante para o React).
- Exibe a mensagem "Sem dados" se o array de `stats` estiver vazio.
- Destaca em vermelho os itens cujo valor é maior que 100.

---

### ✅ Código do Componente

```tsx
import React from 'react';

interface Stat {
  label: string;
  value: number;
}

interface DashboardProps {
  stats: Stat[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333' }}>Painel de Estatísticas</h1>

      {stats.length === 0 ? (
        <p style={{ color: '#888', fontStyle: 'italic' }}>Sem dados</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {stats.map((stat, index) => (
            <li
              key={index}
              style={{
                marginBottom: '15px',
                backgroundColor: stat.value > 100 ? '#ffe6e6' : '#f9f9f9',
                borderRadius: '8px',
                padding: '12px',
                borderLeft: `4px solid ${stat.value > 100 ? '#ff4d4d' : '#ccc'}`,
              }}
            >
              <strong>{stat.label}:</strong> {stat.value}
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

### 🔍 Explicação do Uso de `keys` no React

No React, quando você renderiza uma lista de elementos (como `<li>`), é **obrigatório** fornecer um atributo `key` para cada elemento. Isso ajuda o React a:

- Identificar quais elementos mudaram, foram adicionados ou removidos.
- Manter o estado dos componentes e otimizar as atualizações da DOM.

#### Por que não usar índices como chaves?

Embora seja comum usar `index` (como fizemos acima), **não é recomendado** em listas dinâmicas, pois:

- Se a ordem mudar, o React pode confundir os elementos.
- Pode causar problemas de renderização e desempenho.

#### O que fazer?

Se possível, use um identificador único do dado (como `id`) como chave. Por exemplo:

```tsx
{stats.map((stat) => (
  <li key={stat.label} /* ou key={stat.id} se tiver */>...</li>
))}
```

No nosso caso, usamos o índice (`index`) apenas por simplicidade e porque não temos um `id` único. Mas em aplicações reais, sempre prefira chaves únicas baseadas nos dados.

---

### 📌 Exemplo de Uso

```tsx
import React from 'react';
import Dashboard from './Dashboard';

const App: React.FC = () => {
  const stats = [
    { label: 'Usuários', value: 150 },
    { label: 'Posts', value: 89 },
    { label: 'Comentários', value: 234 },
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

Se quiser, posso também criar um exemplo com `id` único e mostrar como o componente se comporta em diferentes cenários (como quando não há dados ou quando valores são maiores que 100).
