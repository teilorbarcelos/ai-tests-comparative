# Tarefa: RenderizaÃ§Ã£o condicional e listas

**ID**: frontend-04  **Categoria**: frontend
**Latencia**: 78.46s  **Tokens out**: 1373  **tps**: 17.5

---

Aqui está um componente `Dashboard` implementado com React e TypeScript que atende aos requisitos solicitados:

```tsx
import React from 'react';

// Tipagem para os dados de estatísticas
interface Stat {
  label: string;
  value: number;
}

// Tipagem para as props do componente
interface DashboardProps {
  stats: Stat[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  // Verifica se o array está vazio
  if (stats.length === 0) {
    return <div>Sem dados</div>;
  }

  return (
    <div>
      <h1>Estatísticas do Sistema</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {stats.map((stat, index) => (
          <li 
            key={index} // Usando o índice como chave (com aviso)
            style={{
              color: stat.value > 100 ? 'green' : 'inherit',
              fontWeight: stat.value > 100 ? 'bold' : 'normal'
            }}
          >
            {stat.label}: {stat.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
```

### Explicação detalhada:

#### 1. **Tipagem com TypeScript**
- Definimos uma interface `Stat` para representar cada objeto de estatística (com `label` e `value`)
- Criamos uma interface `DashboardProps` que define a estrutura esperada das props do componente

#### 2. **Lógica condicional**
- Verificamos se o array `stats` está vazio com `if (stats.length === 0)`
- Se estiver vazio, retornamos um elemento `<div>Sem dados</div>`

#### 3. **Renderização da lista**
- Usamos `.map()` para iterar sobre o array de `stats`
- Para cada item, criamos uma `<li>` com:
  - A chave única (`key`) usando o índice do array (com aviso)
  - Estilo condicional: 
    - Cor verde e negrito se o valor for maior que 100
    - Estilo padrão caso contrário

#### 4. **Uso de keys**
- **Por que usar keys?**:
  - As keys ajudam React a identificar quais elementos mudaram, foram adicionados ou removidos na lista
  - Isso otimiza o processo de reconciliação do DOM e evita bugs em listas dinâmicas
- **Aviso sobre uso de índice como key**:
  - O índice é uma opção válida apenas se a ordem dos itens for estática (não mudar)
  - Se os elementos forem reordenados ou adicionados/removidos, o uso do índice pode causar problemas de renderização
  - Em ambientes profissionais, prefere-se usar IDs únicos como keys

#### 5. **Estilização condicional**
- Usamos a propriedade `style` para aplicar estilos dinâmicos com base no valor da estatística
- A cor e o peso do texto são alterados quando o valor excede 100

### Exemplo de uso:
```tsx
const stats = [
  { label: 'Usuários', value: 250 },
  { label: 'Vendas', value: 85 },
  { label: 'Atendimentos', value: 120 }
];

<Dashboard stats={stats} />
```

### Saída esperada:
- Título "Estatísticas do Sistema"
- Lista com:
  - "Usuários": 250 (destacado)
  - "Vendas": 85
  - "Atendimentos": 120 (destacado)

Este componente é responsivo, tipado e segue boas práticas de desenvolvimento React.
