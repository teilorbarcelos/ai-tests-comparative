# Tarefa: Props, eventos e estado

**ID**: frontend-03  **Categoria**: frontend
**Latencia**: 8.32s  **Tokens out**: 1423  **tps**: 171.08

---

## 📦 Componente de Login – React + TypeScript

```tsx
/* src/components/LoginForm.tsx */
import React, { useState, FormEvent } from 'react';

/**
 * Props do componente.
 *
 * - onLogin: função que será chamada quando o usuário for autenticado com sucesso.
 */
export interface LoginFormProps {
  /** Callback executado em caso de login bem‑sucedido. Recebe apenas o e‑mail. */
  onLogin: (email: string) => void;
}

/**
 * Estado interno do formulário.
 *
 * - email: valor atual do campo “E‑mail”.
 * - password: valor atual do campo “Senha”.
 * - errors: mensagens de erro associadas a cada campo.
 */
interface FormState {
  email: string;
  password: string;
  errors: {
    email?: string;
    password?: string;
  };
}

/**
 * Componente funcional que renderiza um formulário de login simples
 * com validação básica (e‑mail contendo “@” e senha com no mínimo 6 caracteres).
 *
 * @param props - Props do componente.
 */
const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  // Estado inicial
  const [state, setState] = useState<FormState>({
    email: '',
    password: '',
    errors: {},
  });

  /**
   * Atualiza o valor de um campo do formulário.
   *
   * @param field - Nome do campo (`email` ou `password`)
   * @param value - Novo valor
   */
  const handleChange = (
    field: keyof Pick<FormState, 'email' | 'password'>,
    value: string
  ) => {
    setState((prev) => ({
      ...prev,
      [field]: value,
      // Limpa a mensagem de erro do campo que está sendo editado
      errors: { ...prev.errors, [field]: undefined },
    }));
  };

  /**
   * Valida os campos e retorna um objeto com mensagens de erro.
   *
   * @returns Objeto contendo erros (se houver). Se vazio → validação passou.
   */
  const validate = (): FormState['errors'] => {
    const errors: FormState['errors'] = {};

    if (!state.email.includes('@')) {
      errors.email = 'E‑mail inválido. Deve conter “@”.';
    }

    if (state.password.length < 6) {
      errors.password = 'Senha deve ter no mínimo 6 caracteres.';
    }

    return errors;
  };

  /**
   * Manipulador de submissão do formulário.
   *
   * @param e Evento de submit
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      // Se houver erros, atualiza o estado para exibir as mensagens
      setState((prev) => ({ ...prev, errors }));
      return;
    }

    // Caso não haja erros → login bem‑sucedido
    onLogin(state.email);

    // Opcional: limpa o formulário após sucesso
    setState({
      email: '',
      password: '',
      errors: {},
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Campo de E‑mail */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="email" style={{ display: 'block', fontWeight: 'bold' }}>
          E‑mail
        </label>
        <input
          id="email"
          type="email"
          value={state.email}
          onChange={(e) => handleChange('email', e.target.value)}
          style={{
            width: '100%',
            padding: '.5rem',
            borderColor: state.errors.email ? 'red' : '#ccc',
          }}
        />
        {state.errors.email && (
          <p style={{ color: 'red', marginTop: '.25rem' }}>
            {state.errors.email}
          </p>
        )}
      </div>

      {/* Campo de Senha */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="password" style={{ display: 'block', fontWeight: 'bold' }}>
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={state.password}
          onChange={(e) => handleChange('password', e.target.value)}
          style={{
            width: '100%',
            padding: '.5rem',
            borderColor: state.errors.password ? 'red' : '#ccc',
          }}
        />
        {state.errors.password && (
          <p style={{ color: 'red', marginTop: '.25rem' }}>
            {state.errors.password}
          </p>
        )}
      </div>

      {/* Botão de envio */}
      <button type="submit" style={{ padding: '.75rem 1.5rem' }}>
        Entrar
      </button>
    </form>
  );
};

export default LoginForm;
```

### Como usar

```tsx
/* src/App.tsx */
import React from 'react';
import LoginForm, { LoginFormProps } from './components/LoginForm';

const App: React.FC = () => {
  const handleLogin: LoginFormProps['onLogin'] = (email) => {
    console.log('Usuário logado:', email);
    // Aqui você pode chamar sua API de autenticação ou redirecionar o usuário
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h1>Login</h1>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default App;
```

### O que o componente faz

| Função | Descrição |
|--------|-----------|
| **Validação** | Verifica se o e‑mail contém “@” e se a senha tem ≥ 6 caracteres. |
| **Mensagens de erro** | Exibe mensagens em vermelho abaixo dos campos quando a validação falha. |
| **Callback `onLogin`** | Quando tudo estiver correto, chama `props.onLogin(email)` com o e‑mail informado. |
| **Tipagem completa** | Todos os tipos (`string`, `FormState`, `LoginFormProps`) estão explicitamente definidos para garantir segurança de tipo em tempo de compilação. |

Pronto! Agora você tem um componente de login funcional, tipado e pronto para ser integrado ao seu projeto React + TypeScript.
