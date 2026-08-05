import { HttpContext } from '@app/contracts/utils/crossCuttingConcerns/decorators/http-context.decorator';
import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';
import { Body, Controller, Get, Inject, Query, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';

@Controller('notifications')
export class NotificationsController {
    constructor(@Inject('notification-client') private notificationClient: ClientProxy) { }

    @Get('notifications')
    @UseGuards(new JwtAuthGuard(['user']))
    usersPresences(@Req() req: any,
        @Query('page') page: string,
        @Query('limit') limit: string) {
        const userId = req.user.sub;
        console.log(userId)

        return this.notificationClient.send('notifications.check', {
            userId,
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
        });
    }
}
