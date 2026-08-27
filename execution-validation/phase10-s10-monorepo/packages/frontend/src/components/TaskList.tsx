import React from 'react';
import { useFetchTasksQuery, useDeleteTaskMutation } from '../api/tasksApi';

export const TaskList: React.FC = () => {
  const { data: tasks, isLoading, error } = useFetchTasksQuery();
  const [deleteTask] = useDeleteTaskMutation();

  if (isLoading) return <p>Carregando tarefas…</p>;
  if (error) return <p>Erro ao carregar tarefas.</p>;

  return (
    <ul>
      {tasks?.map((t) => (
        <li key={t.id}>
          <strong>{t.title}</strong> – {t.status}
          <button onClick={() => deleteTask(t.id)}>Excluir</button>
        </li>
      ))}
    </ul>
  );
};