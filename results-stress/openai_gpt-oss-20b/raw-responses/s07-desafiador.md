# Tarefa: Algoritmo e estrutura de dados com testes

**ID**: s07-desafiador  **Categoria**: backend
**Latencia**: 10.14s  **Tokens out**: 1776  **tps**: 175.23

---

## 1️⃣ Implementação em **TypeScript**

A estrutura que vamos criar combina:

| Estrutura | Por quê? |
|-----------|----------|
| `Map<K, Node>` | Permite acesso direto (`O(1)`) a qualquer chave e mantém a ordem de inserção/uso. |
| Lista duplamente ligada (Node → prev / next) | Mantém a ordem LRU (mais recente no início, mais antigo no fim). Operações de remoção/adição são `O(1)` quando temos o ponteiro do nó. |

```ts
// src/LRUCache.ts
export class LRUCache<K, V> {
  /** tamanho máximo permitido */
  private readonly capacity: number;

  /** mapa que associa a chave ao nó da lista duplamente ligada */
  private readonly map = new Map<K, Node<K, V>>();

  /** cabeça (mais recente) e cauda (menos recente) da lista */
  private head: Node<K, V> | null = null;
  private tail: Node<K, V> | null = null;

  constructor(capacity: number) {
    if (capacity <= 0)
      throw new Error('Capacity must be greater than zero');
    this.capacity = capacity;
  }

  /* ---------- API pública ---------- */

  /** Retorna o valor associado à chave ou `undefined` se não existir. */
  get(key: K): V | undefined {
    const node = this.map.get(key);
    if (!node) return undefined;

    // Move o nó para a cabeça (mais recente)
    this.moveToHead(node);

    return node.value;
  }

  /** Insere ou atualiza um par chave‑valor. */
  put(key: K, value: V): void {
    const existing = this.map.get(key);
    if (existing) {
      // Atualiza valor e move para a cabeça
      existing.value = value;
      this.moveToHead(existing);
      return;
    }

    // Cria novo nó
    const node = new Node(key, value);

    // Se exceder capacidade, remove o LRU (cauda)
    if (this.map.size >= this.capacity) {
      this.evictLRU();
    }

    // Insere na cabeça e no mapa
    this.addToHead(node);
    this.map.set(key, node);
  }

  /* ---------- Métodos auxiliares privados ---------- */

  /** Remove o nó da cauda (menos recente). */
  private evictLRU(): void {
    if (!this.tail) return; // nada a remover

    const key = this.tail.key;
    this.removeNode(this.tail);

    this.map.delete(key);
  }

  /** Move um nó já existente para a cabeça. */
  private moveToHead(node: Node<K, V>): void {
    if (node === this.head) return; // já é o mais recente

    this.removeNode(node);
    this.addToHead(node);
  }

  /** Remove um nó da lista duplamente ligada. */
  private removeNode(node: Node<K, V>): void {
    const { prev, next } = node;

    if (prev) prev.next = next;
    else this.head = next; // era a cabeça

    if (next) next.prev = prev;
    else this.tail = prev; // era a cauda

    node.prev = null;
    node.next = null;
  }

  /** Insere um nó na posição de cabeça. */
  private addToHead(node: Node<K, V>): void {
    node.next = this.head;
    if (this.head) this.head.prev = node;

    this.head = node;
    if (!this.tail) this.tail = node; // primeira inserção
  }
}

/** Nó da lista duplamente ligada. */
class Node<K, V> {
  prev: Node<K, V> | null = null;
  next: Node<K, V> | null = null;

  constructor(public key: K, public value: V) {}
}
```

### 📌 Como funciona

| Operação | Passos | Complexidade |
|----------|--------|--------------|
| `get(key)` | 1. Busca no `Map`. <br>2. Se encontrado, move nó para a cabeça. | **O(1)** (acesso ao mapa + remoção/adição na lista). |
| `put(key, value)` | 1. Se chave já existe: atualiza valor e move para a cabeça.<br>2. Caso contrário:<br>&nbsp;&nbsp;a) Se capacidade cheia → remove cauda.<br>&nbsp;&nbsp;b) Cria nó, insere na cabeça e no mapa. | **O(1)** (todos os passos são operações de ponteiro ou `Map`). |

---

## 2️⃣ Testes unitários com Jest

```ts
// tests/LRUCache.test.ts
import { LRUCache } from '../src/LRUCache';

describe('LRUCache', () => {
  test('inserção simples e acesso', () => {
    const cache = new LRUCache<string, number>(3);
    cache.put('a', 1);
    cache.put('b', 2);

    expect(cache.get('a')).toBe(1); // acessa 'a' → torna‑se mais recente
    expect(cache.get('c')).toBeUndefined(); // chave inexistente
  });

  test('evicção LRU quando excede capacidade', () => {
    const cache = new LRUCache<string, string>(2);
    cache.put('x', 'X');
    cache.put('y', 'Y');

    // Acessa 'x' para torná‑lo mais recente
    expect(cache.get('x')).toBe('X');

    // Inserir terceiro item força a remoção do LRU ('y')
    cache.put('z', 'Z');

    expect(cache.get('y')).toBeUndefined(); // foi evictado
    expect(cache.get('x')).toBe('X');
    expect(cache.get('z')).toBe('Z');
  });

  test('atualização de valor mantém ordem LRU', () => {
    const cache = new LRUCache<number, string>(2);
    cache.put(1, 'one');
    cache.put(2, 'two');

    // Atualiza chave 1
    cache.put(1, 'ONE');

    expect(cache.get(1)).toBe('ONE'); // valor atualizado

    // Inserir novo item força evicção do LRU (chave 2)
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
```

### Como rodar os testes

```bash
# Instale as dependências (caso ainda não tenha)
npm install --save-dev jest ts-jest @types/jest typescript

# Configure o Jest em `jest.config.js`
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};

# Execute os testes
npx jest
```

---

## 3️⃣ Complexidade de Tempo

| Operação | Complexidade |
|----------|--------------|
| `get` | **O(1)** – acesso direto ao mapa + atualização da lista. |
| `put` | **O(1)** – inserção/atualização no mapa e manipulação de ponteiros na lista. |

A estrutura mantém a ordem LRU em tempo constante, garantindo que tanto leitura quanto escrita sejam eficientes independentemente do tamanho do cache.

---

## 4️⃣ Resumo

- **Map** fornece acesso direto (`O(1)`) às entradas.
- **Lista duplamente ligada** permite mover nós para a cabeça ou remover da cauda em `O(1)`.
- A combinação garante que tanto `get` quanto `put` sejam operações de tempo constante, enquanto a memória usada é proporcional à capacidade definida.

Pronto! Agora você tem um cache LRU completo, tipado e testado. 🚀
