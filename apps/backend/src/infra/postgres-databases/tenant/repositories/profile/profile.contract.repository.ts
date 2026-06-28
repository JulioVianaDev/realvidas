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

export abstract class IProfileContractRepository {
  // ── Profile CRUD ──
  abstract getAll(
    params: IGetProfilesParams,
  ): Promise<IGetProfilesResponse>;

  abstract getById(id: string): Promise<IGetProfileByIdResponse>;

  abstract create(
    data: ICreateProfileBodyRequest,
  ): Promise<ICreateProfileResponse>;

  abstract update(
    id: string,
    data: IUpdateProfileBodyRequest,
  ): Promise<IUpdateProfileResponse>;

  abstract remove(id: string): Promise<IDeleteProfileResponse>;

  // ── User ↔ profile links (vinculus) ──
  abstract getProfilesByUser(
    userId: string,
  ): Promise<IGetUserAssignedProfilesResponse>;

  abstract setUserProfiles(
    userId: string,
    profileIds: string[],
  ): Promise<IAssignUserProfilesResponse>;
}
