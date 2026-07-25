import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(@Inject('user-client') private userClient: ClientProxy) {}

  @Get()
  async getHello() {
    return await this.userClient.send('user.login',{})
  }
}
