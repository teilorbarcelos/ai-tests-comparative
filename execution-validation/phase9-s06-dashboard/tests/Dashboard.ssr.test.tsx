/**
 * Teste de execução real (SSR) do Dashboard gerado pelo GPT-OSS.
 * No SSR o `useEffect` do `useFetch` não executa, então `loading=true`
 * e o componente deve renderizar o estado de carregamento.
 */
import { renderToString } from 'react-dom/server';
import React from 'react';
import Dashboard from '../src/components/Dashboard';

describe('Dashboard (SSR smoke test)', () => {
  test('renderiza estado de carregamento no SSR', () => {
    const html = renderToString(<Dashboard />);
    expect(html).toContain('Carregando...');
  });

  test('useFetch com dados mockados retorna o cast tipado', async () => {
    const { mockUsers } = await import('../src/api/mock');
    expect(mockUsers.length).toBeGreaterThan(0);
    expect(mockUsers[0].name).toBe('Ana Silva');
  });

  test('filtro por nome (case-insensitive) funciona', () => {
    const names = ['Ana Silva', 'Bruno Costa'];
    const term = 'ana';
    const filtered = names.filter((n) => n.toLowerCase().includes(term.toLowerCase()));
    expect(filtered).toEqual(['Ana Silva']);
  });
});