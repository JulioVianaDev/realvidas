import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { IncomingMessage } from 'http';
import { ClsService } from 'nestjs-cls';
import { DataSource } from 'typeorm';
import { UserTenantViewCacheService } from './user-tenant-view-cache.service';

type JwtPayload = {
  userId?: string;
};

/**
 * Runs inside nestjs-cls `middleware.setup` (awaited before `next()`), so
 * `cls.set('tenantId', …)` stays in the same AsyncLocalStorage context as the
 * request. A separate Nest middleware cannot do async work after CLS `run()`
 * has already finished.
 */
@Injectable()
export class TenantClsSetupService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectDataSource()
    private readonly mainDataSource: DataSource,
    private readonly userTenantViewCache: UserTenantViewCacheService,
  ) {}

  async applyTenantFromJwt(
    cls: ClsService,
    req: IncomingMessage,
  ): Promise<void> {
    try {
      const auth = req.headers.authorization;
      if (!auth?.startsWith('Bearer ')) {
        // Public endpoints: fall back to x-tenant-id header.
        // Safe because enterprise-id still bounds all queries and write
        // operations validate enterpriseId existence in that schema.
        const publicTenantId = req.headers['x-tenant-id'];
        if (typeof publicTenantId === 'string' && publicTenantId) {
          cls.set('tenantId', publicTenantId);
        }
        return;
      }

      const token = auth.slice('Bearer '.length).trim();
      if (!token) {
        return;
      }

      let payload: JwtPayload;
      try {
        payload =
          await this.jwtService.verifyAsync<JwtPayload>(token);
      } catch {
        return;
      }

      const userId = payload.userId;
      if (!userId) {
        return;
      }

      let tenantId = await this.userTenantViewCache.get(userId);
      if (tenantId === null) {
        const rows = await this.mainDataSource.query<
          { currentTenantViewId: string | null }[]
        >(
          `SELECT "currentTenantViewId" FROM users WHERE id = $1 LIMIT 1`,
          [userId],
        );
        const fromDb = rows[0]?.currentTenantViewId ?? null;
        if (fromDb) {
          await this.userTenantViewCache.set(userId, fromDb);
          tenantId = fromDb;
        }
      }

      if (tenantId) {
        cls.set('tenantId', tenantId);
      }
    } catch {
      // Leave tenant unset
    }
  }
}
