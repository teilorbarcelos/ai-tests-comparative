# Tarefa: RenderizaÃ§Ã£o condicional e listas

**ID**: frontend-04  **Categoria**: frontend
**Latencia**: 29.11s  **Tokens out**: 2912  **tps**: 100.02

---

Este é um excelente exercício que combina tipagem forte, lógica condicional e boas práticas de renderização em React.

Abaixo está o código completo do componente `Dashboard`, seguido por uma explicação detalhada sobre a funcionalidade e o uso das chaves (`keys`).

### 📁 Estrutura do Projeto (Exemplo)

Para rodar este código, você precisará ter um projeto React/TypeScript configurado. O código abaixo pode ser colocado em um arquivo como `Dashboard.tsx`.

```bash
# Se estiver usando Vite ou CRA com TS:
npm install react react-dom typescript @types/react @types/react-dom
```

### 💻 Código Completo (`Dashboard.tsx`)

```tsx
import React from 'react';

// ==================================================
// 1. DEFINIÇÃO DE TIPOS (TypeScript)
// ==================================================

/**
 * Interface para um item de estatística individual.
 */
interface StatItem {
  label: string;
  value: number;
}

/**
 * Props que o componente Dashboard irá receber.
 */
interface DashboardProps {
  stats: StatItem[];
}

// ==================================================
// 2. ESTILOS (Para demonstração)
// ==================================================

const styles: { [key: string]: React.CSSProperties } = {
  dashboardContainer: {
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    maxWidth: '600px',
    margin: '30px auto',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    color: '#333',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  statList: {
    listStyleType: 'none',
    padding: 0,
  },
  statItem: (isHighValue: boolean) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px dashed #eee',
    // Aplica o destaque se for um valor alto
    backgroundColor: isHighValue ? '#fff3cd' : 'transparent', // Amarelo claro para alerta
    color: isHighValue ? '#856404' : '#333',
    fontWeight: isHighValue ? 'bold' : 'normal',
  }),
  emptyMessage: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '1.2em',
    color: '#777',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
  }
};


// ==================================================
// 3. COMPONENTE REACT (Dashboard)
// ==================================================

/**
 * Componente Dashboard que exibe estatísticas de forma dinâmica.
 * @param props - Contém o array de estatísticas (stats).
 */
const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  
  // 1. Lógica Condicional para estado vazio
  if (!stats || stats.length === 0) {
    return (
      <div style={styles.dashboardContainer}>
        <h2 style={styles.title}>Painel de Controle</h2>
        <p style={styles.emptyMessage}>📊 Sem dados disponíveis no momento.</p>
      </div>
    );
  }

  // 2. Renderização principal
  return (
    <div style={styles.dashboardContainer}>
      <h2 style={styles.title}>📈 Painel de Controle</h2>
      
      <ul style={styles.statList}>
        {/* Mapeamento do array stats */}
        {stats.map((stat) => {
          // 3. Lógica de Destaque: Verifica se o valor é maior que 100
          const isHighValue = stat.value > 100;

          return (
            <li 
              key={stat.label} // CHAVE ÚNICA AQUI!
              style={styles.statItem(isHighValue)}
            >
              <span>{stat.label}:</span>
              <strong>{stat.value.toFixed(1)}</strong>
              {/* Opcional: Adiciona um indicador visual para valores altos */}
              {isHighValue && <span style={{ marginLeft: '10px', color: '#dc3545' }}>⚠️ ALERTA</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Dashboard;


// ==================================================
// 4. EXEMPLO DE USO (App.tsx)
// ==================================================

import React from 'react';
import Dashboard from './Dashboard'; // Ajuste o caminho conforme sua estrutura

const App: React.FC = () => {
  // Exemplo de dados com valores altos e baixos
  const dataWithStats: StatItem[] = [
    { label: "Usuários Ativos", value: 450 },   // Destaque
    { label: "Taxa de Conversão", value: 8.2 },
    { label: "Vendas Mensais", value: 120 },  // Destaque
    { label: "Erros Críticos", value: 15 },
  ];

  // Exemplo de dados vazios para testar a mensagem condicional
  const emptyData: StatItem[] = [];


  return (
    <div className="App">
      <h1>Demonstração do Dashboard</h1>
      
      {/* Teste com dados válidos */}
      <h2>--- Dados Populares ---</h2>
      <Dashboard stats={dataWithStats} />

      {/* Teste com array vazio */}
      <h2>--- Sem Dados (Teste) ---</h2>
      <Dashboard stats={emptyData} />
    </div>
  );
};

export default App;
```

