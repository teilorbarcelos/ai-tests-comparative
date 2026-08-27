# Tarefa: Props, eventos e estado

**ID**: frontend-03  **Categoria**: frontend
**Latencia**: 69.65s  **Tokens out**: 1025  **tps**: 14.72

---

Abaixo está um componente React com TypeScript que implementa um formulário de login com os seguintes requisitos:

- Campos para **email** e **senha**
- Validação:
  - Email deve conter o caractere `@`
  - Senha deve ter pelo menos 6 caracteres
- Exibe mensagens de erro caso as validações falhem
- Chama a função `onLogin(email: string)` passando o email válido, se todas as validações forem bem-sucedidas

---

### ✅ Código Completo Tipado com React + TypeScript:

```tsx
import React, { useState } from 'react';

// Tipo para os estados do formulário
interface FormData {
  email: string;
  password: string;
}

// Tipo para erros de validação
interface FormErrors {
  email?: string;
  password?: string;
}

// Componente principal
const LoginForm: React.FC<{
  onLogin: (email: string) => void;
}> = ({ onLogin }) => {
  // Estado do formulário
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });

  // Estado para erros de validação
  const [errors, setErrors] = useState<FormErrors>({});

  // Função para atualizar os campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Função de validação dos dados
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.includes('@')) {
      newErrors.email = 'O email deve conter o caractere "@"';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função de submissão do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin(formData.email); // Chama a função passada como prop
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
      </div>

      <button type="submit">Entrar</button>
    </form>
  );
};

export default LoginForm;
```

---

### 📌 Explicação do Código

- **Tipos (`FormData` e `FormErrors`)**
  - Definem a estrutura dos dados do formulário e das mensagens de erro.
  
- **Estado (`useState<FormData>` e `useState<FormErrors>`)**
  - Armazena os valores digitados pelo usuário e as mensagens de validação.

- **Função `handleChange`**
  - Atualiza o estado quando o usuário digita no formulário.

- **Função `validateForm`**
  - Valida se o email contém `@` e se a senha tem pelo menos 6 caracteres.
  - Retorna `true` se todas as validações passarem, caso contrário, define os erros correspondentes.

- **Função `handleSubmit`**
  - Previne o comportamento padrão do formulário.
  - Chama `validateForm()` e, se for válida, chama a função `onLogin(email)` passando o email digitado.

---

### 📦 Como Usar

```tsx
import React from 'react';
import LoginForm from './LoginForm';

const App: React.FC = () => {
  const handleLogin = (email: string) => {
    console.log('Usuário logado com email:', email);
    // Aqui você pode fazer uma requisição de login real
  };

  return (
    <div>
      <h1>Login</h1>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default App;
```

---

Se quiser, posso também adicionar validação com `React Hook Form` ou `Formik`, mas este código é simples e suficiente para a maioria dos casos básicos.
