// backend/src/app.ts
import express from 'express';
import cartRouter from './api/cart';

const app = express();
app.use(express.json());

app.use('/api', cartRouter);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => console.log(`🚀 Cart API rodando na porta ${PORT}`));