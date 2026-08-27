// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { state } = useAuth();

  return state.isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};