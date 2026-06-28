import { IUrlShortenerEntity } from '@global-types/entities/url-shortener.entity-type';

export abstract class IUrlShortenerContractRepository {
  abstract findByPath(path: string): Promise<IUrlShortenerEntity | null>;

  abstract findByEnterpriseId(
    enterpriseId: string,
  ): Promise<IUrlShortenerEntity | null>;

  abstract isPathAvailable(
    path: string,
    excludeEnterpriseId?: string,
  ): Promise<boolean>;

  abstract create(data: {
    path: string;
    tenantId: string;
    enterpriseId: string;
  }): Promise<IUrlShortenerEntity>;

  abstract updatePath(
    enterpriseId: string,
    path: string,
  ): Promise<IUrlShortenerEntity>;

  abstract softDeleteByEnterpriseId(enterpriseId: string): Promise<void>;
}
