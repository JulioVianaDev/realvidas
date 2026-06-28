import { Test, TestingModule } from '@nestjs/testing';
import {
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EnterpriseMemberService } from './enterprise-member.service';
import { REPOSITORY_TOKENS_TENANT } from 'src/infra/postgres-databases/tenant/repository-tokens';
import {
  createMockEnterpriseMemberRepository,
  createMockEnterpriseRepository,
  mockTenantRepository,
} from 'src/test-utils/database-mock';

describe('EnterpriseMemberService', () => {
  let service: EnterpriseMemberService;
  let memberRepo: ReturnType<typeof createMockEnterpriseMemberRepository>;
  let enterpriseRepo: ReturnType<typeof createMockEnterpriseRepository>;

  const mockMember = {
    id: 'member-1',
    enterpriseId: 'ent-1',
    role: 'EMPLOYEE',
    userId: 'user-2',
  };

  beforeEach(async () => {
    memberRepo = createMockEnterpriseMemberRepository();
    enterpriseRepo = createMockEnterpriseRepository();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnterpriseMemberService,
        mockTenantRepository(REPOSITORY_TOKENS_TENANT.ENTERPRISE_MEMBER_REPOSITORY, memberRepo),
        mockTenantRepository(REPOSITORY_TOKENS_TENANT.ENTERPRISE_REPOSITORY, enterpriseRepo),
      ],
    }).compile();

    service = module.get<EnterpriseMemberService>(EnterpriseMemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── getAllMembers ──────────────────────────────────────────────────

  describe('getAllMembers', () => {
    it('should return members when user is a member of the enterprise', async () => {
      enterpriseRepo.checkUserIsMember.mockResolvedValue(true);
      const response = { data: [mockMember], metadata: { total: 1, page: 1, hasNextPage: false, hasPreviousPage: false, lastPage: 1 } };
      memberRepo.getAllMembers.mockResolvedValue(response);

      const result = await service.getAllMembers({ enterpriseId: 'ent-1', page: 1 } as any, 'user-1');

      expect(enterpriseRepo.checkUserIsMember).toHaveBeenCalledWith('ent-1', 'user-1');
      expect(result).toEqual(response);
    });

    it('should throw ForbiddenException when user is not a member', async () => {
      enterpriseRepo.checkUserIsMember.mockResolvedValue(false);

      await expect(
        service.getAllMembers({ enterpriseId: 'ent-1', page: 1 } as any, 'outsider'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── getMemberById ─────────────────────────────────────────────────

  describe('getMemberById', () => {
    it('should return member when found and user has access', async () => {
      memberRepo.getMemberById.mockResolvedValue(mockMember);
      enterpriseRepo.checkUserIsMember.mockResolvedValue(true);

      const result = await service.getMemberById('member-1', 'user-1');

      expect(result).toEqual(mockMember);
    });

    it('should throw NotFoundException when member does not exist', async () => {
      memberRepo.getMemberById.mockResolvedValue(null);

      await expect(
        service.getMemberById('missing', 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user is not a member of the enterprise', async () => {
      memberRepo.getMemberById.mockResolvedValue(mockMember);
      enterpriseRepo.checkUserIsMember.mockResolvedValue(false);

      await expect(
        service.getMemberById('member-1', 'outsider'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  // ── addMember ─────────────────────────────────────────────────────

  describe('addMember', () => {
    it('should add member when user has OWNER role', async () => {
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue('OWNER');
      memberRepo.getMemberByUserAndEnterprise.mockResolvedValue(null);
      memberRepo.addMember.mockResolvedValue({ ...mockMember, id: 'member-new' });

      const result = await service.addMember('ent-1', 'user-1', { userId: 'user-3', role: 'EMPLOYEE' } as any);

      expect(result.id).toBe('member-new');
      expect(memberRepo.addMember).toHaveBeenCalledWith('ent-1', { userId: 'user-3', role: 'EMPLOYEE' });
    });

    it('should add member when user has ADMIN role', async () => {
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue('ADMIN');
      memberRepo.getMemberByUserAndEnterprise.mockResolvedValue(null);
      memberRepo.addMember.mockResolvedValue(mockMember);

      await service.addMember('ent-1', 'user-1', { userId: 'user-3', role: 'EMPLOYEE' } as any);

      expect(memberRepo.addMember).toHaveBeenCalled();
    });

    it('should add member when user has MANAGER role', async () => {
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue('MANAGER');
      memberRepo.getMemberByUserAndEnterprise.mockResolvedValue(null);
      memberRepo.addMember.mockResolvedValue(mockMember);

      await service.addMember('ent-1', 'user-1', { userId: 'user-3', role: 'EMPLOYEE' } as any);

      expect(memberRepo.addMember).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user has EMPLOYEE role', async () => {
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue('EMPLOYEE');

      await expect(
        service.addMember('ent-1', 'user-1', { userId: 'user-3', role: 'EMPLOYEE' } as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException when user has no role', async () => {
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue(null);

      await expect(
        service.addMember('ent-1', 'outsider', { userId: 'user-3', role: 'EMPLOYEE' } as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException when user is already a member', async () => {
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue('OWNER');
      memberRepo.getMemberByUserAndEnterprise.mockResolvedValue(mockMember);

      await expect(
        service.addMember('ent-1', 'user-1', { userId: 'user-2', role: 'EMPLOYEE' } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ── updateMember ──────────────────────────────────────────────────

  describe('updateMember', () => {
    it('should update member when user has permission', async () => {
      memberRepo.getMemberById.mockResolvedValue(mockMember);
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue('OWNER');
      memberRepo.updateMember.mockResolvedValue({ ...mockMember, role: 'MANAGER' });

      const result = await service.updateMember('member-1', 'user-1', { role: 'MANAGER' } as any);

      expect(result.role).toBe('MANAGER');
    });

    it('should throw NotFoundException when member does not exist', async () => {
      memberRepo.getMemberById.mockResolvedValue(null);

      await expect(
        service.updateMember('missing', 'user-1', { role: 'MANAGER' } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user has EMPLOYEE role', async () => {
      memberRepo.getMemberById.mockResolvedValue(mockMember);
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue('EMPLOYEE');

      await expect(
        service.updateMember('member-1', 'user-1', { role: 'MANAGER' } as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException when trying to change owner role', async () => {
      const ownerMember = { ...mockMember, role: 'OWNER' };
      memberRepo.getMemberById.mockResolvedValue(ownerMember);
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue('OWNER');

      await expect(
        service.updateMember('member-1', 'user-1', { role: 'ADMIN' } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ── removeMember ──────────────────────────────────────────────────

  describe('removeMember', () => {
    it('should remove member when user has permission', async () => {
      memberRepo.getMemberById.mockResolvedValue(mockMember);
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue('OWNER');
      memberRepo.removeMember.mockResolvedValue({ success: true, id: 'member-1' });

      const result = await service.removeMember('member-1', 'user-1');

      expect(memberRepo.removeMember).toHaveBeenCalledWith('member-1');
      expect(result).toEqual({ success: true, id: 'member-1' });
    });

    it('should throw NotFoundException when member does not exist', async () => {
      memberRepo.getMemberById.mockResolvedValue(null);

      await expect(
        service.removeMember('missing', 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user has EMPLOYEE role', async () => {
      memberRepo.getMemberById.mockResolvedValue(mockMember);
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue('EMPLOYEE');

      await expect(
        service.removeMember('member-1', 'user-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException when trying to remove owner', async () => {
      const ownerMember = { ...mockMember, role: 'OWNER' };
      memberRepo.getMemberById.mockResolvedValue(ownerMember);
      enterpriseRepo.getUserRoleInEnterprise.mockResolvedValue('OWNER');

      await expect(
        service.removeMember('member-1', 'user-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
