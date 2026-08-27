import { groupBy } from '../src/groupBy';

describe('groupBy', () => {
  test('agrupa por chave string', () => {
    const items = [
      { id: 1, name: 'Smartphone', category: 'electronics' },
      { id: 2, name: 'T-Shirt', category: 'clothing' },
      { id: 3, name: 'Laptop', category: 'electronics' },
    ];
    const grouped = groupBy(items, (p) => p.category);
    expect(grouped.get('electronics')).toHaveLength(2);
    expect(grouped.get('clothing')).toHaveLength(1);
  });

  test('preserva a ordem de inserção das chaves', () => {
    const grouped = groupBy(['a', 'b', 'c'], (x) => x);
    expect(Array.from(grouped.keys())).toEqual(['a', 'b', 'c']);
  });

  test('aceita chave numérica', () => {
    const grouped = groupBy([1, 2, 3, 4], (n) => n % 2);
    expect(grouped.get(0)).toEqual([2, 4]);
    expect(grouped.get(1)).toEqual([1, 3]);
  });

  test('agrupa por chave de objeto (referência)', () => {
    const k1 = { x: 1 };
    const k2 = { x: 2 };
    const grouped = groupBy(
      [
        { k: k1, v: 'a' },
        { k: k2, v: 'b' },
        { k: k1, v: 'c' },
      ],
      (i) => i.k
    );
    expect(grouped.get(k1)).toHaveLength(2);
    expect(grouped.get(k2)).toHaveLength(1);
  });

  test('array vazio retorna Map vazio', () => {
    const grouped = groupBy<number, string>([], (n) => String(n));
    expect(grouped.size).toBe(0);
  });
});