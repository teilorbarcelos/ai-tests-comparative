// frontend/src/components/Cart.tsx
import React from 'react';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../domain/types';

export const Cart: React.FC = () => {
  const { items, loading, error, remove } = useCart();

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (loading) return <p>Carregando carrinho...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Carrinho</h2>
      {items.length === 0 ? (
        <p>O carrinho está vazio.</p>
      ) : (
        <ul>
          {items.map((i: CartItem) => (
            <li key={i.id} style={{ marginBottom: '1rem' }}>
              <strong>{i.name}</strong> - R$ {i.price.toFixed(2)} x {i.quantity}
              <button
                onClick={() => remove(i.id)}
                style={{
                  marginLeft: '0.5rem',
                  backgroundColor: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 8px',
                  cursor: 'pointer'
                }}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
      <h3>Total: R$ {total.toFixed(2)}</h3>
    </div>
  );
};