import { Request, Response } from 'express';
import * as todoModel from '../models/todoModel';

export const getAllTodos = (req: Request, res: Response) => {
  try {
    const todos = todoModel.getAllTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar tarefas' });
  }
};

export const createTodo = (req: Request, res: Response) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ message: 'Título é obrigatório e deve ser uma string' });
    }

    const newTodo = todoModel.createTodo(title);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar tarefa' });
  }
};

export const toggleTodo = (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID da tarefa é obrigatório' });
    }

    const updatedTodo = todoModel.toggleTodo(id);

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar tarefa' });
  }
};

export const deleteTodo = (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'ID da tarefa é obrigatório' });
    }

    const isDeleted = todoModel.deleteTodo(id);

    if (!isDeleted) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir tarefa' });
  }
};