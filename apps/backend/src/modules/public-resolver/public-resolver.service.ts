import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { getTenantConnection } from 'src/infra/postgres-databases/tenant/utils';
import { REPOSITORY_TOKENS_MAIN } from 'src/infra/postgres-databases/main/repository-tokens';
import { IUrlShortenerContractRepository } from 'src/infra/postgres-databases/main/repositories/url-shortener/url-shortener.contract.repository';
import { IResolvedShortPath } from '@global-types/entities/url-shortener.entity-type';

/**
 * Resolves public tenant/enterprise context for unauthenticated routes.
 *
 * Preferred path: short-path lookup hits the main-DB url_shorteners row
 * (single indexed query). The legacy enterpriseId-based resolver scans
 * tenant schemas and is kept only for backwards compatibility.
 */
@Injectable()
export class PublicResolverService {
  private readonly enterpriseCache = new Map<string, string>();
  private readonly shortPathCache = new Map<string, IResolvedShortPath>();

  constructor(
    @InjectDataSource()
    private readonly mainDataSource: DataSource,
    @Inject(REPOSITORY_TOKENS_MAIN.URL_SHORTENER_REPOSITORY)
    private readonly urlShortenerRepository: IUrlShortenerContractRepository,
  ) {}

  async resolveByShortPath(path: string): Promise<IResolvedShortPath> {
    const cached = this.shortPathCache.get(path);
    if (cached) return cached;

    const row = await this.urlShortenerRepository.findByPath(path);
    if (!row) {
      throw new NotFoundException('Short path not found');
    }
    const resolved: IResolvedShortPath = {
      path: row.path,
      tenantId: row.tenantId,
      enterpriseId: row.enterpriseId,
    };
    this.shortPathCache.set(path, resolved);
    return resolved;
  }

  async resolveTenantIdByEnterpriseId(enterpriseId: string): Promise<string> {
    const cached = this.enterpriseCache.get(enterpriseId);
    if (cached) return cached;

    const tenants = await this.mainDataSource.query<{ id: string }[]>(
      `SELECT id FROM tenants`,
    );

    for (const { id: tenantId } of tenants) {
      try {
        const ds = await getTenantConnection(tenantId);
        const rows = await ds.query<{ id: string }[]>(
          `SELECT id FROM "tenant_${tenantId}".enterprises WHERE id = $1 LIMIT 1`,
          [enterpriseId],
        );
        if (rows.length > 0) {
          this.enterpriseCache.set(enterpriseId, tenantId);
          return tenantId;
        }
      } catch {
        // schema may not be migrated yet; skip
      }
    }

    throw new NotFoundException('Enterprise not found');
  }
}
