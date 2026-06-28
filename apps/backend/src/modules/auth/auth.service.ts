import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'crypto';
import {
  IAuthLoginResponse,
  IRegisterResponse,
  IResendVerificationResponse,
  IVerificationLinkContextResponse,
} from '@global-types/responses/auth.response';
import { IUserAuthCodesPayload } from '@global-types/entities/user-auth-codes.entity-type';
import { OAuth2Client } from 'google-auth-library';
import { REPOSITORY_TOKENS_MAIN } from 'src/infra/postgres-databases/main/repository-tokens';
import { IUserContractRepository } from 'src/infra/postgres-databases/main/repositories/user/user.contract.repository';
import { Role } from 'src/infra/postgres-databases/main/entities/enums';
import { MailService } from '../mail/mail.service';
import { MailTemplateType } from '../mail/dto/send-template.dto';
import { CreateUserDto } from '../user/dto/user.dto';
import { BackendTranslatorService } from '../common/services/backend-translator.service';
import { normalizeBackendAuthLocale } from '@global-types/backend-translations';

const EMAIL_CONFIRM_PURPOSE = 'email-confirm' as const;
const CODE_TTL_MS = 5 * 60 * 1000;

function generateSixDigitCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly translator: BackendTranslatorService,
    @Inject(REPOSITORY_TOKENS_MAIN.USER_REPOSITORY)
    private readonly userRepository: IUserContractRepository,
  ) {}

  async loginUser(data: {
    email: string;
    password: string;
  }): Promise<IAuthLoginResponse> {
    const { email, password } = data;

    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException(
        this.translator.authMessage('AUTH_LOGIN_USER_NOT_FOUND'),
      );
    }

    const isPasswordValid = await this.userRepository.comparePassword(
      user.id,
      password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        this.translator.authMessage('AUTH_LOGIN_INVALID_PASSWORD'),
      );
    }
    return this.issueAuthToken(
      user.id,
      user.role,
      user.email,
      user.emailConfirmed,
      user.language,
      user.currentTenantViewId,
    );
  }

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException(
        this.translator.authMessage('AUTH_TOKEN_INVALID'),
      );
    }
  }

  async googleLogin(
    token: string,
    redirectUri?: string,
  ): Promise<IAuthLoginResponse> {
    try {
      const resolvedRedirectUri =
        redirectUri ||
        this.configService.get<string>('GOOGLE_REDIRECT_URI') ||
        'postmessage';

      const client = new OAuth2Client(
        this.configService.get<string>('GOOGLE_CLIENT_ID'),
        this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
        resolvedRedirectUri,
      );

      const { tokens } = await client.getToken({
        code: token,
        redirect_uri: resolvedRedirectUri,
      });
      const idToken = tokens.id_token;

      if (!idToken) {
        throw new UnauthorizedException(
          this.translator.authMessage('AUTH_GOOGLE_NO_ID_TOKEN'),
        );
      }
      // Verify the Google token
      const ticket = await client.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException(
          this.translator.authMessage('AUTH_GOOGLE_INVALID_PAYLOAD'),
        );
      }

      const { email, name, picture, sub: googleId } = payload;

      if (!email) {
        throw new UnauthorizedException(
          this.translator.authMessage('AUTH_GOOGLE_NO_EMAIL'),
        );
      }

      // Check if user already exists
      let user = await this.userRepository.getUserByEmail(email);
      if (!user) {
        // Create new user from Google data
        try {
          user = await this.userRepository.createUser(
            {
              email,
              name: name || 'Google User',
              imageUrl: picture || null,
              password: '', // No password for Google users
              role: Role.USER, // Default role for new Google users
            },
            { emailConfirmed: true },
          );
        } catch (createError: any) {
          if (createError?.code === '23505') {
            user = await this.userRepository.getUserByEmail(email);
          } else {
            throw createError;
          }
        }
        if (!user) {
          throw new UnauthorizedException(
            this.translator.authMessage(
              'AUTH_GOOGLE_USER_CREATE_FAILED',
            ),
          );
        }
      } else {
        const updateData: any = {};

        if (name && user.name !== name) {
          updateData.name = name;
        }

        if (picture && user.imageUrl !== picture) {
          updateData.imageUrl = picture;
        }

        if (Object.keys(updateData).length > 0) {
          user = await this.userRepository.updateUser(
            user.id,
            updateData,
          );
        }
      }
      return this.issueAuthToken(
        user.id,
        user.role,
        user.email,
        user.emailConfirmed,
        user.language,
        user.currentTenantViewId,
      );
    } catch (error) {
      console.error('Google login error:', error);

      if (
        error instanceof UnauthorizedException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new UnauthorizedException(
        this.translator.authMessage('AUTH_GOOGLE_FAILED'),
      );
    }
  }

  async registerLocalUser(
    data: CreateUserDto,
  ): Promise<IRegisterResponse> {
    const existing = await this.userRepository.getUserByEmail(
      data.email,
    );
    if (existing) {
      throw new ConflictException(
        this.translator.authMessage('AUTH_REGISTER_EMAIL_IN_USE'),
      );
    }
    const code = generateSixDigitCode();
    const expiresAt = new Date(
      Date.now() + CODE_TTL_MS,
    ).toISOString();
    const authCodes: IUserAuthCodesPayload = { code, expiresAt };
    const created = await this.userRepository.createUser(data, {
      emailConfirmed: false,
      authCodes,
    });
    if (!created) {
      throw new UnauthorizedException(
        this.translator.authMessage('AUTH_REGISTER_FAILED'),
      );
    }
    await this.sendVerificationEmailToUser(
      created.id,
      data.email,
      code,
    );
    return {
      id: created.id,
      email: created.email,
      requiresEmailVerification: true,
    };
  }

  async verifyRegistrationCode(
    userId: string,
    code: string,
  ): Promise<IAuthLoginResponse> {
    const confirmed =
      await this.userRepository.validateRegistrationCodeAndConfirm(
        userId,
        code,
      );
    if (!confirmed) {
      throw new BadRequestException(
        this.translator.authMessage(
          'AUTH_VERIFY_CODE_INVALID_OR_EXPIRED',
        ),
      );
    }
    return this.issueAuthToken(
      confirmed.id,
      confirmed.role,
      confirmed.email,
      true,
      confirmed.language,
      confirmed.currentTenantViewId,
    );
  }

  async confirmEmailLinkToken(
    token: string,
  ): Promise<IAuthLoginResponse> {
    let payload: { sub?: string; purpose?: string };
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      }) as { sub?: string; purpose?: string };
    } catch {
      throw new BadRequestException(
        this.translator.authMessage(
          'AUTH_CONFIRM_LINK_INVALID_OR_EXPIRED',
        ),
      );
    }
    if (payload.purpose !== EMAIL_CONFIRM_PURPOSE || !payload.sub) {
      throw new BadRequestException(
        this.translator.authMessage('AUTH_CONFIRM_LINK_INVALID'),
      );
    }
    const confirmed = await this.userRepository.confirmEmailByUserId(
      payload.sub,
    );
    if (!confirmed) {
      throw new NotFoundException(
        this.translator.authMessage('AUTH_USER_NOT_FOUND'),
      );
    }
    return this.issueAuthToken(
      confirmed.id,
      confirmed.role,
      confirmed.email,
      true,
      confirmed.language,
      confirmed.currentTenantViewId,
    );
  }

  async resendVerificationCode(
    userId: string,
  ): Promise<IResendVerificationResponse> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException(
        this.translator.authMessage('AUTH_USER_NOT_FOUND'),
      );
    }
    if (user.emailConfirmed) {
      throw new BadRequestException(
        this.translator.authMessage('AUTH_EMAIL_ALREADY_VERIFIED'),
      );
    }
    const code = generateSixDigitCode();
    const expiresAt = new Date(
      Date.now() + CODE_TTL_MS,
    ).toISOString();
    await this.userRepository.setUserAuthCodes(userId, {
      code,
      expiresAt,
    });
    await this.sendVerificationEmailToUser(userId, user.email, code);
    return {
      message: this.translator.authMessage('AUTH_RESEND_CODE_SENT'),
    };
  }

  async resendVerificationFromExpiredLink(
    token: string,
  ): Promise<IResendVerificationResponse> {
    const decoded = this.jwtService.decode(token) as {
      sub?: string;
      purpose?: string;
    } | null;
    if (!decoded?.sub || decoded.purpose !== EMAIL_CONFIRM_PURPOSE) {
      throw new BadRequestException(
        this.translator.authMessage('AUTH_CONFIRM_LINK_INVALID'),
      );
    }
    const user = await this.userRepository.getUserById(decoded.sub);
    if (!user) {
      throw new NotFoundException(
        this.translator.authMessage('AUTH_USER_NOT_FOUND'),
      );
    }
    const result = await this.resendVerificationCode(decoded.sub);
    return {
      ...result,
      userId: user.id,
      email: user.email,
    };
  }

  async getVerificationLinkContext(
    token: string,
  ): Promise<IVerificationLinkContextResponse> {
    const decoded = this.jwtService.decode(token) as {
      sub?: string;
      purpose?: string;
    } | null;
    if (!decoded?.sub || decoded.purpose !== EMAIL_CONFIRM_PURPOSE) {
      throw new BadRequestException(
        this.translator.authMessage('AUTH_CONFIRM_LINK_INVALID'),
      );
    }
    const user = await this.userRepository.getUserById(decoded.sub);
    if (!user) {
      throw new NotFoundException(
        this.translator.authMessage('AUTH_USER_NOT_FOUND'),
      );
    }
    if (user.emailConfirmed) {
      throw new BadRequestException(
        this.translator.authMessage('AUTH_EMAIL_ALREADY_VERIFIED'),
      );
    }
    return { userId: user.id, email: user.email };
  }

  private async sendVerificationEmailToUser(
    userId: string,
    email: string,
    code: string,
  ): Promise<void> {
    const row = await this.userRepository.getUserById(userId);
    const lang =
      row?.language === 'en-US' || row?.language === 'pt-BR'
        ? row.language
        : 'pt-BR';
    const emailTheme = row?.theme === 'dark' ? 'dark' : 'light';
    const subjects: Record<'pt-BR' | 'en-US', string> = {
      'pt-BR': 'Seu código de verificação — realvidas',
      'en-US': 'Your verification code — realvidas',
    };

    const frontendUrl = (
      this.configService.get<string>('FRONTEND_URL') ||
      'http://localhost:5173'
    ).replace(/\/$/, '');
    const confirmToken = this.jwtService.sign(
      { sub: userId, purpose: EMAIL_CONFIRM_PURPOSE },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '5m',
      },
    );
    const loginUrl = `${frontendUrl}/welcome?token=${encodeURIComponent(
      confirmToken,
    )}`;
    await this.mailService.sendByTemplateType({
      to: email,
      subject: subjects[lang],
      templateType: MailTemplateType.LOGIN_CODE,
      params: {
        validationCode: code,
        language: lang,
        loginUrl,
        baseUrl: frontendUrl,
        theme: emailTheme,
      },
    });
  }

  private issueAuthToken(
    userId: string,
    role: IAuthLoginResponse['role'],
    email: string,
    emailConfirmed: boolean,
    language?: string | null,
    currentTenantViewId?: string | null,
  ): IAuthLoginResponse {
    const lang = normalizeBackendAuthLocale(language ?? undefined);
    const tenantId = currentTenantViewId || null;
    const token = this.jwtService.sign(
      {
        userId,
        role,
        emailConfirmed,
        language: lang,
        ...(tenantId ? { tenantId } : {}),
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      },
    );
    return {
      token,
      role,
      id: userId,
      email,
      emailConfirmed,
      tenantId,
    };
  }
}
