import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SECRETS } from './config/secrets';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'debug', 'verbose', 'error', 'warn'],
  });

  app.enableCors({
    origin: '*',
    credentials: true,
    allowedHeaders: '*',
    methods: '*',
  });

  process.on('unhandledRejection', (reason) => {
    // Traza completa para diagnóstico
    console.error('unhandledRejection', reason);
  });

  console.log(`Arrancando con DB ${SECRETS.DB_HOST} (user ${SECRETS.DB_USER})`);
  console.log(`JWT_SECRET=${SECRETS.JWT_SECRET}`);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
