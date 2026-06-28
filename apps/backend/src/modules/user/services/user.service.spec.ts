import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { REPOSITORY_TOKENS_MAIN } from 'src/infra/postgres-databases/main/repository-tokens';
import {
  createMockUserRepository,
  createMockDataSource,
  mockMainRepository,
} from 'src/test-utils/database-mock';
import {
  createMockSocketService,
  createMockUserTenantViewCacheService,
  createMockTranslatorService,
} from 'src/test-utils/service-mock';
import { SocketService } from 'src/modules/socket/socket.service';
import { UserTenantViewCacheService } from 'src/infra/postgres-databases/tenant/user-tenant-view-cache.service';
import { BackendTranslatorService } from 'src/modules/common/services/backend-translator.service';
import { RoleValues } from '@global-types/entities/user.entity-type';
import { Role } from 'src/infra/postgres-databases/main/entities/enums';

describe('UserService', () => {
  let service: UserService;
  let userRepository: ReturnType<typeof createMockUserRepository>;
  let dataSource: ReturnType<typeof createMockDataSource>;
  let socketService: ReturnType<typeof createMockSocketService>;
  let tenantViewCache: ReturnType<
    typeof createMockUserTenantViewCacheService
  >;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER' as const,
    emailConfirmed: true,
    language: 'pt-BR',
    theme: 'light',
    currentTenantViewId: null as string | null,
    imageUrl: null,
  };

  beforeEach(async () => {
    userRepository = createMockUserRepository();
    dataSource = createMockDataSource();
    socketService = createMockSocketService();
    tenantViewCache = createMockUserTenantViewCacheService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getDataSourceToken(), useValue: dataSource },
        mockMainRepository(
          REPOSITORY_TOKENS_MAIN.USER_REPOSITORY,
          userRepository,
        ),
        { provide: SocketService, useValue: socketService },
        {
          provide: UserTenantViewCacheService,
          useValue: tenantViewCache,
        },
        {
          provide: BackendTranslatorService,
          useValue: createMockTranslatorService(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── createUser ─────────────────────────────────────────────────────

  describe('createUser', () => {
    it('should delegate to repository', async () => {
      const dto = {
        email: 'a@b.com',
        name: 'A',
        password: '123',
        role: Role.USER,
      };
      userRepository.createUser.mockResolvedValue({
        ...mockUser,
        ...dto,
      });

      const result = await service.createUser(dto);

      expect(userRepository.createUser).toHaveBeenCalledWith(
        dto,
        undefined,
      );
      expect(result.email).toBe('a@b.com');
    });
  });

  // ── getAllUsers ─────────────────────────────────────────────────────

  describe('getAllUsers', () => {
    it('should return paginated user list', async () => {
      const response = {
        data: [mockUser],
        metadata: {
          total: 1,
          page: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          lastPage: 1,
        },
      };
      userRepository.getAllUsers.mockResolvedValue(response);

      const result = await service.getAllUsers({ page: 1 } as any);

      expect(result).toEqual(response);
    });
  });

  // ── getUserById ────────────────────────────────────────────────────

  describe('getUserById', () => {
    it('should return user when found', async () => {
      userRepository.getUserById.mockResolvedValue(mockUser);

      const result = await service.getUserById('user-1');

      expect(result).toEqual(mockUser);
    });

    it('should return null/undefined when not found', async () => {
      userRepository.getUserById.mockResolvedValue(null);

      const result = await service.getUserById('missing');

      expect(result).toBeNull();
    });
  });

  // ── updateUser ─────────────────────────────────────────────────────

  describe('updateUser', () => {
    it('should delegate update to repository', async () => {
      const updated = { ...mockUser, name: 'Updated' };
      userRepository.updateUser.mockResolvedValue(updated);

      const result = await service.updateUser('user-1', {
        name: 'Updated',
      });

      expect(result.name).toBe('Updated');
    });
  });

  // ── patchMyUiPreferences ───────────────────────────────────────────

  describe('patchMyUiPreferences', () => {
    it('should return current preferences when no changes provided', async () => {
      userRepository.getUserById.mockResolvedValue(mockUser);

      const result = await service.patchMyUiPreferences('user-1', {});

      expect(result).toEqual({
        id: 'user-1',
        language: 'pt-BR',
        theme: 'light',
      });
    });

    it('should update preferences and return new values', async () => {
      userRepository.updateUser.mockResolvedValue({
        ...mockUser,
        theme: 'dark',
      });

      const result = await service.patchMyUiPreferences('user-1', {
        theme: 'dark',
      });

      expect(result.theme).toBe('dark');
      expect(userRepository.updateUser).toHaveBeenCalledWith(
        'user-1',
        { theme: 'dark' },
      );
    });

    it('should throw NotFoundException when no data and user missing', async () => {
      userRepository.getUserById.mockResolvedValue(null);

      await expect(
        service.patchMyUiPreferences('missing', {}),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when update returns null', async () => {
      userRepository.updateUser.mockResolvedValue(null);

      await expect(
        service.patchMyUiPreferences('user-1', { language: 'en-US' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── patchMyCurrentTenant ───────────────────────────────────────────

  describe('patchMyCurrentTenant', () => {
    it('should update tenant for ADMIN user', async () => {
      const adminUser = {
        ...mockUser,
        role: 'ADMIN',
        currentTenantViewId: null,
      };
      userRepository.getUserById
        .mockResolvedValueOnce(adminUser)
        .mockResolvedValueOnce({
          ...adminUser,
          currentTenantViewId: 'tenant-2',
        });
      dataSource.getRepository.mockReturnValue({
        update: jest.fn().mockResolvedValue({}),
      });

      const result = await service.patchMyCurrentTenant('user-1', {
        tenantId: 'tenant-2',
      });

      expect(tenantViewCache.set).toHaveBeenCalledWith(
        'user-1',
        'tenant-2',
      );
      expect(socketService.setUserActiveTenant).toHaveBeenCalledWith(
        'user-1',
        'tenant-2',
      );
    });

    it('should throw NotFoundException when user does not exist', async () => {
      userRepository.getUserById.mockResolvedValue(null);

      await expect(
        service.patchMyCurrentTenant('missing', {
          tenantId: 'tenant-1',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when non-admin has no tenant access', async () => {
      userRepository.getUserById.mockResolvedValue({
        ...mockUser,
        role: 'USER',
      });
      dataSource.query.mockResolvedValue([{ exists: false }]);

      await expect(
        service.patchMyCurrentTenant('user-1', {
          tenantId: 'tenant-x',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException when non-admin tries to switch tenant', async () => {
      userRepository.getUserById.mockResolvedValue({
        ...mockUser,
        role: 'USER',
        currentTenantViewId: 'tenant-1',
      });
      dataSource.query.mockResolvedValue([{ exists: true }]);

      await expect(
        service.patchMyCurrentTenant('user-1', {
          tenantId: 'tenant-2',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ── deleteUser ─────────────────────────────────────────────────────

  describe('deleteUser', () => {
    it('should delegate to repository', async () => {
      userRepository.deleteUser.mockResolvedValue({
        success: true,
        id: 'user-1',
      });

      const result = await service.deleteUser('user-1');

      expect(result).toEqual({ success: true, id: 'user-1' });
    });
  });

  // ── resetPassword ──────────────────────────────────────────────────

  describe('resetPassword', () => {
    it('should delegate to repository', async () => {
      userRepository.resetPassword.mockResolvedValue(mockUser);

      const result = await service.resetPassword('user-1');

      expect(result).toEqual(mockUser);
    });
  });
});