***

### 💡 Explicações Detalhadas

#### 1. Tipagem Forte (`interface` e `React.FC`)

*   **`StatItem`**: Define a estrutura exata que cada objeto dentro do array deve ter (`label: string`, `value: number`). Isso garante que, se você tentar passar um dado incorreto (ex: `value: "abc"`), o TypeScript irá alertar imediatamente no momento da escrita do código.
*   **`DashboardProps`**: Define as propriedades esperadas pelo componente. Ao usar `React.FC<DashboardProps>`, estamos dizendo ao React e ao TypeScript que este componente espera receber um objeto com a propriedade `stats`, que deve ser um array de `StatItem`.

#### 2. Lógica Condicional (Empty State)

```tsx
if (!stats || stats.length === 0) {
    return (
      <div style={styles.dashboardContainer}>
        {/* ... Mensagem "Sem dados" */}
      </div>
    );
}
```

Esta é a primeira coisa que o componente verifica. Se o array `stats` for nulo, indefinido ou tiver comprimento zero, ele retorna imediatamente um bloco de UI diferente (a mensagem "Sem dados"), evitando assim erros ao tentar mapear um array vazio.

#### 3. Destaque Condicional (`isHighValue`)

```tsx
const isHighValue = stat.value > 100;

return (
    <li 
        key={stat.label} 
        style={styles.statItem(isHighValue)} // Passa o booleano para o estilo
    >
        {/* ... */}
        {isHighValue && <span style={{ marginLeft: '10px', color: '#dc3545' }}>⚠️ ALERTA</span>}
    </li>
);
```

Dentro do método `.map()`, criamos uma variável booleana (`isHighValue`). Essa variável é usada em dois lugares:
1.  Para aplicar um estilo diferente ao `<li>` (via função de estilo).
2.  Para renderizar um ícone ou texto de alerta extra, mas **somente** se a condição for verdadeira (`{isHighValue && ...}`).

#### 4. O Uso das Chaves (`keys`) - A Explicação Essencial

No código, você verá: `key={stat.label}` dentro do `.map()`.

**Por que o React exige chaves?**

Quando você renderiza uma lista de elementos (como um array mapeado para vários `<li>`s), o React precisa de uma maneira eficiente de identificar cada item individualmente. Ele não apenas desenha os itens na tela; ele também rastreia quais itens foram adicionados, removidos ou modificados entre as atualizações do estado.

**O papel da chave (`key`) é servir como um identificador único e estável para aquele elemento específico.**

1.  **Performance:** Sem chaves, se você adicionar um novo item no início de uma lista grande, o React teria que re-renderizar *todos* os elementos abaixo dele para manter a ordem correta. Com chaves, ele sabe exatamente qual elemento mudou e só atualiza aquele componente específico, otimizando drasticamente a performance.
2.  **Estabilidade:** As chaves ajudam o React a saber se um item é o mesmo objeto em diferentes renderizações.

**Qual chave usar?**

*   **Melhor Prática (Ideal):** Use um `id` único e estável que venha dos seus dados (`key={stat.id}`).
*   **Aceitável (Se não houver ID):** Se o seu dado for garantidamente imutável e tiver uma propriedade única, use essa propriedade (`key={stat.label}` neste exemplo).
*   **Pior Prática (Evitar):** Nunca use o índice do array (`key={index}`) como chave se a lista puder ser reordenada, filtrada ou ter itens adicionados/removidos no meio. Isso pode causar bugs visuais e problemas de estado em componentes complexos.
