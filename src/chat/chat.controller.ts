import { HttpContext } from '@app/contracts/utils/crossCuttingConcerns/decorators/http-context.decorator';
import { buildContext } from '@app/contracts/utils/jwt_token/context/jwt.context';
import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';
import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';

@Controller('chat')
export class ChatController {
    constructor(@Inject('chat-client') private chatClient: ClientProxy,
        private jwt: JwtService) { }

    @Post('create-group')
    @UseGuards(new JwtAuthGuard(['user']))
    async create(@Body() groupDto, @Req() req) {
        const token = req.headers.authorization?.split(' ')[1];

        return await this.chatClient.send('group.create', { data: groupDto, context: buildContext(token, this.jwt) })
    }

    @Post('create-direct')
    @UseGuards(new JwtAuthGuard(['user']))
    async direct(@Body() body: { userId }, @Req() req) {
        const token = req.headers.authorization?.split(' ')[1];

        return await this.chatClient.send('direct.create', { data: body, context: buildContext(token, this.jwt) })
    }

    @Post('add-member')
    @UseGuards(new JwtAuthGuard(['user']))
    async add(@Body() memberDto, @Req() req) {
        const token = req.headers.authorization?.split(' ')[1];

        return await this.chatClient.send('group.add', { data: memberDto, context: buildContext(token, this.jwt) })
    }

    @Post('remove-member')
    @UseGuards(new JwtAuthGuard(['user']))
    async remove(@Body() memberDto, @Req() req) {
        const token = req.headers.authorization?.split(' ')[1];

        return await this.chatClient.send('group.remove', { data: memberDto, context: buildContext(token, this.jwt) })
    }


    @Get('users-status')
    @UseGuards(new JwtAuthGuard(['user']))
    usersPresences(@Body() body: { userIds: string[] }) {
        return this.chatClient.send('users-status.check', {
            userIds: body.userIds,
        });
    }

    @Post('message-seen')
    @UseGuards(new JwtAuthGuard(['user']))
    async markAsSeen(@Body() body: { roomId: string, messageIds: string[] }, @Req() req) {
        const token = req.headers.authorization?.split(' ')[1];
        console.log(token);

        return await this.chatClient.send('message.seen', { roomId: body.roomId, messageIds: body.messageIds, context: buildContext(token, this.jwt) })
    }

}
