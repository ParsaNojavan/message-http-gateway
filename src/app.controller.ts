import { Body, Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '@app/contracts/utils/jwt_token/guards/jwt.guard';

@Controller()
export class AppController {
  constructor(private jwt: JwtService) { }


  @Get('test')
  @UseGuards(new JwtAuthGuard(['admin']))
  async test(@Body() data) {
    console.log('hello from authenticated route');
  }


}
