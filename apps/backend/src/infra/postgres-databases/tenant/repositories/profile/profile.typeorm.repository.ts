import { Injectable, Inject } from '@nestjs/common';
import { EntityManager, ILike, Repository } from 'typeorm';
import { IGetProfilesParams } from '@global-types/params/profile.params';
import {
  IGetProfilesResponse,
  IGetProfileByIdResponse,
  ICreateProfileResponse,
  IUpdateProfileResponse,
  IDeleteProfileResponse,
  IGetUserAssignedProfilesResponse,
  IAssignUserProfilesResponse,
} from '@global-types/responses/profile.response';
import {
  ICreateProfileBodyRequest,
  IUpdateProfileBodyRequest,
} from '@global-types/body-requests/profile.body-request';
import { ProfileEntity } from '../../entities/profile.entity';
import { UserProfilePivotEntity } from '../../entities/pivot/user-profile.pivot.entity';
import { TENANT_CONNECTION } from '../../tenant.module';
import { IProfileContractRepository } from './profile.contract.repository';
import { BaseTypeOrmRepository } from '../base.typeorm.repository';

@Injectable()
export class ProfileTypeOrmRepository
  extends BaseTypeOrmRepository
  implements IProfileContractRepository
{
  private repo: Repository<ProfileEntity>;
  private pivotRepo: Repository<UserProfilePivotEntity>;

  constructor(
    @Inject(TENANT_CONNECTION)
    entityManager: EntityManager | null,
  ) {
    super(entityManager);
    this.repo = this.getManager().getRepository(ProfileEntity);
    this.pivotRepo = this.getManager().getRepository(
      UserProfilePivotEntity,
    );
  }

  async getAll(
    params: IGetProfilesParams,
  ): Promise<IGetProfilesResponse> {
    const { page = 1, pageSize = 20, search } = params;
    const [data, total] = await this.repo.findAndCount({
      where: search ? { name: ILike(`%${search}%`) } : {},
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });
    return {
      data: data as unknown as IGetProfilesResponse['data'],
      metadata: {
        page,
        total,
        hasNextPage: total > page * pageSize,
        hasPreviousPage: page > 1,
        lastPage: Math.ceil(total / pageSize),
      },
    };
  }

  async getById(id: string): Promise<IGetProfileByIdResponse> {
    return this.repo.findOne({
      where: { id },
    }) as unknown as Promise<IGetProfileByIdResponse>;
  }

  async create(
    data: ICreateProfileBodyRequest,
  ): Promise<ICreateProfileResponse> {
    const created = this.repo.create({
      name: data.name,
      modules: data.modules,
      permitAll: data.permitAll,
    });
    const saved = await this.repo.save(created);
    return saved as unknown as ICreateProfileResponse;
  }

  async update(
    id: string,
    data: IUpdateProfileBodyRequest,
  ): Promise<IUpdateProfileResponse> {
    await this.repo.update(id, data as Partial<ProfileEntity>);
    return this.repo.findOne({
      where: { id },
    }) as unknown as Promise<IUpdateProfileResponse>;
  }

  async remove(id: string): Promise<IDeleteProfileResponse> {
    // Hard-delete the pivot links, soft-delete the profile itself.
    await this.pivotRepo.delete({ profileId: id });
    await this.repo.softDelete(id);
    return { success: true, id };
  }

  async getProfilesByUser(
    userId: string,
  ): Promise<IGetUserAssignedProfilesResponse> {
    const links = await this.pivotRepo.find({
      where: { userId },
      relations: ['profile'],
    });
    return links
      .map((link) => link.profile as ProfileEntity | null)
      .filter(
        (profile): profile is ProfileEntity =>
          !!profile && !profile.deletedAt,
      ) as unknown as IGetUserAssignedProfilesResponse;
  }

  async setUserProfiles(
    userId: string,
    profileIds: string[],
  ): Promise<IAssignUserProfilesResponse> {
    // Replace the user's full set of links.
    await this.pivotRepo.delete({ userId });
    if (profileIds.length > 0) {
      const links = profileIds.map((profileId) =>
        this.pivotRepo.create({ userId, profileId }),
      );
      await this.pivotRepo.save(links);
    }
    return { userId, profileIds };
  }
}
