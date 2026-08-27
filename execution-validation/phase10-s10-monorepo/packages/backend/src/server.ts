import app from './app';
import { prisma } from './config';

const PORT = process.env.PORT ?? 4000;

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco');
    app.listen(PORT, () => {
      console.log(`🚀 API rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

bootstrap();