import {
  Inject,
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { BackendTranslatorService } from 'src/modules/common/services/backend-translator.service';
import { TenantContextService } from 'src/modules/common/services/tenant-context.service';
import {
  CreateEnterpriseDto,
  UpdateEnterpriseDto,
  GetEnterprisesDto,
  GetMyEnterprisesDto,
  TransferEnterpriseOwnershipDto,
  UpdateEnterpriseGoogleTokensDto,
} from '../dto/enterprise.dto';
import {
  IGetEnterprisesResponse,
  IGetEnterpriseByIdResponse,
  IGetMyEnterprisesResponse,
  ICreateEnterpriseResponse,
  IUpdateEnterpriseResponse,
  IDeleteEnterpriseResponse,
  ITransferOwnershipResponse,
} from '@global-types/responses/enterprise.response';
import { REPOSITORY_TOKENS_TENANT } from 'src/infra';
import { REPOSITORY_TOKENS_MAIN } from 'src/infra/postgres-databases/main/repository-tokens';
import { FileService } from 'src/modules/file/services/file.service';
import { File } from '@nest-lab/fastify-multer';
import {
  EnterpriseOption,
  ITenantAdminContractRepository,
  TenantOption,
} from 'src/infra/postgres-databases/main/repositories/tenant-admin/tenant-admin.contract.repository';
import { IUrlShortenerContractRepository } from 'src/infra/postgres-databases/main/repositories/url-shortener/url-shortener.contract.repository';
import {
  IShortPathAvailabilityResponse,
  RESERVED_SHORT_PATHS,
  SHORT_PATH_MAX_LENGTH,
  SHORT_PATH_MIN_LENGTH,
  SHORT_PATH_REGEX,
} from '@global-types/entities/url-shortener.entity-type';
import { Role } from 'src/infra/postgres-databases/main/entities/enums';
import { IEnterpriseContractRepository } from '../../../infra/postgres-databases/tenant/repositories/enterprise/enterprise.contract.repository';

@Injectable()
export class EnterpriseService {
  constructor(
    @Inject(REPOSITORY_TOKENS_TENANT.ENTERPRISE_REPOSITORY)
    private readonly enterpriseRepository: IEnterpriseContractRepository,
    @Inject(REPOSITORY_TOKENS_MAIN.TENANT_ADMIN_REPOSITORY)
    private readonly tenantAdminRepository: ITenantAdminContractRepository,
    @Inject(REPOSITORY_TOKENS_MAIN.URL_SHORTENER_REPOSITORY)
    private readonly urlShortenerRepository: IUrlShortenerContractRepository,
    private readonly fileService: FileService,
    private readonly translator: BackendTranslatorService,
    private readonly tenantContext: TenantContextService,
  ) {}

  async adminListTenants(): Promise<TenantOption[]> {
    return this.tenantAdminRepository.listTenants();
  }

  async listEnterprisesByTenant(
    tenantId: string,
    userId: string,
    userRole: Role,
  ): Promise<EnterpriseOption[]> {
    if (userRole !== Role.ADMIN) {
      const hasAccess =
        await this.tenantAdminRepository.userHasTenantAccess(
          userId,
          tenantId,
        );
      if (!hasAccess) {
        throw new ForbiddenException(
          this.translator.userMessage(
            'ENTERPRISE_TENANT_ACCESS_DENIED',
          ),
        );
      }
    }

    return this.tenantAdminRepository.listEnterprisesByTenant(
      tenantId,
    );
  }

  async createEnterprise(
    ownerId: string,
    data: CreateEnterpriseDto,
    file?: File,
  ): Promise<ICreateEnterpriseResponse> {
    if (!data.cpf && !data.cnpj) {
      throw new BadRequestException(
        this.translator.userMessage(
          'ENTERPRISE_CPF_OR_CNPJ_REQUIRED',
        ),
      );
    }

    if (file) {
      const fileResponse = await this.fileService.saveFile({
        file,
        module: 'enterprise',
        userId: ownerId,
      });
      data.imageUrl = fileResponse.url;
    }

    const desiredPath = data.shortPath
      ? this.normalizeShortPath(data.shortPath)
      : this.slugify(data.name);
    const finalPath = await this.reserveUniqueShortPath(desiredPath);

    data.shortPath = finalPath;

    const created = await this.enterpriseRepository.createEnterprise(
      ownerId,
      data,
    );

    const tenantId = this.tenantContext.requireTenantIdOrBadRequest();

    await this.urlShortenerRepository.create({
      path: finalPath,
      tenantId,
      enterpriseId: created.id,
    });

    return created;
  }

  async getAllEnterprises(
    params: GetEnterprisesDto,
  ): Promise<IGetEnterprisesResponse> {
    return this.enterpriseRepository.getAllEnterprises(params);
  }

  async getEnterpriseById(
    id: string,
    userId: string,
  ): Promise<IGetEnterpriseByIdResponse> {
    const enterprise =
      await this.enterpriseRepository.getEnterpriseById(id);

    if (!enterprise) {
      throw new NotFoundException(
        this.translator.userMessage('ENTERPRISE_NOT_FOUND'),
      );
    }

    const isMember =
      await this.enterpriseRepository.checkUserIsMember(id, userId);

    if (!isMember) {
      throw new ForbiddenException(
        this.translator.userMessage('ENTERPRISE_NOT_MEMBER'),
      );
    }

    return enterprise;
  }

  async getMyEnterprises(
    userId: string,
    params: GetMyEnterprisesDto,
  ): Promise<IGetMyEnterprisesResponse> {
    return this.enterpriseRepository.getMyEnterprises(userId, params);
  }

  async updateEnterprise(
    id: string,
    userId: string,
    data: UpdateEnterpriseDto,
  ): Promise<IUpdateEnterpriseResponse> {
    const userRole =
      await this.enterpriseRepository.getUserRoleInEnterprise(
        id,
        userId,
      );

    if (!userRole || !['OWNER', 'ADMIN'].includes(userRole)) {
      throw new ForbiddenException(
        this.translator.userMessage('ENTERPRISE_UPDATE_FORBIDDEN'),
      );
    }

    if (data.shortPath !== undefined && data.shortPath !== null) {
      const normalized = this.normalizeShortPath(data.shortPath);
      this.assertShortPathShape(normalized);

      const available =
        await this.urlShortenerRepository.isPathAvailable(
          normalized,
          id,
        );
      if (!available) {
        throw new ConflictException(
          this.translator.userMessage('ENTERPRISE_SHORT_PATH_TAKEN'),
        );
      }

      const existing =
        await this.urlShortenerRepository.findByEnterpriseId(id);
      if (existing) {
        await this.urlShortenerRepository.updatePath(id, normalized);
      } else {
        const tenantId =
          this.tenantContext.requireTenantIdOrBadRequest();
        await this.urlShortenerRepository.create({
          path: normalized,
          tenantId,
          enterpriseId: id,
        });
      }

      data.shortPath = normalized;
    }

    return this.enterpriseRepository.updateEnterprise(id, data);
  }

  async deleteEnterprise(
    id: string,
    userId: string,
  ): Promise<IDeleteEnterpriseResponse> {
    const isOwner = await this.enterpriseRepository.checkUserIsOwner(
      id,
      userId,
    );

    if (!isOwner) {
      throw new ForbiddenException(
        this.translator.userMessage('ENTERPRISE_DELETE_OWNER_ONLY'),
      );
    }

    await this.urlShortenerRepository.softDeleteByEnterpriseId(id);
    return this.enterpriseRepository.deleteEnterprise(id);
  }

  async transferOwnership(
    enterpriseId: string,
    userId: string,
    data: TransferEnterpriseOwnershipDto,
  ): Promise<ITransferOwnershipResponse> {
    const isOwner = await this.enterpriseRepository.checkUserIsOwner(
      enterpriseId,
      userId,
    );

    if (!isOwner) {
      throw new ForbiddenException(
        this.translator.userMessage('ENTERPRISE_TRANSFER_OWNER_ONLY'),
      );
    }

    const isMember =
      await this.enterpriseRepository.checkUserIsMember(
        enterpriseId,
        data.newOwnerId,
      );

    if (!isMember) {
      throw new BadRequestException(
        this.translator.userMessage(
          'ENTERPRISE_NEW_OWNER_MUST_BE_MEMBER',
        ),
      );
    }

    return this.enterpriseRepository.transferOwnership(
      enterpriseId,
      data.newOwnerId,
    );
  }

  async updateGoogleTokens(
    enterpriseId: string,
    userId: string,
    data: UpdateEnterpriseGoogleTokensDto,
  ): Promise<IUpdateEnterpriseResponse> {
    const userRole =
      await this.enterpriseRepository.getUserRoleInEnterprise(
        enterpriseId,
        userId,
      );

    if (!userRole || !['OWNER', 'ADMIN'].includes(userRole)) {
      throw new ForbiddenException(
        this.translator.userMessage(
          'ENTERPRISE_GOOGLE_TOKENS_FORBIDDEN',
        ),
      );
    }

    return this.enterpriseRepository.updateGoogleTokens(
      enterpriseId,
      data,
    );
  }

  async checkShortPathAvailability(
    rawPath: string,
    excludeEnterpriseId?: string,
  ): Promise<IShortPathAvailabilityResponse> {
    const normalized = this.normalizeShortPath(rawPath);

    if (
      normalized.length < SHORT_PATH_MIN_LENGTH ||
      normalized.length > SHORT_PATH_MAX_LENGTH ||
      !SHORT_PATH_REGEX.test(normalized)
    ) {
      return { available: false, reason: 'invalid' };
    }
    if (RESERVED_SHORT_PATHS.includes(normalized)) {
      return { available: false, reason: 'reserved' };
    }

    const available =
      await this.urlShortenerRepository.isPathAvailable(
        normalized,
        excludeEnterpriseId,
      );
    return available
      ? { available: true }
      : { available: false, reason: 'taken' };
  }

  async validateUserAccess(
    enterpriseId: string,
    userId: string,
  ): Promise<void> {
    const isMember =
      await this.enterpriseRepository.checkUserIsMember(
        enterpriseId,
        userId,
      );

    if (!isMember) {
      throw new ForbiddenException(
        this.translator.userMessage('ENTERPRISE_ACCESS_DENIED'),
      );
    }
  }

  async validateUserRole(
    enterpriseId: string,
    userId: string,
    allowedRoles: string[],
  ): Promise<void> {
    const userRole =
      await this.enterpriseRepository.getUserRoleInEnterprise(
        enterpriseId,
        userId,
      );

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new ForbiddenException(
        this.translator.userMessage('ENTERPRISE_INSUFFICIENT_ROLE'),
      );
    }
  }

  // ── short path helpers ──────────────────────────────────────────────

  private slugify(input: string): string {
    return input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-')
      .slice(0, SHORT_PATH_MAX_LENGTH);
  }

  private normalizeShortPath(input: string): string {
    return this.slugify(input);
  }

  private assertShortPathShape(path: string): void {
    if (
      path.length < SHORT_PATH_MIN_LENGTH ||
      path.length > SHORT_PATH_MAX_LENGTH ||
      !SHORT_PATH_REGEX.test(path)
    ) {
      throw new BadRequestException(
        this.translator.userMessage('ENTERPRISE_SHORT_PATH_INVALID'),
      );
    }
    if (RESERVED_SHORT_PATHS.includes(path)) {
      throw new BadRequestException(
        this.translator.userMessage('ENTERPRISE_SHORT_PATH_RESERVED'),
      );
    }
  }

  private async reserveUniqueShortPath(
    base: string,
  ): Promise<string> {
    let candidate = base;
    if (
      candidate.length < SHORT_PATH_MIN_LENGTH ||
      RESERVED_SHORT_PATHS.includes(candidate)
    ) {
      candidate = `${candidate}-co`.slice(0, SHORT_PATH_MAX_LENGTH);
    }
    this.assertShortPathShape(candidate);

    let suffix = 1;
    const maxBaseLen = SHORT_PATH_MAX_LENGTH - 5;
    while (
      !(await this.urlShortenerRepository.isPathAvailable(candidate))
    ) {
      suffix += 1;
      const trimmed = base.slice(0, maxBaseLen).replace(/-+$/g, '');
      candidate = `${trimmed}-${suffix}`;
      if (suffix > 999) {
        throw new ConflictException(
          this.translator.userMessage('ENTERPRISE_SHORT_PATH_TAKEN'),
        );
      }
    }
    return candidate;
  }
}
