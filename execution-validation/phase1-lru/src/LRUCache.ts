/**
 * LRU Cache implementado pelo GPT-OSS 20B (tarefa s07 do teste de estresse).
 * Copiado literalmente da resposta crua para validar se funciona/builda/testa.
 */
export class LRUCache<K, V> {
  private readonly capacity: number;
  private readonly map = new Map<K, Node<K, V>>();
  private head: Node<K, V> | null = null;
  private tail: Node<K, V> | null = null;

  constructor(capacity: number) {
    if (capacity <= 0)
      throw new Error('Capacity must be greater than zero');
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    const node = this.map.get(key);
    if (!node) return undefined;
    this.moveToHead(node);
    return node.value;
  }

  put(key: K, value: V): void {
    const existing = this.map.get(key);
    if (existing) {
      existing.value = value;
      this.moveToHead(existing);
      return;
    }

    const node = new Node(key, value);
    if (this.map.size >= this.capacity) {
      this.evictLRU();
    }

    this.addToHead(node);
    this.map.set(key, node);
  }

  private evictLRU(): void {
    if (!this.tail) return;
    const key = this.tail.key;
    this.removeNode(this.tail);
    this.map.delete(key);
  }

  private moveToHead(node: Node<K, V>): void {
    if (node === this.head) return;
    this.removeNode(node);
    this.addToHead(node);
  }

  private removeNode(node: Node<K, V>): void {
    const { prev, next } = node;
    if (prev) prev.next = next;
    else this.head = next;
    if (next) next.prev = prev;
    else this.tail = prev;
    node.prev = null;
    node.next = null;
  }

  private addToHead(node: Node<K, V>): void {
    node.next = this.head;
    if (this.head) this.head.prev = node;
    this.head = node;
    if (!this.tail) this.tail = node;
  }
}

class Node<K, V> {
  prev: Node<K, V> | null = null;
  next: Node<K, V> | null = null;
  constructor(public key: K, public value: V) {}
}
