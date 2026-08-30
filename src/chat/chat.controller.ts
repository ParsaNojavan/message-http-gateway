import { HttpContext } from '@app/contracts/utils/crossCuttingConcerns/decorators/http-context.decorator';
import { buildContext } from '@app/contracts/utils/jwt_token/context/jwt.context';
import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
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

        return await this.chatClient.send('group.add', { roomId: memberDto.roomId, memberId: memberDto.memberId, context: buildContext(token, this.jwt) })
    }

    @Post('remove-member')
    @UseGuards(new JwtAuthGuard(['user']))
    async remove(@Body() memberDto, @Req() req) {
        const token = req.headers.authorization?.split(' ')[1];

        return await this.chatClient.send('group.remove', { data: memberDto, context: buildContext(token, this.jwt) })
    }


    @Post('users-status')
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

    @Put('room-mute')
    @UseGuards(new JwtAuthGuard(['user']))
    muteRoom(@Body() body: { roomId: string, durationMinutes: number }, @HttpContext() context) {
        return this.chatClient.send('room.mute', {
            roomId: body.roomId,
            durationMinutes: body.durationMinutes,
            context: context
        });
    }

    @Get('user-rooms')
    @UseGuards(new JwtAuthGuard(['user']))
    userRooms(@HttpContext() context) {
        return this.chatClient.send('rooms.fetch', {
            context: context
        });
    }

    @Post('join-room')
    async joinRoom(@Body() body: { roomId: string }, @HttpContext() context) {
        return await this.chatClient.send('room.join', { roomId: body.roomId, context: context })
    }

    @Get('rpc-token')
    @UseGuards(new JwtAuthGuard(['user']))
    rpcToken(@Query('roomId') roomId,
        @HttpContext() context) {
        return this.chatClient.send('group-rtc.token', {
            roomId, context
        });
    }

    @Get('user-calls')
    @UseGuards(new JwtAuthGuard(['user']))
    userCalls(
        @HttpContext() context,
        @Query('page') page?: string,
        @Query('limit') limit?: string
    ) {

        const userId = context.sub;

        return this.chatClient.send('calls.list', {
            page: page,
            limit: limit,
            context: context
        });
    }

    @Get(':roomId/messages')
    @UseGuards(new JwtAuthGuard(['user']))
    async getRoomMessages(
        @HttpContext() context,
        @Param('roomId') roomId: string,
        @Query('messageId') messageId?: string,
        @Query('limit') limit?: string,
    ) {
        return this.chatClient.send('room.messages', {
            roomId: roomId,
            messageId: messageId,
            limit: limit ? parseInt(limit, 10) : 20,
            context: context,
        })
    }

    @Get(':roomId/messages/search')
    @UseGuards(new JwtAuthGuard(['user']))
    async searchRoomMessages(
        @HttpContext() context,
        @Param('roomId') roomId: string,
        @Query() queryDto,
    ) {

        return this.chatClient.send('room.messages.search', {
            roomId: roomId,
            query: queryDto.q,
            limit: queryDto.limit,
            messageId: queryDto.cursor,
            context: context
        })
    }

    @Get('messages/search')
    @UseGuards(new JwtAuthGuard(['user']))
    async searchMessages(
        @HttpContext() context,
        @Query() queryDto,
    ) {

        return this.chatClient.send('user.messages.search', {
            query: queryDto.q,
            limit: queryDto.limit,
            context: context
        })
    }

    @Get('rooms/search')
    @UseGuards(new JwtAuthGuard(['user']))
    async searchRooms(
        @HttpContext() context,
        @Query() queryDto,
    ) {

        return this.chatClient.send('rooms.search', {
            query: queryDto.q,
            limit: queryDto.limit,
            context: context
        })
    }

    @Post('channel/create')
    @UseGuards(new JwtAuthGuard(['user']))
    async createChannel(@Body() body: {
        name: string,
        avatar: string,
    }, @HttpContext() context) {

        return this.chatClient
            .send('channel.create', {
                name: body.name,
                avatar: body.avatar,
                context: context
            })
    }

    @Post('channel/add-member')
    @UseGuards(new JwtAuthGuard(['user']))
    async addMemberChannel(@Body() body: {
        roomId: string,
        memberId: string,
    }, @HttpContext() context) {

        return this.chatClient
            .send('channel.add', {
                roomId: body.roomId,
                memberId: body.memberId,
                context: context
            })
    }

    @Delete('channel/remove-member')
    @UseGuards(new JwtAuthGuard(['user']))
    async removeMemberChannel(@Body() body: {
        roomId: string,
        memberId: string,
    }, @HttpContext() context) {

        return this.chatClient
            .send('channel.remove', {
                roomId: body.roomId,
                memberId: body.memberId,
                context: context
            })
    }
}
