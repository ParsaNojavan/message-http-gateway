import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { JwtStrategy } from '@app/contracts/utils/jwt_token/strategies/jwt.strategy';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: process.env.JWT_EXPIRATION as any
            },
            global: true
        }),
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService,JwtStrategy],
})
export class AppModule { }
