# Tarefa: Props, eventos e estado

**ID**: frontend-03  **Categoria**: frontend
**Latencia**: 88.44s  **Tokens out**: 1411  **tps**: 15.95

---

# Componente de Login com Validação (React + TypeScript)

Aqui está um componente completo e tipado:

```tsx
import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string) => void;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.includes('@')) {
      newErrors.email = 'Informe um email válido (ex: usuario@exemplo.com).';
    }

    if (password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validate()) {
      onLogin(email);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Entrar</h2>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" role="alert" style={{ color: 'red' }}>
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <p id="password-error" role="alert" style={{ color: 'red' }}>
            {errors.password}
          </p>
        )}
      </div>

      <button type="submit">Entrar</button>
    </form>
  );
};

export default LoginForm;
```

## Exemplo de uso

```tsx
import React from 'react';
import LoginForm from './LoginForm';

const App: React.FC = () => {
  const handleLogin = (email: string) => {
    console.log(`Login realizado com o email: ${email}`);
    // Ex.: redirecionar, armazenar token, etc.
  };

  return <LoginForm onLogin={handleLogin} />;
};

export default App;
```

## Pontos importantes do código

1. **Tipagem das props** — `LoginFormProps` define a assinatura de `onLogin(email: string): void`, garantindo que quem usa o componente passe uma função compatível.

2. **Estado tipado** — `useState<string>('')` para os campos e um tipo `FormErrors` com propriedades opcionais (`email?`, `password?`), refletindo que erros podem não existir.

3. **Validação centralizada** — a função `validate()` retorna `true` apenas quando não há erros, permitindo reutilizar a lógica e manter o handler de submit limpo.

4. **Mensagens de erro por campo** — cada erro é exibido próximo ao seu input, com `role="alert"` e atributos `aria-invalid`/`aria-describedby` para acessibilidade (leitores de tela anunciam os erros).

5. **`noValidate` no form** — evita que o navegador mostre validação nativa do `type="email"`, garantindo que a lógica de validação seja controlada pelo componente.

6. **Limpeza dos erros** — se quiser limpar um erro assim que o usuário digitar novamente, basta chamar `setErrors(prev => ({ ...prev, email: undefined }))` no `onChange` do campo correspondente.

## Possíveis melhorias

- Validar formato de email mais rigoroso com regex ou uma biblioteca como `validator`/`zod`.
- Usar um schema de validação (ex.: **Zod** + React Hook Form) para formulários maiores.
- Limpar erros individuais ao digitar, em vez de esperar o submit.

Se quiser, posso adaptar isso para usar **React Hook Form** ou **Formik** com Zod, que são mais robustos para formulários complexos.
