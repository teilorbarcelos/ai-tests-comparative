// src/components/Button.tsx
import React from 'react';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...rest }) => (
  <button className={`btn ${variant}`} {...rest}>
    {children}
  </button>
);

export default Button;