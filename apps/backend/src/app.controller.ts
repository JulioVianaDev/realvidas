import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SocketService } from './modules/socket/socket.service';

@Controller({})
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly socketService: SocketService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('ping')
  ping(): { status: string } {
    return { status: 'ok' };
  }

  @Get('socket')
  async socket() {
    this.socketService.emitToAll('test', {
      payload: 'Hello, world!',
      completed: true,
    });
    return { success: true, target: 'all', event: 'test' };
  }

  @Post('socket/all')
  emitSocketToAll(
    @Body() body: { event: string; data: Record<string, unknown> },
  ) {
    this.socketService.emitToAll(body.event, body.data);
    return { success: true, target: 'all', event: body.event };
  }

  @Post('socket/user')
  emitSocketToUser(
    @Body()
    body: {
      userId: string;
      event: string;
      data: Record<string, unknown>;
    },
  ) {
    this.socketService.emitToUser(body.userId, body.event, body.data);
    return {
      success: true,
      target: 'user',
      userId: body.userId,
      event: body.event,
    };
  }

  @Post('socket/role')
  emitSocketToRole(
    @Body()
    body: {
      role: string;
      event: string;
      data: Record<string, unknown>;
    },
  ) {
    this.socketService.emitToRole(body.role, body.event, body.data);
    return {
      success: true,
      target: 'role',
      role: body.role,
      event: body.event,
    };
  }

  @Post('socket/tenant')
  emitSocketToTenant(
    @Body()
    body: {
      tenantId: string;
      event: string;
      data: Record<string, unknown>;
    },
  ) {
    this.socketService.emitToTenant(
      body.tenantId,
      body.event,
      body.data,
    );
    return {
      success: true,
      target: 'tenant',
      tenantId: body.tenantId,
      event: body.event,
    };
  }

  @Post('socket/guest')
  emitSocketToGuest(
    @Body()
    body: {
      clientId: string;
      event: string;
      data: Record<string, unknown>;
    },
  ) {
    this.socketService.emitToGuest(
      body.clientId,
      body.event,
      body.data,
    );
    return {
      success: true,
      target: 'guest',
      clientId: body.clientId,
      event: body.event,
    };
  }
}
