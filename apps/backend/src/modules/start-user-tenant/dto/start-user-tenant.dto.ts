import { IsString, IsOptional, Validate, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { IStartUserTenantBodyRequest } from '@global-types/body-requests/start-user-tenant.body-request';
import { Exact } from '@global-types/helpers/exact';
import { validateCpf } from '@global-types/helpers/validateCpf';

@ValidatorConstraint({ name: 'isCpfValid', async: false })
class IsCpfValid implements ValidatorConstraintInterface {
  validate(value: string | null | undefined): boolean {
    if (!value) return true;
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 11) return false;
    return validateCpf(digits);
  }

  defaultMessage(): string {
    return 'Invalid CPF';
  }
}

export class StartUserTenantDto
  implements Exact<StartUserTenantDto, IStartUserTenantBodyRequest>
{
  @IsString()
  enterpriseName: IStartUserTenantBodyRequest['enterpriseName'];

  @IsString()
  @IsOptional()
  @Validate(IsCpfValid)
  cpf: IStartUserTenantBodyRequest['cpf'];

  @IsString()
  @IsOptional()
  cnpj: IStartUserTenantBodyRequest['cnpj'];

  @IsString()
  @IsOptional()
  email: IStartUserTenantBodyRequest['email'];

  @IsString()
  @IsOptional()
  timezone: IStartUserTenantBodyRequest['timezone'];
}
