import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ThrowExceptionAspcet } from 'lib/contracts/src/utils/aspects/throwExceptionAspect';
import { HttpContextAspcet } from 'lib/contracts/src/utils/aspects/httpContextAspect';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ThrowExceptionAspcet());
  app.useGlobalInterceptors(new HttpContextAspcet());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
