import { HttpContext } from '@app/contracts/utils/crossCuttingConcerns/decorators/http-context.decorator';
import { buildContext } from '@app/contracts/utils/jwt_token/context/jwt.context';
import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';

@Controller('chat')
export class ChatController {
    constructor(@Inject('chat-client') private chatClient: ClientProxy,
        private jwt: JwtService) { }

    @Post('create-group')
    async create(@Body() groupDto, @Req() req) {
        const token = req.headers.authorization?.split(' ')[1];

        return await this.chatClient.send('group.create', { data: groupDto, context: buildContext(token, this.jwt) })
    }

    @Post('add-member')
    async add(@Body() memberDto, @Req() req) {
        const token = req.headers.authorization?.split(' ')[1];

        return await this.chatClient.send('group.add', { data: memberDto, context: buildContext(token, this.jwt) })
    }

    @Post('remove-member')
    async remove(@Body() memberDto, @Req() req) {
        const token = req.headers.authorization?.split(' ')[1];

        return await this.chatClient.send('group.remove', { data: memberDto, context: buildContext(token, this.jwt) })
    }
}
