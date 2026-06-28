import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { IUrlShortenerEntity } from '@global-types/entities/url-shortener.entity-type';
import { UrlShortenerEntity } from '../../entities/url-shortener.entity';
import { IUrlShortenerContractRepository } from './url-shortener.contract.repository';

@Injectable()
export class UrlShortenerTypeOrmRepository
  implements IUrlShortenerContractRepository
{
  private repo: Repository<UrlShortenerEntity>;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(UrlShortenerEntity);
  }

  async findByPath(path: string): Promise<IUrlShortenerEntity | null> {
    return this.repo.findOne({ where: { path } }) as Promise<IUrlShortenerEntity | null>;
  }

  async findByEnterpriseId(
    enterpriseId: string,
  ): Promise<IUrlShortenerEntity | null> {
    return this.repo.findOne({
      where: { enterpriseId },
    }) as Promise<IUrlShortenerEntity | null>;
  }

  async isPathAvailable(
    path: string,
    excludeEnterpriseId?: string,
  ): Promise<boolean> {
    const existing = await this.repo.findOne({
      where: excludeEnterpriseId
        ? { path, enterpriseId: Not(excludeEnterpriseId) }
        : { path },
    });
    return !existing;
  }

  async create(data: {
    path: string;
    tenantId: string;
    enterpriseId: string;
  }): Promise<IUrlShortenerEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity) as unknown as Promise<IUrlShortenerEntity>;
  }

  async updatePath(
    enterpriseId: string,
    path: string,
  ): Promise<IUrlShortenerEntity> {
    const existing = await this.repo.findOne({
      where: { enterpriseId, deletedAt: IsNull() },
    });
    if (!existing) {
      throw new Error(
        `UrlShortener not found for enterpriseId=${enterpriseId}`,
      );
    }
    existing.path = path;
    return this.repo.save(existing) as unknown as Promise<IUrlShortenerEntity>;
  }

  async softDeleteByEnterpriseId(enterpriseId: string): Promise<void> {
    await this.repo.softDelete({ enterpriseId });
  }
}
