import { useState } from 'react';
import useDebounce from './useDebounce';

interface Item {
  id: number;
  name: string;
}

const SearchComponent = () => {
  const allItems: Item[] = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
    { id: 4, name: 'Date' },
    { id: 5, name: 'Elderberry' },
    { id: 6, name: 'Fig' },
    { id: 7, name: 'Grape' },
    { id: 8, name: 'Honeydew' },
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);

  const filteredItems = allItems.filter(item =>
    item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Busca com Debounce</h2>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Digite para buscar..."
        style={{ padding: '8px', marginBottom: '16px' }}
      />

      <div>
        <h3>Resultados ({filteredItems.length}):</h3>
        <ul>
          {filteredItems.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchComponent;