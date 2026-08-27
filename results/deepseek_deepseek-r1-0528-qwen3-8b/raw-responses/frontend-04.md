# Tarefa: RenderizaÃ§Ã£o condicional e listas

**ID**: frontend-04  **Categoria**: frontend
**Latencia**: 29.13s  **Tokens out**: 2436  **tps**: 83.62

---


Aqui está um exemplo completo de componente React com TypeScript:

```tsx
import React from 'react';

interface StatItem {
  label: string;
  value: number;
}

interface DashboardProps {
  stats: StatItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  // Verifica se o array está vazio e renderiza mensagem condicionalmente
  if (stats.length === 0) {
    return <div>Sem dados</div>;
  }

  // Mapeia os elementos do array para componentes JSX com estilos condicionais
  const statElements = stats.map((stat, index) => (
    <li 
      key={index} 
      className={`${stat.value > 100 ? 'highlight' : ''}`}
      style={{ color: stat.value > 100 ? '#ff3b30' : '#2d3436' }}
    >
      {stat.label}: {stat.value}
    </li>
  ));

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <ul>{statElements}</ul>
    </div>
  );
};

// Estilos inline para destacar valores acima de 100
const DashboardWithStyles = React.memo(function (props: { children?: React.ReactNode }) {
  return (
    <style>
      {{ 
        '.dashboard-container': {
          padding: '20px',
          fontFamily: 'Arial, sans-serif'
        },
        'ul': {
          listStyleType: 'none',
          paddingLeft: '0'
        },
        'li.highlight': {
          fontWeight: 'bold' as const,
          color: '#ff3b30',
          backgroundColor: '#f5f5f5',
          padding: '8px 12px',
          borderRadius: '4px'
        }
      }}
    </style>
    <Dashboard {...props} />
  );
});

export default DashboardWithStyles;
```

Explicação detalhada:

1. **Definição de interfaces TypeScript**:
   - `StatItem` define a estrutura de cada elemento estatístico
   - `DashboardProps` especifica que o componente recebe um array do tipo `StatItem[]`

2. **Uso de keys no mapeamento**:
   ```tsx
   stats.map((stat, index) => (
     <li key={index} ...
```
   - A propriedade `key` é obrigatória quando renderizamos listas em React/TypeScript
   - Ela serve para identificar de forma única cada elemento da lista durante as atualizações do DOM
   - No nosso caso usamos o índice como key porque:
     * Não temos um campo ID nos dados (assumindo que isso é uma propriedade)
     * Cada item na lista representa uma estatística diferente

3. **Estilização condicional**:
   ```tsx
   className={`${stat.value > 100 ? 'highlight' : ''}`}
   style={{ color: stat.value > 100 ? '#ff3b30' : '#2d3436' }}
```
   - Usamos template literals para concatenar classes condicionais
   - A cor do texto muda para vermelho quando o valor é maior que 100

4. **Múltiplas formas de destaque**:
   - Estilo inline (usando `style` diretamente)
   - Classe CSS adicional (`highlight`) para efeitos adicionais
   - Verificação direta do valor no JSX

5. **Optimização com React.memo**:
   ```tsx
   const DashboardWithStyles = React.memo(function (...) { ... });
```
   - Previne re-renderizações desnecessárias quando as props não mudam
   - Importante para componentes que podem ser usados múltiplas vezes

Para usar este componente:

```tsx
// Exemplo de uso:
<Dashboard stats={[
  { label: 'Visitas', value: 150 },
  { label: 'Cliques', value: 87 },
  { label: 'Conversões', value: 23 }
]} />
```

Principais pontos a considerar:

- **Keys**: O React usa keys para determinar qual elemento da lista mudou quando o componente pai re-renderiza. Sem uma key única, o React pode ter dificuldade em otimizar as atualizações do DOM e pode causar comportamentos indesejados.

- **Performance**: Usar índices como keys é aceitável para listas estáticas simples, mas para listas dinâmicas (com adição/remoção de itens) é melhor usar um identificador único em cada item.

- **Estilização condicional**: Podemos usar tanto classes CSS quanto estilos inline para destacar elementos. A combinação oferece mais flexibilidade visual mantendo a simplicidade do código.

- **React.memo**: Esta função wrapper ajuda a evitar re-renderizações desnecessárias, mas só deve ser usada quando realmente necessário por questões de performance.
