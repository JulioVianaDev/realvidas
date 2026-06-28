import { Injectable } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class SocketService {
  constructor(private readonly socketGateway: SocketGateway) {}

  emitToAll(event: string, data: any) {
    return this.socketGateway.emitToAll(event, data);
  }

  emitToUser(userId: string, event: string, data: any) {
    return this.socketGateway.emitToUser(userId, event, data);
  }

  emitToRole(role: string, event: string, data: any) {
    return this.socketGateway.emitToRole(role, event, data);
  }

  emitToTenant(tenantId: string, event: string, data: any) {
    return this.socketGateway.emitToTenant(tenantId, event, data);
  }

  emitToGuest(clientId: string, event: string, data: any) {
    return this.socketGateway.emitToGuest(clientId, event, data);
  }

  getConnectedUserBySocketId(socketId: string) {
    return this.socketGateway.getConnectedUserBySocketId(socketId);
  }

  getConnectedUserByClientId(clientId: string) {
    return this.socketGateway.getConnectedUserByClientId(clientId);
  }

  bindAuthenticatedSessionBySocketIdentifier(
    socketIdentifier: string | undefined,
    auth: { userId: string; role: string; tenantId?: string | null },
  ) {
    if (!socketIdentifier) {
      return false;
    }
    return this.socketGateway.bindAuthenticatedSessionBySocketIdentifier(
      socketIdentifier,
      auth,
    );
  }

  /**
   * Joins all active sockets for a user into `tenant:{tenantId}`.
   * Used after tenant creation (startup flow) or tenant switch.
   */
  joinUserToTenantRoom(userId: string, tenantId: string) {
    return this.socketGateway.setUserActiveTenant(userId, tenantId);
  }

  setUserActiveTenant(userId: string, tenantId: string) {
    return this.joinUserToTenantRoom(userId, tenantId);
  }
}
