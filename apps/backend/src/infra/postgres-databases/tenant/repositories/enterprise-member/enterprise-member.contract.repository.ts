import { IGetEnterpriseMembersParams } from '@global-types/params/enterprise-member.params';
import {
  IGetEnterpriseMembersResponse,
  IGetEnterpriseMemberByIdResponse,
  IAddEnterpriseMemberResponse,
  IUpdateEnterpriseMemberResponse,
  IDeleteEnterpriseMemberResponse,
} from '@global-types/responses/enterprise-member.response';
import {
  AddEnterpriseMemberDto,
  UpdateEnterpriseMemberDto,
} from '../../../../../modules/enterprise-member/dto/enterprise-member.dto';

export abstract class IEnterpriseMemberContractRepository {
  abstract getAllMembers(
    params: IGetEnterpriseMembersParams,
  ): Promise<IGetEnterpriseMembersResponse>;

  abstract getMemberById(
    id: string,
  ): Promise<IGetEnterpriseMemberByIdResponse>;

  abstract getMemberByUserAndEnterprise(
    enterpriseId: string,
    userId: string,
  ): Promise<IGetEnterpriseMemberByIdResponse>;

  abstract addMember(
    enterpriseId: string,
    data: AddEnterpriseMemberDto,
  ): Promise<IAddEnterpriseMemberResponse>;

  abstract updateMember(
    id: string,
    data: UpdateEnterpriseMemberDto,
  ): Promise<IUpdateEnterpriseMemberResponse>;

  abstract removeMember(
    id: string,
  ): Promise<IDeleteEnterpriseMemberResponse>;
}

