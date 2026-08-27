# Tarefa: Custom hook com useEffect

**ID**: frontend-02  **Categoria**: frontend
**Latencia**: 26.05s  **Tokens out**: 2618  **tps**: 100.5

---

Este é um requisito clássico em desenvolvimento front-end para otimizar a performance, especialmente ao lidar com chamadas de API ou processamento pesado baseado na entrada do usuário. O *debouncing* garante que uma função só será executada após um período de inatividade no input.

Abaixo está o código completo e tipado, seguido pela explicação detalhada.

---

## 💻 Código Completo (TypeScript/React)

```tsx
import React, { useState, useEffect } from 'react';

/**
 * ========================================================
 * 1. CUSTOM HOOK: useDebounce<T>
 * Implementa a lógica de debouncing para um valor dado.
 * @param value O valor que será monitorado (ex: o texto do input).
 * @param delay O tempo em milissegundos para esperar antes de retornar o valor.
 * @returns O valor estabilizado após o atraso.
 */
function useDebounce<T>(value: T, delay: number): T {
  // 1. Estado interno que armazenará o valor "debounced" (estabilizado).
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 2. Configura um timer para atualizar o valor debounced após o delay.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 3. Função de limpeza (Cleanup Function):
    // Esta função é executada sempre que as dependências ([value, delay]) mudam,
    // ou quando o componente é desmontado. Ela cancela qualquer timer pendente.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Dependências: O efeito roda se 'value' ou 'delay' mudar.

  return debouncedValue;
}


/**
 * ========================================================
 * 2. COMPONENTE DE EXEMPLO: SearchComponent
 * Demonstra o uso do useDebounce em um componente de busca.
 */
interface Item {
    id: number;
    name: string;
}

const initialItems: Item[] = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
    { id: 4, name: 'Date Fruit' },
    { id: 5, name: 'Elderberry' },
];

const SearchComponent: React.FC = () => {
    // Estado para o valor bruto digitado pelo usuário (muda a cada tecla).
    const [inputValue, setInputValue] = useState<string>('');
    
    // Estado para armazenar os resultados filtrados finais.
    const [filteredItems, setFilteredItems] = useState<Item[]>(initialItems);

    // 1. Usamos o hook useDebounce no valor bruto (inputValue).
    // O 'debouncedSearchTerm' só mudará após 500ms de inatividade do usuário.
    const debouncedSearchTerm = useDebounce(inputValue, 500);

    // 2. useEffect que escuta o termo DEBOUNCED.
    // Este efeito é responsável pela lógica pesada (filtragem/chamada API).
    useEffect(() => {
        console.log(`[🔍] Executando busca com: "${debouncedSearchTerm}"`);
        
        if (!debouncedSearchTerm) {
            setFilteredItems(initialItems); // Se vazio, mostra tudo
            return;
        }

        // Lógica de filtragem (simulando uma chamada API lenta)
        const results = initialItems.filter(item => 
            item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
        
        setFilteredItems(results);

    }, [debouncedSearchTerm]); // Dependência: Só executa quando o termo debounced muda.


    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h1>🔎 Busca Otimizada com Debounce</h1>
            <p>Digite algo e observe que a busca só é executada após 500ms de pausa.</p>

            <input
                type="text"
                placeholder="Buscar frutas..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ padding: '10px', width: '100%', fontSize: '16px' }}
            />

            <h2 style={{ marginTop: '30px' }}>Resultados ({filteredItems.length}):</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {filteredItems.map(item => (
                    <li key={item.id} style={{ borderBottom: '1px solid #eee', padding: '10px' }}>
                        {item.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchComponent;
```

---

## 🧠 Explicações Detalhadas

### 1. O Custom Hook `useDebounce<T>`

#### Como funciona?
O objetivo do `useDebounce` é criar um "buffer" de tempo. Em vez de reagir a *cada* mudança no `value`, ele espera que o usuário pare de digitar por um período definido (`delay`).

1.  **`useState<T>(value)`:** Armazena o valor final e estável (`debouncedValue`). Inicialmente, é igual ao `value` passado para o hook.
2.  **`useEffect(() => { ... }, [value, delay])`:** Este é o coração da lógica. Ele roda sempre que o `value` (o input bruto) muda.
3.  **`setTimeout(...)`:** Dentro do `useEffect`, configuramos um timer. Se este timer for executado, ele chamará `setDebouncedValue(value)`, atualizando nosso estado estável.
4.  **Função de Limpeza (`return () => { clearTimeout(handler); }`)**: Este é o passo mais crucial do debouncing em React. Quando o `useEffect` roda novamente (porque o usuário digitou outra letra, mudando `value`), a função de limpeza da *execução anterior* é chamada primeiro. Ela usa `clearTimeout(handler)` para **cancelar** o timer pendente. Isso garante que apenas o último evento de digitação tenha chance de completar seu atraso e atualizar o estado.

#### Tipagem (`<T>`)
Ao usar `<T>`, garantimos que o hook seja genérico. Ele pode debouncar strings, números, objetos ou qualquer tipo de dado, mantendo a segurança do TypeScript em todo o código.

### 2. O Componente `SearchComponent` (Exemplo de Uso)

O componente demonstra como separar as responsabilidades:

1.  **Estado Bruto (`inputValue`)**: Este estado é atualizado **instantaneamente** com cada tecla digitada pelo usuário.
2.  **Debouncing (`debouncedSearchTerm`)**: Chamamos `useDebounce(inputValue, 500)`. O valor retornado aqui só muda após o usuário parar de digitar por meio segundo.
3.  **Lógica Pesada (`useEffect` secundário)**: Usamos um *segundo* `useEffect`, mas ele não depende do `inputValue` (o estado bruto). Ele depende apenas do **`debouncedSearchTerm`**.

#### Por que usar dois estados/efeitos?
Se a lógica de filtragem estivesse dentro do `onChange` ou dependesse diretamente do `inputValue`, ela seria executada 10 vezes enquanto o usuário digita "Banana". Ao usar o `useDebounce`, garantimos que a função de filtragem (que pode ser uma chamada API lenta) só será disparada **uma única vez** após o termo ter se estabilizado.

**Resultado:** A experiência do usuário é fluida, mas a performance da aplicação é mantida, pois operações caras são executadas apenas quando necessário.
