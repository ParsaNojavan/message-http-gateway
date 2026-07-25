import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
        ClientsModule.register([
            {
                name: 'user-client',
                transport: Transport.REDIS,
                options: {
                    host: process.env.REDIS_HOST ?? 'localhost',
                    port: parseInt(process.env.REDIS_PORT ?? '6379')
                }
            }
        ])
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
