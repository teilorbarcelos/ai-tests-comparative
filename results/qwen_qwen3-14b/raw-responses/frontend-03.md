# Tarefa: Props, eventos e estado

**ID**: frontend-03  **Categoria**: frontend
**Latencia**: 106.89s  **Tokens out**: 1787  **tps**: 16.72

---

```tsx
import React, { useState } from 'react';

// Tipos para os estados do formulário
interface FormState {
  email: string;
  password: string;
}

interface ErrorState {
  emailError?: string;
  passwordError?: string;
}

// Componente principal de login
const LoginForm: React.FC<{
  onLogin: (email: string) => void;
}> = ({ onLogin }) => {
  // Estados do formulário e erros
  const [form, setForm] = useState<FormState>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<ErrorState>({});

  // Função para lidar com mudanças nos campos
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    
    setForm({
      ...form,
      [name]: value
    });
    
    // Limpar erro específico ao digitar
    if (errors[name as keyof ErrorState]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };

  // Função de validação do formulário
  const validateForm = (): boolean => {
    const newErrors: ErrorState = {};
    
    // Validação do email
    if (!form.email.includes('@')) {
      newErrors.emailError = 'O e-mail deve conter o caractere "@"';
    }
    
    // Validação da senha
    if (form.password.length < 6) {
      newErrors.passwordError = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função de submissão do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onLogin(form.email);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      
      {/* Campo de e-mail */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 mb-2">
          E-mail
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded ${
            errors.emailError ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.emailError && (
          <p className="mt-1 text-sm text-red-500">{errors.emailError}</p>
        )}
      </div>

      {/* Campo de senha */}
      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 mb-2">
          Senha
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded ${
            errors.passwordError ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.passwordError && (
          <p className="mt-1 text-sm text-red-500">{errors.passwordError}</p>
        )}
      </div>

      {/* Botão de submissão */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Entrar
      </button>
    </form>
  );
};

export default LoginForm;
```

### Explicação do Código:

1. **Tipagem**:
   - Defini interfaces `FormState` e `ErrorState` para tipar os estados do formulário e das validações.
   - O componente recebe a prop `onLogin` com tipo `(email: string) => void`.

2. **Estados**:
   - `form`: Armazena os valores dos campos (e-mail e senha).
   - `errors`: Armazena mensagens de erro para cada campo.

3. **Validação**:
   - A função `validateForm` verifica se o e-mail contém "@" e se a senha tem pelo menos 6 caracteres.
   - Se houver erros, atualiza o estado `errors`.

4. **Manipulação de Eventos**:
   - `handleChange`: Atualiza os valores dos campos e limpa erros ao digitar.
   - `handleSubmit`: Previne o comportamento padrão do formulário, valida e chama `onLogin` se válido.

5. **Interface do Usuário**:
   - Exibe mensagens de erro em vermelho quando houver validações falhadas.
   - Estiliza os campos com bordas vermelhas em caso de erro e foco azul ao interagir.

### Como Usar:

```tsx
import React from 'react';
import LoginForm from './LoginForm';

const App: React.FC = () => {
  const handleLogin = (email: string) => {
    console.log('Usuário logado com e-mail:', email);
    // Aqui você pode adicionar a lógica de autenticação real
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default App;
```

Este componente é totalmente tipado com TypeScript, fornece feedback visual para erros de validação e segue boas práticas de desenvolvimento React.
