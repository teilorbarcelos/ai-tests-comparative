import express from 'express';
import productRoutes from './routes/productRoutes';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

app.use(express.json());

// Rotas
app.use('/api/products', productRoutes);

// Tratamento de erros
app.use(errorHandler);