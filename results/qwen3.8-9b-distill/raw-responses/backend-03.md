# Tarefa: Tipos utilitÃ¡rios e genÃ©ricos

**ID**: backend-03  **Categoria**: backend
**Latencia**: 20.89s  **Tokens out**: 1867  **tps**: 89.38

---

```typescript
// ============================================
// Tipos Utilitários do TypeScript - Exemplos Práticos
// ============================================

/**
 * Interface base: Produto
 */
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  createdAt: Date;
}

// ============================================
// 1. Partial<T> - Propriedades Opcionais
// ============================================

/**
 * O que faz: Cria um tipo onde TODAS as propriedades de T são opcionais (undefined por padrão).
 * Uso prático: Formulários, requisições onde campos podem não estar preenchidos.
 */
type PartialProduct = Partial<Product>;

const novoProduto: PartialProduct = {
  name: "Novo Produto",
  // price e stock são opcionais aqui — TypeScript aceita sem erro
};

// ============================================
// 2. Pick<T, K> - Selecionar Propriedades
// ============================================

/**
 * O que faz: Cria um tipo com APENAS as propriedades de T indicadas em K.
 * Uso prático: DTOs de resposta (responder apenas o necessário ao cliente).
 */
type ProductSummary = Pick<Product, "id" | "name">;

const resumoProduto: ProductSummary = {
  id: 1,
  name: "Exemplo",
};

// ============================================
// 3. Omit<T, K> - Remover Propriedades
// ============================================

/**
 * O que faz: Cria um tipo com TODAS as propriedades de T MENOS as indicadas em K.
 * Uso prático: Enviar dados para API sem o ID (não se envia IDs na criação) ou sem campos sensíveis.
 */
type ProductCreate = Omit<Product, "id" | "createdAt">;

const criarProduto: ProductCreate = {
  name: "Meu Produto",
  price: 99.90,
  stock: 100,
};

// ============================================
// 4. Readonly<T> - Propriedades Imutáveis
// ============================================

/**
 * O que faz: Cria um tipo onde TODAS as propriedades de T são readonly (não podem ser alteradas após criação).
 * Uso prático: Interfaces de leitura, dados vindos de banco/API que não devem ser modificados.
 */
type ProductReadonly = Readonly<Product>;

const produtoImutavel: ProductReadonly = {
  id: 1,
  name: "Produto",
  price: 50,
  stock: 20,
  createdAt: new Date(),
};

// produtoImutavel.name = "Novo Nome"; // ❌ Erro de compilação!

// ============================================
// 5. ReturnType<T> - Tipo do Retorno de uma Função
// ============================================

/**
 * O que faz: Extrai o tipo de retorno de uma função (ou método).
 * Uso prático: Tipagem segura ao chamar métodos assíncronos ou funções utilitárias.
 */

function obterProdutoPorId(id: number): Product {
  return { id, name: "Exemplo", price: 0, stock: 0, createdAt: new Date() };
}

type ProdutoRetorno = ReturnType<typeof obterProdutoPorId>;

const resultado: ProdutoRetorno = obterProdutoPorId(1); // TypeScript sabe que é Product


// ============================================
// BÔNUS: Combinação de Utilitários (Omit + Partial)
// ============================================

/**
 * O que faz: Remove propriedades e torna as restantes opcionais.
 * Uso prático: Atualizar um produto sem precisar passar todos os campos.
 */
type ProductUpdate = Omit<Partial<Product>, "id" | "createdAt">;

const atualizarProduto: ProductUpdate = {
  name: "Nome Atualizado",
  price: 150,
};


// ============================================
// RESUMO VISUAL
// ============================================

interface SummaryTable {
  Utilitário: string;
  O que faz: string;
  Exemplo de uso: string;
}

const summary: SummaryTable[] = [
  {
    Utilitário: "Partial<T>",
    O que faz: "Torna todas as propriedades opcionais",
    Exemplo de uso: "Formulários, requisições parciais",
  },
  {
    Utilitário: "Pick<T, K>",
    O que faz: "Seleciona apenas algumas propriedades",
    Exemplo de uso: "DTOs de resposta (resumo)",
  },
  {
    Utilitário: "Omit<T, K>",
    O que faz: "Remove algumas propriedades",
    Exemplo de uso: "Criar produto sem ID/createdAt",
  },
  {
    Utilitário: "Readonly<T>",
    O que faz: "Torna todas as propriedades imutáveis",
    Exemplo de uso: "Dados de leitura (API, banco)",
  },
  {
    Utilitário: "ReturnType<T>",
    O que faz: "Extrai o tipo de retorno de uma função",
    Exemplo de uso: "Tipagem segura de chamadas assíncronas",
  },
];

console.log(JSON.stringify(summary, null, 2));


// ============================================
// EXEMPLO PRÁTICO COMPLETO (API Controller)
// ============================================

interface ProductController {
  // GET /products/:id → retorna apenas id e name
  getSummary: () => Promise<ProductSummary>;

  // POST /products → cria sem id e createdAt
  create: (data: ProductCreate) => Promise<Product>;

  // PUT /products/:id → atualiza parcialmente
  update: (id: number, data: ProductUpdate) => Promise<Product>;

  // GET /products → retorna lista imutável
  getAll: () => ReadonlyArray<Readonly<Product>>;
}

const controller: ProductController = {
  getSummary: async () => ({ id: 1, name: "Produto" }),
  create: async (data) => ({ ...data, id: Date.now(), createdAt: new Date() }),
  update: async (id, data) => ({ ...data, id, createdAt: new Date() }),
  getAll: () => [
    { id: 1, name: "A", price: 10, stock: 5, createdAt: new Date() },
    { id: 2, name: "B", price: 20, stock: 3, createdAt: new Date() },
  ],
};

// ✅ Tudo tipado corretamente!
```

## 📋 Resumo dos Utilitários

| Utilitário | O que faz | Quando usar |
|---|---|---|
| `Partial<T>` | Torna todas as propriedades opcionais | Formulários, requisições parciais |
| `Pick<T, K>` | Seleciona apenas algumas propriedades | DTOs de resposta, resumos |
| `Omit<T, K>` | Remove algumas propriedades | Criação (sem ID), remoção de campos sensíveis |
| `Readonly<T>` | Torna todas as propriedades imutáveis | Dados de leitura, interfaces de consumo |
| `ReturnType<T>` | Extrai o tipo de retorno de uma função | Tipagem segura de chamadas assíncronas |

## 💡 Dica Importante

A ordem importa! Se você precisar remover e tornar opcionais ao mesmo tempo:

```typescript
// ✅ Correto (Omit primeiro, depois Partial)
type Update = Omit<Partial<Product>, "id" | "createdAt">;

// ❌ Errado — Partial vem antes, então Omit não remove nada
type UpdateErroneo = Partial<Omit<Product, "id" | "createdAt">>; // id e createdAt ainda existem!
```
