import { Transform } from 'class-transformer';
import { IsString, IsUUID, Length, Matches } from 'class-validator';
import { Exact } from '@global-types/helpers/exact';
import {
  IConfirmEmailLinkBodyRequest,
  IResendVerificationCodeBodyRequest,
  IResendVerificationFromLinkBodyRequest,
  IVerifyRegistrationCodeBodyRequest,
} from '@global-types/body-requests/auth.body-request';

export class VerifyRegistrationCodeDto
  implements
    Exact<
      VerifyRegistrationCodeDto,
      IVerifyRegistrationCodeBodyRequest
    >
{
  @IsUUID()
  userId: string;

  /** Global pipe may coerce numeric-looking strings to numbers; normalize to digits string. */
  @Transform(({ value }) => {
    if (value == null || value === '') return value;
    return String(value).replace(/\D/g, '');
  })
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/, { message: 'Code must be 6 digits' })
  code: string;
}

export class ConfirmEmailLinkDto
  implements Exact<ConfirmEmailLinkDto, IConfirmEmailLinkBodyRequest>
{
  @IsString()
  token: string;
}

export class ResendVerificationCodeDto
  implements
    Exact<
      ResendVerificationCodeDto,
      IResendVerificationCodeBodyRequest
    >
{
  @IsUUID()
  userId: string;
}

export class ResendVerificationFromLinkDto
  implements
    Exact<
      ResendVerificationFromLinkDto,
      IResendVerificationFromLinkBodyRequest
    >
{
  @IsString()
  token: string;
}
