import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TrpcService } from './trpc/trpc.service';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Enable validation pipe for DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Setup Swagger documentation
  setupSwagger(app);

  // Get tRPC service and apply middleware
  const trpcService = app.get(TrpcService);
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use('/trpc', trpcService.getMiddleware());

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Backend microservice running on port ${port}`);
  console.log(`tRPC endpoint available at http://localhost:${port}/trpc`);
  console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
}

bootstrap();