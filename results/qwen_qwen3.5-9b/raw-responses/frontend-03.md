# Tarefa: Props, eventos e estado

**ID**: frontend-03  **Categoria**: frontend
**Latencia**: 20.9s  **Tokens out**: 1624  **tps**: 77.72

---

# Componente React de Login com Validação em TypeScript

Abaixo está um exemplo completo de um componente `LoginForm` desenvolvido com React, TypeScript e validações conforme solicitado. O código inclui tipagem explícita, tratamento de erros e chamadas à função `onLogin`.

```tsx
import React, { useState } from 'react';

// Definição do tipo da prop onLogin
interface LoginFormProps {
  onLogin: (email: string) => void;
}

// Interface para os estados do formulário
interface FormState {
  email: string;
  password: string;
  emailError?: string;
  passwordError?: string;
}

// Componente de Login com Validação
const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
  });

  // Função para atualizar o estado do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      emailError: undefined,
      passwordError: undefined,
    }));
  };

  // Função de validação do formulário
  const validateForm = (): boolean => {
    let isValid = true;

    // Validação do email (deve conter '@')
    if (!form.email.includes('@')) {
      setForm((prev) => ({
        ...prev,
        emailError: 'O email deve conter o símbolo "@"',
      }));
      isValid = false;
    }

    // Validação da senha (mínimo 6 caracteres)
    if (form.password.length < 6) {
      setForm((prev) => ({
        ...prev,
        passwordError: 'A senha deve ter pelo menos 6 caracteres',
      }));
      isValid = false;
    }

    return isValid;
  };

  // Função de submit do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onLogin(form.email);
    }
  };

  // Estilos inline para o componente
  const styles = {
    container: {
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#333',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
      color: '#555',
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    error: {
      color: '#d32f2f',
      fontSize: '12px',
      marginTop: '5px',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontSize: '16px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            placeholder="seu@email.com"
          />
          {form.emailError && (
            <div style={styles.error}>{form.emailError}</div>
          )}
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            placeholder="Digite sua senha"
          />
          {form.passwordError && (
            <div style={styles.error}>{form.passwordError}</div>
          )}
        </div>

        <button type="submit" style={styles.button}>
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
```

## Exemplo de Uso

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginForm from './LoginForm';

const App: React.FC = () => {
  const handleLogin = (email: string) => {
    console.log('Usuário logado com sucesso:', email);
    alert(`Bem-vindo, ${email}!`);
  };

  return <LoginForm onLogin={handleLogin} />;
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
```

## Explicação do Código

- **Tipagem**: Todos os estados, props e eventos são tipados com TypeScript para garantir segurança e clareza.
- **Validação**: O email deve conter `'@'` e a senha deve ter no mínimo 6 caracteres. Erros são exibidos em tempo real.
- **Feedback Visual**: Mensagens de erro aparecem abaixo dos campos correspondentes.
- **Estilização**: Estilos inline para facilitar a visualização, mas podem ser substituídos por CSS externo ou módulos como Styled Components.
- **Separação de Responsabilidades**: A lógica de validação e manipulação de estado está separada da renderização do HTML.

Este componente é modular, fácil de testar e pode ser integrado em qualquer aplicação React com TypeScript.
