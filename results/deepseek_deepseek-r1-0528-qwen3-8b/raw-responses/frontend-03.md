# Tarefa: Props, eventos e estado

**ID**: frontend-03  **Categoria**: frontend
**Latencia**: 25.63s  **Tokens out**: 2156  **tps**: 84.13

---


Aqui está um componente React completo com TypeScript que atende aos requisitos solicitados:

```tsx
import { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  // Estados para os campos e validações
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Função de tratamento do envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos vazios
    if (!formData.email.trim()) {
      setErrors({ email: 'Email é obrigatório' });
      return;
    }
    
    if (!formData.password.trim()) {
      setErrors({ password: 'Senha é obrigatória' });
      return;
    }

    // Validação específica de '@'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors({ email: 'Email inválido. Deve conter um "@" válido.' });
      return;
    }

    // Validação de comprimento mínimo da senha
    if (formData.password.length < 6) {
      setErrors({ password: 'Senha deve ter pelo menos 6 caracteres' });
      return;
    }

    // Se passar por todas as validações, chama o callback com email válido
    onLogin(formData.email);
    
    // Limpa os campos após login bem-sucedido
    setFormData({
      email: '',
      password: ''
    });

    // Reseta erros após sucesso
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {/* Campo Email */}
      <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
        <label htmlFor="email">Email</label>
        <input 
          type="text"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          placeholder="Digite seu email" 
          className={`form-control ${errors.email ? 'invalid' : ''}`}
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>

      {/* Campo Senha */}
      <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
        <label htmlFor="password">Senha</label>
        <input 
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          placeholder="Digite sua senha" 
          className={`form-control ${errors.password ? 'invalid' : ''}`}
        />
        {errors.password && <div className="error-message">{errors.password}</div>}
      </div>

      {/* Botão de envio */}
      <button type="submit" className="btn btn-primary">Entrar</button>
    </form>
  );
};
```

Este componente inclui:

1. Validação completa do email:
   - Campo não pode estar vazio
   - Deve seguir formato padrão de email (contendo '@' e um domínio válido)
   - Mensagem específica para cada tipo de erro

2. Validação da senha:
   - Campo não pode estar vazio
   - Deve ter pelo menos 6 caracteres

3. Feedback visual claro com classes CSS básicas:
   ```css
   .login-form {
     max-width: 400px;
     margin: auto;
   }
   
   .form-group.has-error input.form-control {
     border-color: #dc3545;
   }
   
   .error-message {
     color: #dc3545;
     font-size: 14px;
     margin-top: 5px;
   }
   ```

Para usar este componente, você precisará:

```tsx
// Exemplo de uso:
<LoginForm 
  onLogin={(email) => {
    console.log('Tentando login com:', email);
    // Lógica de autenticação aqui
  }}
/>
```

Características importantes:
- Usa estados tipados para armazenar dados e erros
- Validação granular por campo
- Mensagens de erro específicas para cada validação
- Limpeza automática dos campos após login bem-sucedido
- Feedback visual claro com classes CSS básicas (pode ser personalizadas)
- Tipagem completa das props usando React.FC e interface específica

Você pode customizar as mensagens de erro ou o estilo alterando os textos nas funções de validação e ajustando a classe CSS conforme necessário.
