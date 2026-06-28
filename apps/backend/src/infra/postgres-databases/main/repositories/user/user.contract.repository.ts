import { GetUsersParams } from '@global-types/params/user.params';
import {
  GetUsersResponse,
  GetUserByIdResponse,
} from '@global-types/responses/user.response';
import { IUserAuthCodesPayload } from '@global-types/entities/user-auth-codes.entity-type';
import {
  CreateUserDto,
  UpdateUserDto,
} from '../../../../../modules/user/dto/user.dto';
import { File } from '@nest-lab/fastify-multer';

export type CreateUserOptions = {
  emailConfirmed?: boolean;
  authCodes?: IUserAuthCodesPayload | null;
};

export abstract class IUserContractRepository {
  abstract createUser(
    data: CreateUserDto,
    options?: CreateUserOptions,
  ): Promise<GetUserByIdResponse>;

  abstract getAllUsers(
    params: GetUsersParams,
  ): Promise<GetUsersResponse>;

  abstract getUserById(
    id: string,
  ): Promise<GetUserByIdResponse>;

  abstract getUserByEmail(
    email: string,
  ): Promise<GetUserByIdResponse>;

  abstract comparePassword(
    id: string,
    password: string,
  ): Promise<boolean>;

  abstract updateUser(
    id: string,
    data: UpdateUserDto,
  ): Promise<GetUserByIdResponse>;

  abstract deleteUser(
    id: string,
  ): Promise<{ success: boolean; id: string }>;

  abstract createUsersByFile(
    file: File,
  ): Promise<{ success: boolean; message: string }>;

  abstract resetPassword(
    id: string,
  ): Promise<GetUserByIdResponse>;

  abstract validateRegistrationCodeAndConfirm(
    userId: string,
    code: string,
  ): Promise<GetUserByIdResponse | null>;

  abstract confirmEmailByUserId(
    userId: string,
  ): Promise<GetUserByIdResponse | null>;

  abstract setUserAuthCodes(
    userId: string,
    authCodes: IUserAuthCodesPayload | null,
  ): Promise<void>;
}
