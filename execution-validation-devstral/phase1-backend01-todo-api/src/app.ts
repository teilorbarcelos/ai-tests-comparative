import express, { Express } from 'express';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes';

const app: Express = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/todos', todoRoutes);

// Rota de saudação
app.get('/', (req, res) => {
  res.send('API de Gerenciamento de Tarefas');
});

export default app;