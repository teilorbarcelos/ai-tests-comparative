# Tarefa: Props, eventos e estado

**ID**: frontend-03  **Categoria**: frontend
**Latencia**: 25.33s  **Tokens out**: 912  **tps**: 36.01

---

Aqui está um componente React com TypeScript que implementa um formulário de login com validações e chamada da prop `onLogin`:

```tsx
import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { email: '', password: '' };

    if (!email.includes('@')) {
      newErrors.email = 'Email inválido. Deve conter "@"';
      isValid = false;
    }

    if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onLogin(email); // Chama a prop com o email
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
      </div>

      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
```

### Explicação do código:

1. **Interface `LoginFormProps`**:
   - Define o tipo da prop `onLogin` que será chamada ao submeter o formulário com sucesso.

2. **Estados (`useState`)**:
   - `email`: Armazena o valor do campo de email.
   - `password`: Armazena o valor do campo de senha.
   - `errors`: Objeto para armazenar mensagens de erro dos campos.

3. **Função `validateForm`**:
   - Valida se o email contém "@" e se a senha tem pelo menos 6 caracteres.
   - Atualiza o estado `errors` com as mensagens de validação.
   - Retorna `true` se o formulário for válido, `false` caso contrário.

4. **Função `handleSubmit`**:
   - É chamada ao submeter o formulário (`onSubmit`).
   - Chama `validateForm()` e, se válido, executa `onLogin(email)`.

5. **Renderização**:
   - Formulário com campos de email e senha.
   - Exibição das mensagens de erro abaixo dos campos correspondentes (se existirem).
   - Botão de submit.

### Uso do componente:
```tsx
import React from 'react';
import LoginForm from './LoginForm';

const App: React.FC = () => {
  const handleLogin = (email: string) => {
    console.log('Usuário logado com email:', email);
    // Lógica adicional após login bem-sucedido
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

### Pontos importantes:
- O componente é tipado com TypeScript.
- As validações são simples, mas podem ser estendidas conforme necessário (ex: regex para email).
- A prop `onLogin` é obrigatória e deve receber uma função que aceita um parâmetro do tipo `string`.
