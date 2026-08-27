import { LRUCache } from '../src/LRUCache';

describe('LRUCache', () => {
  test('inserção simples e acesso', () => {
    const cache = new LRUCache<string, number>(3);
    cache.put('a', 1);
    cache.put('b', 2);
    expect(cache.get('a')).toBe(1);
    expect(cache.get('c')).toBeUndefined();
  });

  test('evicção LRU quando excede capacidade', () => {
    const cache = new LRUCache<string, string>(2);
    cache.put('x', 'X');
    cache.put('y', 'Y');
    expect(cache.get('x')).toBe('X');
    cache.put('z', 'Z');
    expect(cache.get('y')).toBeUndefined();
    expect(cache.get('x')).toBe('X');
    expect(cache.get('z')).toBe('Z');
  });

  test('atualização de valor mantém ordem LRU', () => {
    const cache = new LRUCache<number, string>(2);
    cache.put(1, 'one');
    cache.put(2, 'two');
    cache.put(1, 'ONE');
    expect(cache.get(1)).toBe('ONE');
    cache.put(3, 'three');
    expect(cache.get(2)).toBeUndefined();
    expect(cache.get(1)).toBe('ONE');
    expect(cache.get(3)).toBe('three');
  });

  test('capacidade zero lança erro', () => {
    expect(() => new LRUCache<string, number>(0)).toThrow(
      'Capacity must be greater than zero'
    );
  });
});
