import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { REPOSITORY_TOKENS_TENANT } from 'src/infra';
import { IProfileContractRepository } from 'src/infra/postgres-databases/tenant/repositories/profile/profile.contract.repository';
import { RoleType } from '@global-types/entities/user.entity-type';
import {
  IGetProfilesResponse,
  IGetProfileByIdResponse,
  ICreateProfileResponse,
  IUpdateProfileResponse,
  IDeleteProfileResponse,
  IGetUserAssignedProfilesResponse,
  IAssignUserProfilesResponse,
  IGetMyUserProfileResponse,
} from '@global-types/responses/profile.response';
import { AppModule } from '@global-types/entities/profile.entity-type';
import {
  CreateProfileDto,
  UpdateProfileDto,
  GetProfilesDto,
  AssignUserProfilesDto,
} from '../dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(REPOSITORY_TOKENS_TENANT.PROFILE_REPOSITORY)
    private readonly profileRepository: IProfileContractRepository,
  ) {}

  /**
   * A user may manage profiles if they are a SaaS admin, or if they are linked
   * to at least one profile that has permitAll. Tenant owners receive an
   * "Administrador" (permitAll) profile at provisioning, bootstrapping access.
   */
  private async assertCanManage(
    requesterId: string,
    role: RoleType,
  ): Promise<void> {
    if (role === 'ADMIN') return;
    const profiles =
      await this.profileRepository.getProfilesByUser(requesterId);
    if (!profiles.some((profile) => profile.permitAll)) {
      throw new ForbiddenException(
        'You do not have permission to manage profiles',
      );
    }
  }

  // ── Profile CRUD ──

  async getAll(
    params: GetProfilesDto,
    requesterId: string,
    role: RoleType,
  ): Promise<IGetProfilesResponse> {
    await this.assertCanManage(requesterId, role);
    return this.profileRepository.getAll(params);
  }

  async getById(
    id: string,
    requesterId: string,
    role: RoleType,
  ): Promise<IGetProfileByIdResponse> {
    await this.assertCanManage(requesterId, role);
    const profile = await this.profileRepository.getById(id);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async create(
    data: CreateProfileDto,
    requesterId: string,
    role: RoleType,
  ): Promise<ICreateProfileResponse> {
    await this.assertCanManage(requesterId, role);
    return this.profileRepository.create(data);
  }

  async update(
    id: string,
    data: UpdateProfileDto,
    requesterId: string,
    role: RoleType,
  ): Promise<IUpdateProfileResponse> {
    await this.assertCanManage(requesterId, role);
    const existing = await this.profileRepository.getById(id);
    if (!existing) {
      throw new NotFoundException('Profile not found');
    }
    return this.profileRepository.update(id, data);
  }

  async remove(
    id: string,
    requesterId: string,
    role: RoleType,
  ): Promise<IDeleteProfileResponse> {
    await this.assertCanManage(requesterId, role);
    const existing = await this.profileRepository.getById(id);
    if (!existing) {
      throw new NotFoundException('Profile not found');
    }
    return this.profileRepository.remove(id);
  }

  // ── User ↔ profile links (vinculus) ──

  async getUserProfiles(
    userId: string,
    requesterId: string,
    role: RoleType,
  ): Promise<IGetUserAssignedProfilesResponse> {
    await this.assertCanManage(requesterId, role);
    return this.profileRepository.getProfilesByUser(userId);
  }

  async assignUserProfiles(
    data: AssignUserProfilesDto,
    requesterId: string,
    role: RoleType,
  ): Promise<IAssignUserProfilesResponse> {
    await this.assertCanManage(requesterId, role);
    return this.profileRepository.setUserProfiles(
      data.userId,
      data.profileIds,
    );
  }

  // ── Effective permissions (sidebar) ──

  /**
   * Effective permissions for the authenticated user. When the user has no
   * profile yet, default to permitAll=true so nobody is locked out before an
   * admin configures their profiles.
   */
  async getMyPermissions(
    userId: string,
    role: RoleType,
  ): Promise<IGetMyUserProfileResponse> {
    const profiles =
      await this.profileRepository.getProfilesByUser(userId);

    const permitAllLinked = profiles.some(
      (profile) => profile.permitAll,
    );
    const canManage = role === 'ADMIN' || permitAllLinked;

    if (profiles.length === 0) {
      return { modules: [], permitAll: true, canManage };
    }

    const modules = Array.from(
      new Set(
        profiles.flatMap((profile) => profile.modules),
      ),
    ) as AppModule[];

    return { modules, permitAll: permitAllLinked, canManage };
  }
}
