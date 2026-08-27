// frontend/src/App.tsx
import React from 'react';
import { Cart } from './components/Cart';

const App: React.FC = () => (
  <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
    <h1>Loja Demo</h1>
    {/* Em um cenário real você teria uma lista de produtos com botão "Adicionar ao carrinho" */}
    <Cart />
  </div>
);

export default App;