import { Body, Controller, Get, Inject, Patch, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';
import { HttpContext } from '@app/contracts/utils/crossCuttingConcerns/decorators/http-context.decorator';

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

    @Post('reset-password')
    @UseGuards(new JwtAuthGuard(['user']))
    async resetPassword(@Body() data, @HttpContext() context) {
        return await this.userClient.send('user.reset-password', { resetPassword: data, context })
    }

    @Get('user-profile')
    @UseGuards(new JwtAuthGuard(['user']))
    async userProfile(@HttpContext() context) {
        return await this.userClient.send('user.profile', { context })
    }

    @Patch('user-update')
    @UseGuards(new JwtAuthGuard(['user']))
    async updateProfile(@Body() data, @HttpContext() context) {
        return await this.userClient.send('user.update', { userDto: data, context })
    }
}
