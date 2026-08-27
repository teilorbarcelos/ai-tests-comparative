// src/components/Dashboard.tsx
import React, { useState, useMemo } from 'react';
import { User } from '../types';
import { useFetch } from '../hooks/useFetch';
import Button from './Button';
import Input from './Input';
import Card from './Card';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { data, loading, error } = useFetch<User[]>('/api/users');
  const [search, setSearch] = useState('');
  const [orderAsc, setOrderAsc] = useState(true);

  // Filtra e ordena os usuários
  const filteredUsers = useMemo(() => {
    if (!data) return [];
    let users = [...data];

    if (search.trim()) {
      users = users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    users.sort((a, b) =>
      orderAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    return users;
  }, [data, search, orderAsc]);

  if (loading) return <p className="status">Carregando...</p>;
  if (error) return <p className="status error">{error}</p>;

  return (
    <div className="dashboard">
      <h1>Usuários</h1>

      {/* Filtros */}
      <div className="filters">
        <Input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="secondary" onClick={() => setOrderAsc(!orderAsc)}>
          Ordenar {orderAsc ? '↓' : '↑'}
        </Button>
      </div>

      {/* Lista de cards */}
      <div className="cards">
        {filteredUsers.map((user) => (
          <Card
            key={user.id}
            title={user.name}
            subtitle={user.email}
            avatar={user.avatar}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;