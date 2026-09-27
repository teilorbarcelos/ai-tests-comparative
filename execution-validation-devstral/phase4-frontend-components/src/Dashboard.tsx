import React from 'react';

interface Stats {
  label: string;
  value: number;
}

interface DashboardProps {
  stats: Stats[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div className="dashboard">
      <h1>Painel de Estatísticas</h1>
      {stats.length === 0 ? (
        <p>Sem dados disponíveis</p>
      ) : (
        <ul className="stats-list">
          {stats.map((stat) => (
            <li
              key={stat.label}
              className={`stat-item ${stat.value > 100 ? 'highlight' : ''}`}
            >
              <span>{stat.label}: </span>
              <strong>{stat.value}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;