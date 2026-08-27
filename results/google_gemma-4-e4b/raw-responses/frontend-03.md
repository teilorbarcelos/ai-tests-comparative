# Tarefa: Props, eventos e estado

**ID**: frontend-03  **Categoria**: frontend
**Latencia**: 29.28s  **Tokens out**: 2941  **tps**: 100.43

---

Este é um cenário clássico de desenvolvimento front-end onde a tipagem forte do TypeScript garante que os dados e as interações entre componentes sejam previsíveis e robustas.

Abaixo está o código completo, incluindo o componente `LoginForm`, suas interfaces tipadas e um exemplo de como utilizá-lo em um componente pai (`App`).

### 📁 Estrutura dos Arquivos (Exemplo)
```
src/
├── components/
│   └── LoginForm.tsx  <-- Nosso componente principal
└── App.tsx            <-- Exemplo de uso
```

---

### 💻 Código Completo

#### `components/LoginForm.tsx`

Este é o componente do formulário, responsável pela lógica de estado, validação e comunicação com o componente pai via props.

```tsx
import React, { useState, FormEvent } from 'react';

// 1. Definição das Interfaces (Tipagem Forte)
interface LoginFormProps {
  /** Função chamada ao sucesso do login, recebendo apenas o email. */
  onLogin: (email: string) => void;
}

// Tipos para o estado do formulário e erros
interface FormDataState {
  email: string;
  password: string;
}

interface ErrorState {
  [key: string]: string | undefined; // Mapeia 'email' ou 'password' para uma mensagem de erro
}


/**
 * Componente de Formulário de Login.
 * @param props - Contém a função onLogin para ser chamada em caso de sucesso.
 */
const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  // 2. Gerenciamento de Estado
  const [formData, setFormData] = useState<FormDataState>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<ErrorState>({});

  /**
   * Handler genérico para mudanças nos campos do formulário.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Opcional: Limpar o erro do campo assim que o usuário começa a digitar novamente
    if (errors[name as keyof FormDataState]) {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    }
  };

  /**
   * Função de validação centralizada. Retorna true se for válido, false caso contrário.
   */
  const validateForm = (): boolean => {
    let newErrors: ErrorState = {};
    let isValid = true;

    // Validação do Email
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Por favor, insira um email válido (ex: usuario@dominio.com).';
      isValid = false;
    }

    // Validação da Senha
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'A senha deve ter no mínimo 6 caracteres.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };


  /**
   * Handler de submissão do formulário.
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página

    if (validateForm()) {
      // Se for válido, chama a prop onLogin e limpa os erros
      setErrors({}); 
      onLogin(formData.email);
      
      // Opcional: Limpar o formulário após sucesso
      setFormData({ email: '', password: '' });

    } else {
      console.log('Falha na validação do formulário.');
    }
  };


  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        
        {/* Campo Email */}
        <div style={styles.inputGroup}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
          {/* Exibição da Mensagem de Erro */}
          {errors.email && <p style={styles.errorText}>{errors.email}</p>}
        </div>

        {/* Campo Senha */}
        <div style={styles.inputGroup}>
          <label htmlFor="password">Senha:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
          {/* Exibição da Mensagem de Erro */}
          {errors.password && <p style={styles.errorText}>{errors.password}</p>}
        </div>

        <button type="submit" style={styles.button}>
          Entrar
        </button>
      </form>
    </div>
  );
};

// Estilos básicos para visualização (em um projeto real, use CSS Modules ou Styled Components)
const styles: { [key: string]: React.CSSProperties } = {
    container: { 
        maxWidth: '400px', 
        margin: '50px auto', 
        padding: '20px', 
        border: '1px solid #ccc', 
        borderRadius: '8px' 
    },
    form: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px' 
    },
    inputGroup: { 
        display: 'flex', 
        flexDirection: 'column' 
    },
    input: { 
        padding: '10px', 
        border: '1px solid #ddd', 
        borderRadius: '4px', 
        marginTop: '5px' 
    },
    errorText: { 
        color: '#d9534f', // Vermelho de erro
        fontSize: '0.8em', 
        marginTop: '5px' 
    },
    button: { 
        padding: '10px 20px', 
        backgroundColor: '#007bff', 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px', 
        cursor: 'pointer' 
    }
};

export default LoginForm;
```

#### `App.tsx` (Exemplo de Uso)

Este componente pai demonstra como o `LoginForm` é utilizado e como a prop `onLogin` captura os dados após um login bem-sucedido.

```tsx
import React, { useState } from 'react';
import LoginForm from './components/LoginForm'; // Ajuste o caminho conforme sua estrutura

const App: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  /**
   * Função que será passada como prop para o LoginForm.
   * Ela é chamada quando a validação e submissão são bem-sucedidas no filho.
   */
  const handleSuccessfulLogin = (email: string) => {
    setLoggedInUser(email);
    console.log(`✅ Login bem-sucedido para: ${email}`);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Sistema de Autenticação</h1>
      
      {loggedInUser ? (
        <div style={{ border: '1px solid green', padding: '20px', backgroundColor: '#e6ffe6' }}>
          <h2>Bem-vindo(a), {loggedInUser}!</h2>
          <p>Você está logado com sucesso.</p>
          <button onClick={() => setLoggedInUser(null)}>Sair</button>
        </div>
      ) : (
        // Passamos a função handleSuccessfulLogin como prop 'onLogin'
        <LoginForm onLogin={handleSuccessfulLogin} />
      )}
    </div>
  );
};

export default App;
```

### 💡 Explicações Detalhadas

1.  **Tipagem de Props (`interface LoginFormProps`)**:
    *   Definimos explicitamente que o componente `LoginForm` espera uma prop chamada `onLogin`.
    *   O tipo dessa função é `(email: string) => void`, garantindo que ela deve aceitar um argumento do tipo `string` (o email) e não retorna nada (`void`).

2.  **Tipagem de Estado (`useState`)**:
    *   Usamos interfaces como `FormDataState` e `ErrorState` para garantir que o estado interno (`formData` e `errors`) sempre mantenha a estrutura correta (ex: `errors` é um objeto onde as chaves são nomes de campos).

3.  **Validação Centralizada (`validateForm`)**:
    *   A função `validateForm` encapsula toda a lógica de negócio. Ela verifica se o email contém `@` e se a senha tem comprimento `>= 6`.
    *   Em vez de apenas retornar `true`/`false`, ela também **atualiza o estado `errors`** com as mensagens específicas, permitindo que o JSX exiba os erros corretamente.

4.  **Fluxo de Submissão (`handleSubmit`)**:
    *   Ao submeter, chamamos `validateForm()`.
    *   Se a validação for bem-sucedida (retorna `true`), limpamos quaisquer erros antigos e **chamamos a prop `onLogin(formData.email)`**. Este é o mecanismo de comunicação do componente filho para o pai.

5.  **Renderização Condicional**:
    *   No JSX, usamos `{errors.email && <p>...</p>}`. Isso garante que a mensagem de erro só será renderizada se houver um valor definido no estado `errors` para aquele campo específico.
