import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetUsersParams } from '@global-types/params/user.params';
import {
  GetUsersResponse,
  GetUserByIdResponse,
} from '@global-types/responses/user.response';
import { CreateUserDto, UpdateUserDto } from 'src/modules/user/dto/user.dto';
import { File } from '@nest-lab/fastify-multer';
import * as bcrypt from 'bcrypt';
import Papa from 'papaparse';
import { validateData } from '@global-types/helpers/validateCsvFile';
import { ApiBadRequestResponse } from '@nestjs/swagger';
import { BaseTypeOrmRepository } from '../../../tenant/repositories/base.typeorm.repository';
import { UserEntity } from '../../entities/user.entity';
import { Role } from '../../entities/enums';
import { TENANT_CONNECTION } from '../../../tenant/tenant.module';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  CreateUserOptions,
  IUserContractRepository,
} from './user.contract.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { IUserEntity } from '@global-types/entities/user.entity-type';
import { IUserAuthCodesPayload } from '@global-types/entities/user-auth-codes.entity-type';

@Injectable()
export class UserTypeOrmRepository
  implements IUserContractRepository
{
  private repo: Repository<UserEntity>;
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
   this.repo= this.dataSource.getRepository(UserEntity);
  }

  private normalizeOptionalCpf(cpf?: string | null): string | null {
    const trimmed = cpf?.trim();
    return trimmed ? trimmed : null;
  }

  async createUser(
    data: CreateUserDto,
    options?: CreateUserOptions,
  ): Promise<GetUserByIdResponse> {
    const normalizedCpf = this.normalizeOptionalCpf(data.cpf);
    const saltRounds = parseInt(
      this.configService.get('BCRYPT_SALT_ROUNDS') || '10',
      10,
    );
    const hashedPassword = await bcrypt.hash(
      data.password ? data.password : normalizedCpf || '',
      saltRounds,
    );

    const emailConfirmed =
      options?.emailConfirmed !== undefined
        ? options.emailConfirmed
        : true;
    const authCodes =
      options?.authCodes !== undefined ? options.authCodes : null;

    const user = this.repo.create({
      ...data,
      cpf: normalizedCpf,
      role: (data.role || Role.USER) as any,
      password: hashedPassword,
      emailConfirmed,
      authCodes,
    });
    const saved = await this.repo.save(user);
    return this.omitPassword(saved);
  }

  async getAllUsers(
    params: GetUsersParams,
  ): Promise<GetUsersResponse> {
    let {
      page = 1,
      pageSize = 10,
      search = '',
      role,
    } = params;
    page = Math.max(1, page);
    const skip = (page - 1) * pageSize;

    const qb = this.repo
      .createQueryBuilder('u')
      .select([
        'u.id',
        'u.name',
        'u.email',
        'u.cpf',
        'u.imageUrl',
        'u.role',
        'u.age',
        'u.isActive',
        'u.createdAt',
        'u.updatedAt',
      ])
      .orderBy('u.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize);

    if (search) {
      qb.andWhere(
        '(LOWER(u.name) LIKE LOWER(:search) OR LOWER(u.email) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    if (role && role !== 'ALL') {
      qb.andWhere('u.role = :role', { role });
    }

    const [users, total] = await qb.getManyAndCount();

    return {
      data: users as GetUsersResponse['data'],
      metadata: {
        page,
        hasNextPage: total > page * pageSize,
        hasPreviousPage: page > 1,
        search: search || '',
        total,
      },
    };
  }

  async getUserByEmail(
    email: string,
  ): Promise<IUserEntity> {
    const user = await this.repo.findOne({ where: { email } });
    return user 
  }

  async comparePassword(
    id: string,
    password: string,
  ): Promise<boolean> {
    const user = await this.repo.findOne({ where: { id } });
    return await bcrypt.compare(password, user.password);
  }

  async getUserById(
    id: string,
  ): Promise<GetUserByIdResponse> {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['tenants'],
    });
    if (!user) {
      return null;
    }
    const hasTenantMembership = (user.tenants?.length ?? 0) > 0;
    const { password: _p, authCodes: _a, tenants: _t, ...rest } = user;
    return {
      ...rest,
      hasTenantMembership,
    } as GetUserByIdResponse;
  }

  async updateUser(
    id: string,
    data: UpdateUserDto,
  ): Promise<GetUserByIdResponse> {
    const updateData = { ...data } as Partial<UserEntity>;
    if ('cpf' in data) {
      updateData.cpf = this.normalizeOptionalCpf(data.cpf);
    }
    await this.repo.update(id, updateData);
    const user = await this.repo.findOne({ where: { id } });
    return user ? this.omitPassword(user) : null;
  }

  async deleteUser(
    id: string,
  ): Promise<{ success: boolean; id: string }> {
    await this.repo.softDelete(id);
    return { success: true, id };
  }

  async createUsersByFile(
    file: File,
  ): Promise<{ success: boolean; message: string }> {
    if (!file) {
      return {
        message:
          'Não é possível criar usuários sem arquivo',
        success: false,
      };
    }

    const permittedFields = [
      'name',
      'email',
      'cpf',
      'age',
      'gender',
      'role',
      'coins',
    ];
    const createUsersData: CreateUserDto[] = [];

    return new Promise((resolve, reject) => {
      Papa.parse(file.buffer.toString(), {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const { data } = results;
            const { errors, sanitizedData } =
              validateData(data);
            if (errors.length > 0) {
              return reject(ApiBadRequestResponse());
            }
            const saltRounds = parseInt(
              this.configService.get(
                'BCRYPT_SALT_ROUNDS',
              ) || '10',
              10,
            );

            for (const user of sanitizedData) {
              const userData: Partial<CreateUserDto> = {};
              for (const field of permittedFields) {
                if (user[field]) {
                  (userData as any)[field] =
                    field === 'age' || field === 'coins'
                      ? Number(user[field])
                      : user[field];
                }
              }
              const hashedPassword = await bcrypt.hash(
                user.cpf || '',
                saltRounds,
              );
              const entity = this.repo.create({
                ...userData,
                password: hashedPassword,
              } as Partial<UserEntity>);
              await this.repo.save(entity);
            }
            resolve({
              success: true,
              message: 'Users created successfully.',
            });
          } catch (err) {
            reject(err);
          }
        },
        error: (err) => reject(err),
      });
    });
  }

  async validateRegistrationCodeAndConfirm(
    userId: string,
    code: string,
  ): Promise<GetUserByIdResponse | null> {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) {
      return null;
    }
    if (user.emailConfirmed) {
      return this.omitPassword(user);
    }
    if (!user.authCodes) {
      return null;
    }
    const ac = user.authCodes;
    if (new Date(ac.expiresAt) < new Date()) {
      return null;
    }
    const normalized = code.replace(/\D/g, '');
    if (normalized.length !== 6 || ac.code !== normalized) {
      return null;
    }
    user.emailConfirmed = true;
    user.authCodes = null;
    const saved = await this.repo.save(user);
    return this.omitPassword(saved);
  }

  async setUserAuthCodes(
    userId: string,
    authCodes: IUserAuthCodesPayload | null,
  ): Promise<void> {
    await this.repo.update(userId, {
      authCodes,
    } as Partial<UserEntity>);
  }

  async confirmEmailByUserId(
    userId: string,
  ): Promise<GetUserByIdResponse | null> {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) {
      return null;
    }
    user.emailConfirmed = true;
    user.authCodes = null;
    const saved = await this.repo.save(user);
    return this.omitPassword(saved);
  }

  async resetPassword(
    id: string,
  ): Promise<GetUserByIdResponse> {
    const repo =
        this.dataSource.getRepository(UserEntity);
    const saltRounds = parseInt(
      this.configService.get('BCRYPT_SALT_ROUNDS') || '10',
      10,
    );
    const hashedPassword = await bcrypt.hash(
      'myndseducation',
      saltRounds,
    );
    await repo.update(id, {
      password: hashedPassword,
    } as Partial<UserEntity>);
    const user = await repo.findOne({ where: { id } });
    return user ? this.omitPassword(user) : null;
  }

  private omitPassword(
    user: UserEntity,
  ): GetUserByIdResponse {
    const { password: _p, authCodes: _a, ...rest } = user;
    return rest as GetUserByIdResponse;
  }
}
