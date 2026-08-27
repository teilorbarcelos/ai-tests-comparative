import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import tasksRouter from './routes/tasks.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL ?? '*' }));
app.use(express.json());

app.get('/', (_, res) => res.send('Task Manager API'));

app.use('/api/tasks', tasksRouter);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

app.use(errorHandler);

export default app;