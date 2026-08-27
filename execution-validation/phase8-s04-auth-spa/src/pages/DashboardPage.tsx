// src/pages/DashboardPage.tsx
import { useAuth } from '../contexts/AuthContext';

export const DashboardPage: React.FC = () => {
  const { state, logout } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Bem-vindo, {state.user?.name}!</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
};