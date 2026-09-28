import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ThrowExceptionAspcet } from 'lib/contracts/src/utils/aspects/throwExceptionAspect';
import { HttpContextAspcet } from 'lib/contracts/src/utils/aspects/httpContextAspect';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:4200','http://192.168.1.107:4200'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalInterceptors(new ThrowExceptionAspcet());
  app.useGlobalInterceptors(new HttpContextAspcet());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
