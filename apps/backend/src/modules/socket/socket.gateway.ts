import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type SocketAuthData = {
  userId: string;
  role: string;
  tenantId?: string | null;
};

type TrackedSocket = {
  socketId: string;
  clientId: string | null;
  auth: SocketAuthData | null;
};
@WebSocketGateway({
  path: '/ws/socket.io',
  cors: {
    origin: '*',
  },
})
@Injectable()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private readonly clients = new Map<string, TrackedSocket>();

  afterInit() {
    this.server.setMaxListeners(Infinity);
    // eslint-disable-next-line no-console
    console.log('Gateway Initialized');
  }

  handleConnection(client: Socket) {
    client.setMaxListeners(Infinity);
    const token = this.normalizeToken(client.handshake.query.token);
    const clientId = this.normalizeToken(
      client.handshake.query.clientId,
    );
    this.clients.set(client.id, {
      socketId: client.id,
      clientId,
      auth: null,
    });

    if (token) {
      const auth = this.getAuthFromToken(token);
      if (auth) {
        this.registerAuthenticatedClient(client, auth);
      }
    }
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
  }

  private normalizeToken(value: unknown): string {
    if (!value) return '';
    if (Array.isArray(value)) {
      return String(value[0] || '');
    }
    return String(value);
  }

  private getAuthFromToken(token: string): SocketAuthData | null {
    try {
      const payload = this.jwtService.verify<{
        userId?: string;
        role?: string;
        tenantId?: string;
      }>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      if (!payload?.userId || !payload?.role) {
        return null;
      }
      return {
        userId: payload.userId,
        role: payload.role,
        tenantId: payload.tenantId,
      };
    } catch {
      return null;
    }
  }

  private registerAuthenticatedClient(
    client: Socket,
    auth: SocketAuthData,
  ) {
    if (!client?.id) {
      return;
    }

    const tracked = this.clients.get(client.id);
    if (tracked) {
      tracked.auth = auth;
      this.clients.set(client.id, tracked);
    }

    client.join(this.getUserRoom(auth.userId));
    client.join(this.getRoleRoom(auth.role));
    if (auth.tenantId) {
      client.join(this.getTenantRoom(auth.tenantId));
    }

    client.emit('authenticated', {
      userId: auth.userId,
      rooms: [
        this.getUserRoom(auth.userId),
        this.getRoleRoom(auth.role),
      ].concat(
        auth.tenantId ? [this.getTenantRoom(auth.tenantId)] : [],
      ),
    });
  }

  private getUserRoom(userId: string) {
    return `user:${userId}`;
  }

  private getRoleRoom(role: string) {
    return `role:${role}`;
  }

  private getTenantRoom(tenantId: string) {
    return `tenant:${tenantId}`;
  }

  async emitToRoom(room: string, event: string, data: any) {
    this.server.setMaxListeners(Infinity);
    this.server.to(room).emit(event, data);
  }

  emitToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  emitToUser(userId: string, event: string, data: any) {
    this.server.to(this.getUserRoom(userId)).emit(event, data);
  }

  emitToRole(role: string, event: string, data: any) {
    this.server.to(this.getRoleRoom(role)).emit(event, data);
  }

  emitToTenant(tenantId: string, event: string, data: any) {
    this.server.to(this.getTenantRoom(tenantId)).emit(event, data);
  }

  emitToGuest(clientId: string, event: string, data: any) {
    for (const tracked of this.clients.values()) {
      if (tracked.clientId === clientId) {
        this.server.to(tracked.socketId).emit(event, data);
      }
    }
  }

  getConnectedUserBySocketId(socketId: string) {
    return this.clients.get(socketId)?.auth ?? null;
  }

  getConnectedUserByClientId(clientId: string) {
    for (const tracked of this.clients.values()) {
      if (tracked.clientId === clientId && tracked.auth) {
        return tracked.auth;
      }
    }
    return null;
  }

  bindAuthenticatedSessionBySocketIdentifier(
    socketIdentifier: string,
    auth: SocketAuthData,
  ): boolean {
    const directMatch =
      this.server.sockets.sockets.get(socketIdentifier);
    if (directMatch) {
      this.registerAuthenticatedClient(directMatch, auth);
      return true;
    }

    let boundAtLeastOne = false;
    for (const tracked of this.clients.values()) {
      if (tracked.clientId === socketIdentifier) {
        const socket = this.server.sockets.sockets.get(
          tracked.socketId,
        );
        if (socket) {
          this.registerAuthenticatedClient(socket, auth);
          boundAtLeastOne = true;
        }
      }
    }

    return boundAtLeastOne;
  }

  setUserActiveTenant(userId: string, tenantId: string): boolean {
    let updated = false;
    for (const tracked of this.clients.values()) {
      if (!tracked.auth || tracked.auth.userId !== userId) {
        continue;
      }

      const socket = this.server.sockets.sockets.get(
        tracked.socketId,
      );
      if (!socket) {
        continue;
      }

      if (tracked.auth.tenantId) {
        socket.leave(this.getTenantRoom(tracked.auth.tenantId));
      }

      tracked.auth.tenantId = tenantId;
      this.clients.set(tracked.socketId, tracked);
      socket.join(this.getTenantRoom(tenantId));
      socket.emit('tenant:changed', { tenantId });
      updated = true;
    }

    return updated;
  }

  private clearAuthenticatedSession(client: Socket) {
    const tracked = this.clients.get(client.id);
    if (!tracked?.auth) {
      return;
    }

    client.leave(this.getUserRoom(tracked.auth.userId));
    client.leave(this.getRoleRoom(tracked.auth.role));
    if (tracked.auth.tenantId) {
      client.leave(this.getTenantRoom(tracked.auth.tenantId));
    }

    tracked.auth = null;
    this.clients.set(client.id, tracked);
  }

  @SubscribeMessage('deauthenticate')
  handleDeauthenticate(
    @ConnectedSocket() client: Socket,
  ): { success: boolean; error?: string } {
    if (!client?.id) {
      return { success: false, error: 'Socket client unavailable' };
    }

    this.clearAuthenticatedSession(client);
    return { success: true };
  }

  @SubscribeMessage('authenticate')
  handleAuthenticate(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { token?: string },
  ): { success: boolean; error?: string } {
    if (!client?.id) {
      return { success: false, error: 'Socket client unavailable' };
    }

    const token = payload?.token;
    if (!token) {
      return { success: false, error: 'Token not provided' };
    }

    const auth = this.getAuthFromToken(token);
    if (!auth) {
      return { success: false, error: 'Invalid token' };
    }

    this.registerAuthenticatedClient(client, auth);
    return { success: true };
  }

  @SubscribeMessage('join-tenant-room')
  handleJoinTenantRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { tenantId?: string },
  ): { success: boolean; error?: string } {
    if (!client?.id) {
      return { success: false, error: 'Socket client unavailable' };
    }

    const tracked = this.clients.get(client.id);
    if (!tracked?.auth?.userId) {
      return { success: false, error: 'Not authenticated' };
    }

    const tenantId = payload?.tenantId?.trim();
    if (!tenantId) {
      return { success: false, error: 'tenantId not provided' };
    }

    this.setUserActiveTenant(tracked.auth.userId, tenantId);
    return { success: true };
  }
}
