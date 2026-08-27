// src/components/Card.tsx
import React from 'react';
import './Card.css';

export interface CardProps {
  title: string;
  subtitle?: string;
  avatar?: string;
}

const Card: React.FC<CardProps> = ({ title, subtitle, avatar }) => (
  <div className="card">
    {avatar && <img src={avatar} alt={title} className="avatar" />}
    <h3>{title}</h3>
    {subtitle && <p>{subtitle}</p>}
  </div>
);

export default Card;