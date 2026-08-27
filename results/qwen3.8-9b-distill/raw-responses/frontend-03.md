# Tarefa: Props, eventos e estado

**ID**: frontend-03  **Categoria**: frontend
**Latencia**: 20.01s  **Tokens out**: 1959  **tps**: 97.9

---

```tsx
import React, { useState } from 'react';

interface LoginFormData {
  email: string;
  senha: string;
}

interface ValidationErrors {
  email?: string;
  senha?: string;
}

type OnLoginCallback = (email: string) => void;

const LoginForm: React.FC<{ onLogin: OnLoginCallback }> = ({ onLogin }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    senha: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  // Função de validação do email (deve conter '@')
  const validateEmail = (email: string): boolean => {
    return email.includes('@');
  };

  // Função de validação da senha (mínimo 6 caracteres)
  const validateSenha = (senha: string): boolean => {
    return senha.length >= 6;
  };

  // Função para atualizar o campo específico do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Remove erro ao usuário começar a digitar novamente
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Função de submissão do formulário
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: ValidationErrors = {};

    // Validação do email
    if (!validateEmail(formData.email)) {
      newErrors.email = 'O email deve conter "@"';
    }

    // Validação da senha
    if (!validateSenha(formData.senha)) {
      newErrors.senha = 'A senha deve ter pelo menos 6 caracteres';
    }

    // Se houver erros, exibe as mensagens e não submete
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Sucesso: chama a prop onLogin com o email válido
    onLogin(formData.email);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Campo Email */}
        <div style={styles.fieldGroup}>
          <label htmlFor="email" style={styles.label}>
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            style={{
              ...styles.input,
              ...(errors.email ? styles.errorInput : {}),
            }}
          />
          {errors.email && (
            <span style={styles.errorMessage}>{errors.email}</span>
          )}
        </div>

        {/* Campo Senha */}
        <div style={styles.fieldGroup}>
          <label htmlFor="senha" style={styles.label}>
            Senha:
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            value={formData.senha}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            style={{
              ...styles.input,
              ...(errors.senha ? styles.errorInput : {}),
            }}
          />
          {errors.senha && (
            <span style={styles.errorMessage}>{errors.senha}</span>
          )}
        </div>

        {/* Botão de Submit */}
        <button type="submit" style={styles.button}>
          Entrar
        </button>
      </form>
    </div>
  );
};

// --- Estilos em linha (poderia ser movido para um arquivo CSS) ---
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '24px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  errorInput: {
    borderColor: '#e74c3c',
    backgroundColor: '#fdf2f2',
  },
  errorMessage: {
    color: '#e74c3c',
    fontSize: '12px',
    marginTop: '-6px',
    marginBottom: '8px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'background-color 0.3s ease',
  },
};

export default LoginForm;
```

## Explicação do Código

| Conceito | Descrição |
|----------|-----------|
| **Interface `LoginFormData`** | Define o tipo dos dados do formulário (email e senha). |
| **Interface `ValidationErrors`** | Define os possíveis erros de validação por campo. |
| **Tipo `OnLoginCallback`** | Define a assinatura da prop `onLogin` que recebe um email válido. |
| **Estado (`useState`)** | Mantém os valores dos campos e as mensagens de erro em tempo real. |
| **`validateEmail()`** | Verifica se o campo contém o caractere `'@'`. |
| **`validateSenha()`** | Verifica se a senha tem pelo menos 6 caracteres. |
| **`handleChange()`** | Atualiza o estado do formulário e limpa erros ao usuário digitar novamente. |
| **`handleSubmit()`** | Previne o recarregamento da página, valida ambos os campos e chama `onLogin` apenas se tudo estiver correto. |

## Como usar

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginForm from './LoginForm';

const App: React.FC = () => {
  const handleLogin = (email: string) => {
    console.log('Usuário logado com sucesso:', email);
    // Redirecionar, mostrar mensagem de sucesso, etc.
  };

  return <LoginForm onLogin={handleLogin} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

## Pontos-chave do TypeScript

- **Tipagem estrita**: Todos os estados, props e callbacks têm tipos explícitos.
- **Type Safety**: O TypeScript impede erros comuns como passar uma senha vazia para `onLogin`.
- **Inferência de tipo**: O React infere automaticamente o tipo da prop `onLogin` a partir do callback definido na interface.
