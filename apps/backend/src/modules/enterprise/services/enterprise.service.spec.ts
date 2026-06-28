import { Test, TestingModule } from '@nestjs/testing';
import {
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { REPOSITORY_TOKENS_TENANT } from 'src/infra/postgres-databases/tenant/repository-tokens';
import { REPOSITORY_TOKENS_MAIN } from 'src/infra/postgres-databases/main/repository-tokens';
import {
  createMockEnterpriseRepository,
  createMockTenantAdminRepository,
  createMockUrlShortenerRepository,
  mockTenantRepository,
  mockMainRepository,
} from 'src/test-utils/database-mock';
import {
  createMockFileService,
  createMockTranslatorService,
  createMockTenantContextService,
} from 'src/test-utils/service-mock';
import { FileService } from 'src/modules/file/services/file.service';
import { BackendTranslatorService } from 'src/modules/common/services/backend-translator.service';
import { TenantContextService } from 'src/modules/common/services/tenant-context.service';
import { Role } from 'src/infra/postgres-databases/main/entities/enums';

describe('EnterpriseService', () => {
  let service: EnterpriseService;
  let enterpriseRepo: ReturnType<typeof createMockEnterpriseRepository>;
  let tenantAdminRepo: ReturnType<typeof createMockTenantAdminRepository>;
  let urlShortenerRepo: ReturnType<typeof createMockUrlShortenerRepository>;
  let fileService: ReturnType<typeof createMockFileService>;
  let tenantContext: ReturnType<typeof createMockTenantContextService>;

  const mockEnterprise = {
    id: 'ent-1',
    name: 'Test Enterprise',
    ownerId: 'user-1',
    shortPath: 'test-enterprise',
    imageUrl: null,
    cpf: null,
    cnpj: '12345678000190',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    enterpriseRepo = createMockEnterpriseRepository();
    tenantAdminRepo = createMockTenantAdminRepository();
    urlShortenerRepo = createMockUrlShortenerRepository();
    fileService = createMockFileService();
    tenantContext = createMockTenantContextService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnterpriseService,
        mockTenantRepository(REPOSITORY_TOKENS_TENANT.ENTERPRISE_REPOSITORY, enterpriseRepo),
        mockMainRepository(REPOSITORY_TOKENS_MAIN.TENANT_ADMIN_REPOSITORY, tenantAdminRepo),
        mockMainRepository(REPOSITORY_TOKENS_MAIN.URL_SHORTENER_REPOSITORY, urlShortenerRepo),
        { provide: FileService, useValue: fileService },
        { provide: BackendTranslatorService, useValue: createMockTranslatorService() },
        { provide: TenantContextService, useValue: tenantContext },
      ],
    }).compile();

    service = module.get<EnterpriseService>(EnterpriseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── adminListTenants ───────────────────────────────────────────────

  describe('adminListTenants', () => {
    it('should delegate to tenantAdminRepository.listTenants', async () => {
      const tenants = [{ id: 't-1', createdAt: new Date(), createdByUserId: 'u-1', createdByUserName: 'Admin' }];
      tenantAdminRepo.listTenants.mockResolvedValue(tenants);

      const result = await service.adminListTenants();

      expect(tenantAdminRepo.listTenants).toHaveBeenCalled();
      expect(result).toEqual(tenants);
    });
  });

  // ── listEnterprisesByTenant ────────────────────────────────────────

  describe('listEnterprisesByTenant', () => {
    it('should return enterprises for ADMIN role without access check', async () => {
      const enterprises = [{ id: 'ent-1', name: 'Enterprise 1' }];
      tenantAdminRepo.listEnterprisesByTenant.mockResolvedValue(enterprises);

      const result = await service.listEnterprisesByTenant('t-1', 'user-1', Role.ADMIN);

      expect(tenantAdminRepo.userHasTenantAccess).not.toHaveBeenCalled();
      expect(result).toEqual(enterprises);
    });

    it('should check access for non-ADMIN users and delegate', async () => {
      tenantAdminRepo.userHasTenantAccess.mockResolvedValue(true);
      tenantAdminRepo.listEnterprisesByTenant.mockResolvedValue([]);

      await service.listEnterprisesByTenant('t-1', 'user-1', Role.USER);

      expect(tenantAdminRepo.userHasTenantAccess).toHaveBeenCalledWith('user-1', 't-1');
      expect(tenantAdminRepo.listEnterprisesByTenant).toHaveBeenCalledWith('t-1');
    });

    it('should throw ForbiddenException when non-admin has no access', async () => {
      tenantAdminRepo.userHasTenantAccess.mockResolvedValue(false);

      await expect(
        service.listEnterprisesByTenant('t-1', 'user-1', Role.USER),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── createEnterprise ───────────────────────────────────────────────

  describe('createEnterprise', () => {
    const createDto = {
      name: 'New Enterprise',
      cnpj: '12345678000190',
      cpf: null,
      shortPath: undefined,
    } as any;

    it('should throw BadRequestException when neither cpf nor cnpj provided', async () => {
      await expect(
        service.createEnterprise('user-1', { name: 'X', cpf: null, cnpj: null } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should upload image when file is provided', async () => {
      urlShortenerRepo.isPathAvailable.mockResolvedValue(true);
      enterpriseRepo.createEnterprise.mockResolvedValue(mockEnterprise);
      urlShortenerRepo.create.mockResolvedValue({});

      await service.createEnterprise('user-1', { ...createDto }, { buffer: Buffer.from('img') } as any);

      expect(fileService.saveFile).toHaveBeenCalled();
    });

    it('should create enterprise with auto-generated shortPath and url shortener entry', async () => {
      urlShortenerRepo.isPathAvailable.mockResolvedValue(true);
      enterpriseRepo.createEnterprise.mockResolvedValue({ ...mockEnterprise, id: 'ent-new' });
      urlShortenerRepo.create.mockResolvedValue({});

      const result = await service.createEnterprise('user-1', { ...createDto });

      expect(result.id).toBe('ent-new');
      expect(enterpriseRepo.createEnterprise).toHaveBeenCalled();
      expect(urlShortenerRepo.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException when tenantId is not resolved from cls', async () => {
      tenantContext = createMockTenantContextService(null);
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EnterpriseService,
          mockTenantRepository(REPOSITORY_TOKENS_TENANT.ENTERPRISE_REPOSITORY, enterpriseRepo),
          mockMainRepository(REPOSITORY_TOKENS_MAIN.TENANT_ADMIN_REPOSITORY, tenantAdminRepo),
          mockMainRepository(REPOSITORY_TOKENS_MAIN.URL_SHORTENER_REPOSITORY, urlShortenerRepo),
          { provide: FileService, useValue: fileService },
          { provide: BackendTranslatorService, useValue: createMockTranslatorService() },
          { provide: TenantContextService, useValue: tenantContext },
        ],
      }).compile();
      service = module.get<EnterpriseService>(EnterpriseService);

      urlShortenerRepo.isPathAvailable.mockResolvedValue(true);
      enterpriseRepo.createEnterprise.mockResolvedValue(mockEnterprise);

      await expect(
        service.createEnterprise('user-1', { ...createDto }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ── getEnterpriseById ──────────────────────────────────────────────

  describe('getEnterpriseById', () => {
    it('should return enterprise when user is a member', async () => {
      enterpriseRepo.getEnterpriseById.mockResolvedValue(mockEnterprise);
      enterpriseRepo.checkUserIsMember.mockResolvedValue(true);

      const result = await service.getEnterpriseById('ent-1', 'user-1');

      expect(result).toEqual(mockEnterprise);
    });

    it('should throw NotFoundException when enterprise does not exist', async () => {
      enterpriseRepo.getEnterpriseById.mockResolvedValue(null);

      await expect(
        service.getEnterpriseById('missing', 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user is not a member', async () => {
      enterpriseRepo.getEnterpriseById.mockResolvedValue(mockEnterprise);
      enterpriseRepo.checkUserIsMember.mockResolvedValue(false);

      await expect(
        service.getEnterpriseById('ent-1', 'outsider'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── getAllEnterprises ──────────────────────────────────────────────

  describe('getAllEnterprises', () => {
    it('should delegate to repository', async () => {
      const response = { data: [mockEnterprise], metadata: { total: 1, page: 1, hasNextPage: false, hasPreviousPage: false, lastPage: 1 } };
      enterpriseRepo.getAllEnterprises.mockResolvedValue(response);

      const result = await service.getAllEnterprises({ page: 1 } as any);

      expect(enterpriseRepo.getAllEnterprises).toHaveBeenCalledWith({ page: 1 });
      expect(result).toEqual(response);
    });
  });

  // ── getMyEnterprises ──────────────────────────────────────────────

  describe('getMyEnterprises', () => {
    it('should delegate to repository', async () => {
      const response = { data: [mockEnterprise], metadata: { total: 1, page: 1, hasNextPage: false, hasPreviousPage: false, lastPage: 1 } };
      enterpriseRepo.getMyEnterprises.mockResolvedValue(response);

      const result = await service.getMyEnterprises('user-1', { page: 1 } as any);

      expect(enterpriseRepo.getMyEnterprises).toHaveBeenCalledWith('user-1', { page: 1 });
      expect(result).toEqual(response);
    });
  });

  // ── updateEnterprise ───────────────────────────────────────────────

  describe('updateEnterprise', () => {
    it('should update when user has OWNER role', async () => {
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue('OWNER');
      enterpriseRepo.updateEnterprise.mockResolvedValue({ ...mockEnterprise, name: 'Updated' });

      const result = await service.updateEnterprise('ent-1', 'user-1', { name: 'Updated' } as any);

      expect(result.name).toBe('Updated');
    });

    it('should update when user has ADMIN role', async () => {
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue('ADMIN');
      enterpriseRepo.updateEnterprise.mockResolvedValue({ ...mockEnterprise, name: 'Updated' });

      const result = await service.updateEnterprise('ent-1', 'user-1', { name: 'Updated' } as any);

      expect(result.name).toBe('Updated');
    });

    it('should throw ForbiddenException for EMPLOYEE role', async () => {
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue('EMPLOYEE');

      await expect(
        service.updateEnterprise('ent-1', 'user-1', { name: 'X' } as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when user has no role', async () => {
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue(null);

      await expect(
        service.updateEnterprise('ent-1', 'outsider', {} as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should update shortPath when provided and available', async () => {
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue('OWNER');
      urlShortenerRepo.isPathAvailable.mockResolvedValue(true);
      urlShortenerRepo.findByEnterpriseId.mockResolvedValue({ path: 'old-path' });
      urlShortenerRepo.updatePath.mockResolvedValue({});
      enterpriseRepo.updateEnterprise.mockResolvedValue({ ...mockEnterprise, shortPath: 'new-path' });

      await service.updateEnterprise('ent-1', 'user-1', { shortPath: 'new-path' } as any);

      expect(urlShortenerRepo.updatePath).toHaveBeenCalled();
    });

    it('should throw ConflictException when shortPath is taken', async () => {
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue('OWNER');
      urlShortenerRepo.isPathAvailable.mockResolvedValue(false);

      await expect(
        service.updateEnterprise('ent-1', 'user-1', { shortPath: 'taken-path' } as any),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ── deleteEnterprise ───────────────────────────────────────────────

  describe('deleteEnterprise', () => {
    it('should delete when user is owner and soft delete url shortener', async () => {
      enterpriseRepo.checkUserIsOwner.mockResolvedValue(true);
      enterpriseRepo.deleteEnterprise.mockResolvedValue({ success: true, id: 'ent-1' });
      urlShortenerRepo.softDeleteByEnterpriseId.mockResolvedValue(undefined);

      await service.deleteEnterprise('ent-1', 'user-1');

      expect(urlShortenerRepo.softDeleteByEnterpriseId).toHaveBeenCalledWith('ent-1');
      expect(enterpriseRepo.deleteEnterprise).toHaveBeenCalledWith('ent-1');
    });

    it('should throw ForbiddenException when not owner', async () => {
      enterpriseRepo.checkUserIsOwner.mockResolvedValue(false);

      await expect(
        service.deleteEnterprise('ent-1', 'not-owner'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── transferOwnership ──────────────────────────────────────────────

  describe('transferOwnership', () => {
    it('should transfer when current user is owner and new owner is member', async () => {
      enterpriseRepo.checkUserIsOwner.mockResolvedValue(true);
      enterpriseRepo.checkUserIsMember.mockResolvedValue(true);
      enterpriseRepo.transferOwnership.mockResolvedValue({ success: true });

      await service.transferOwnership('ent-1', 'user-1', { newOwnerId: 'user-2' });

      expect(enterpriseRepo.transferOwnership).toHaveBeenCalledWith('ent-1', 'user-2');
    });

    it('should throw ForbiddenException when not owner', async () => {
      enterpriseRepo.checkUserIsOwner.mockResolvedValue(false);

      await expect(
        service.transferOwnership('ent-1', 'user-1', { newOwnerId: 'user-2' }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException when new owner is not a member', async () => {
      enterpriseRepo.checkUserIsOwner.mockResolvedValue(true);
      enterpriseRepo.checkUserIsMember.mockResolvedValue(false);

      await expect(
        service.transferOwnership('ent-1', 'user-1', { newOwnerId: 'outsider' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ── validateUserAccess ─────────────────────────────────────────────

  describe('validateUserAccess', () => {
    it('should pass when user is a member', async () => {
      enterpriseRepo.checkUserIsMember.mockResolvedValue(true);

      await expect(
        service.validateUserAccess('ent-1', 'user-1'),
      ).resolves.toBeUndefined();
    });

    it('should throw ForbiddenException when not a member', async () => {
      enterpriseRepo.checkUserIsMember.mockResolvedValue(false);

      await expect(
        service.validateUserAccess('ent-1', 'outsider'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── validateUserRole ───────────────────────────────────────────────

  describe('validateUserRole', () => {
    it('should pass when user has allowed role', async () => {
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue('ADMIN');

      await expect(
        service.validateUserRole('ent-1', 'user-1', ['OWNER', 'ADMIN']),
      ).resolves.toBeUndefined();
    });

    it('should throw ForbiddenException when role not allowed', async () => {
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue('EMPLOYEE');

      await expect(
        service.validateUserRole('ent-1', 'user-1', ['OWNER', 'ADMIN']),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when user has no role', async () => {
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue(null);

      await expect(
        service.validateUserRole('ent-1', 'user-1', ['OWNER']),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── checkShortPathAvailability ─────────────────────────────────────

  describe('checkShortPathAvailability', () => {
    it('should return available: true when path is free', async () => {
      urlShortenerRepo.isPathAvailable.mockResolvedValue(true);

      const result = await service.checkShortPathAvailability('my-enterprise');

      expect(result.available).toBe(true);
    });

    it('should return available: false with reason taken', async () => {
      urlShortenerRepo.isPathAvailable.mockResolvedValue(false);

      const result = await service.checkShortPathAvailability('taken-path');

      expect(result.available).toBe(false);
      expect(result.reason).toBe('taken');
    });

    it('should return invalid for too short paths', async () => {
      const result = await service.checkShortPathAvailability('ab');

      expect(result.available).toBe(false);
      expect(result.reason).toBe('invalid');
    });
  });
});
