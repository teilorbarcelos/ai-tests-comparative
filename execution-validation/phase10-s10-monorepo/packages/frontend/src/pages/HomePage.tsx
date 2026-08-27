import React from 'react';
import { TaskList } from '../components/TaskList';
import { TaskForm } from '../components/TaskForm';

export const HomePage: React.FC = () => (
  <div>
    <h1>Gerenciador de Tarefas</h1>
    <TaskForm />
    <hr />
    <TaskList />
  </div>
);