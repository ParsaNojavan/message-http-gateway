import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService, @Inject('user-client') private userClient: ClientProxy) { }

    @Post('login')
    async login(@Body() data) {
        return await this.userClient.send('user.login', { userDto: data })
    }

    @Post('register')
    async register(@Body() data) {
        return await this.userClient.send('user.register', { userDto: data })
    }

    @Post('verify-code')
    async verifyCode(@Body() data) {
        return await this.userClient.send('user.verify-code', { userDto: data })
    }

    @Post('refresh-token')
    async refreshToken(@Body() data) {
        return await this.userClient.send('user.refresh-token', data)
    }
}
