import { HttpContext } from '@app/contracts/utils/crossCuttingConcerns/decorators/http-context.decorator';
import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';
import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';

@Controller('api-key')
export class ApiKeyController {
    constructor(@Inject('user-client') private userClient: ClientProxy) { }


    @Post('create-key')
    @UseGuards(new JwtAuthGuard(['user']))
    async register(@Body() data, @HttpContext() context) {

        return await this.userClient.send('api_key.create', { userId: context.sub, title: data.title, allowedDomain: data.allowedDomain })
    }
}
