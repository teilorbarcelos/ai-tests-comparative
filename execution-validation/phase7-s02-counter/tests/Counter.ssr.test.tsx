/**
 * Teste de execução real (SSR) do componente Counter gerado pelo GPT-OSS.
 * `useLocalStorage` guarda `window`/`localStorage`, então no SSR cai no fallback
 * `initialValue` (0) e renderiza o estado inicial do reducer + histórico.
 */
import { renderToString } from 'react-dom/server';
import React from 'react';
import { Counter } from '../src/components/Counter';

describe('Counter (SSR smoke test)', () => {
  test('renderiza contador com estado inicial 0', () => {
    const html = renderToString(<Counter />);
    expect(html).toContain('Contador');
    expect(html).toContain('Histórico');
    expect(html).toContain('>0</p>');
  });

  test('renderiza botões de ação', () => {
    const html = renderToString(<Counter />);
    expect(html).toContain('>+</button>');
    expect(html).toContain('>-</button>');
    expect(html).toContain('Reset');
  });
});