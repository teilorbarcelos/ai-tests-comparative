// src/components/Input.tsx
import React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ ...rest }) => (
  <input className="input" {...rest} />
);

export default Input;