import {
  IGetEnterprisesParams,
  IGetMyEnterprisesParams,
} from '@global-types/params/enterprise.params';
import {
  IGetEnterprisesResponse,
  IGetEnterpriseByIdResponse,
  IGetMyEnterprisesResponse,
  ICreateEnterpriseResponse,
  IUpdateEnterpriseResponse,
  IDeleteEnterpriseResponse,
  ITransferOwnershipResponse,
} from '@global-types/responses/enterprise.response';
import {
  CreateEnterpriseDto,
  UpdateEnterpriseDto,
  UpdateEnterpriseGoogleTokensDto,
} from '../../../../../modules/enterprise/dto/enterprise.dto';

export abstract class IEnterpriseContractRepository {
  abstract createEnterprise(
    ownerId: string,
    data: CreateEnterpriseDto,
  ): Promise<ICreateEnterpriseResponse>;

  abstract getAllEnterprises(
    params: IGetEnterprisesParams,
  ): Promise<IGetEnterprisesResponse>;

  abstract getEnterpriseById(
    id: string,
  ): Promise<IGetEnterpriseByIdResponse>;

  abstract getMyEnterprises(
    userId: string,
    params: IGetMyEnterprisesParams,
  ): Promise<IGetMyEnterprisesResponse>;

  abstract updateEnterprise(
    id: string,
    data: UpdateEnterpriseDto,
  ): Promise<IUpdateEnterpriseResponse>;

  abstract deleteEnterprise(
    id: string,
  ): Promise<IDeleteEnterpriseResponse>;

  abstract transferOwnership(
    enterpriseId: string,
    newOwnerId: string,
  ): Promise<ITransferOwnershipResponse>;

  abstract updateGoogleTokens(
    enterpriseId: string,
    data: UpdateEnterpriseGoogleTokensDto,
  ): Promise<IUpdateEnterpriseResponse>;

  abstract checkUserIsMember(
    enterpriseId: string,
    userId: string,
  ): Promise<boolean>;

  abstract checkUserIsOwner(
    enterpriseId: string,
    userId: string,
  ): Promise<boolean>;

  abstract getUserRoleInEnterprise(
    enterpriseId: string,
    userId: string,
  ): Promise<string | null>;
}

