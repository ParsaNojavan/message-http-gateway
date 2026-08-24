import { ApiKeyGuard } from '@app/contracts/utils/api_key/guards/api-key.guard';
import { HttpContext } from '@app/contracts/utils/crossCuttingConcerns/decorators/http-context.decorator';
import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';
import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('support')
export class SupportController {
    constructor(@Inject('support-client') private userClient: ClientProxy) { }

    @Get('messages')
    @UseGuards(ApiKeyGuard)
    async supportMessages(
        @Query('roomId') roomId,
        @Query('visitorId') visitorId,
        @HttpContext() context) {

        return await this.userClient.send('support.messages', { roomId: roomId, requesterId: visitorId })
    }

    @Get('admin/messages')
    @UseGuards(new JwtAuthGuard(['user']))
    async adminMessages(
        @Query('roomId') roomId,
        @HttpContext() context) {

        const adminId = context.sub;
        return await this.userClient.send('support.messages', { roomId: roomId, requesterId: adminId })
    }

    @Get('admin/rooms')
    @UseGuards(new JwtAuthGuard(['user']))
    async adminRooms(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @HttpContext() context) {

        return await this.userClient.send('support.rooms', { page, limit, context })
    }
}
