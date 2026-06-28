import {
  Controller,
  Post,
  Body,
  Headers,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RolesGuard } from './guard/roles.guard';
import { Roles } from './guard/roles.decorator';
import { CreateUserDto } from '../user/dto/user.dto';
import { Role } from 'src/infra/postgres-databases/main/entities/enums';
import {
  ConfirmEmailLinkDto,
  ResendVerificationCodeDto,
  ResendVerificationFromLinkDto,
  VerifyRegistrationCodeDto,
} from './dto/auth.dto';
import { SocketService } from '../socket/socket.service';
import {
  IAuthLoginResponse,
  IRegisterResponse,
  IResendVerificationResponse,
  IVerificationLinkContextResponse,
} from '@global-types/responses/auth.response';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly socketService: SocketService,
  ) {}

  private bindAuthenticatedSocket(
    socketId: string | undefined,
    auth: { id: string; role: string; tenantId?: string | null },
  ) {
    this.socketService.bindAuthenticatedSessionBySocketIdentifier(socketId, {
      userId: auth.id,
      role: auth.role,
      tenantId: auth.tenantId ?? null,
    });
  }

  @Post('login')
  async loginUser(
    @Body() body: { email: string; password: string },
    @Headers('x-socket-id') socketId?: string,
  ): Promise<IAuthLoginResponse> {
    const auth = await this.authService.loginUser(body);
    this.bindAuthenticatedSocket(socketId, auth);
    return auth;
  }

  @Post('register')
  async registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IRegisterResponse> {
    return this.authService.registerLocalUser(createUserDto);
  }

  @Post('register/verify-code')
  async verifyRegistrationCode(
    @Body() body: VerifyRegistrationCodeDto,
    @Headers('x-socket-id') socketId?: string,
  ): Promise<IAuthLoginResponse> {
    const auth = await this.authService.verifyRegistrationCode(
      body.userId,
      body.code,
    );
    this.bindAuthenticatedSocket(socketId, auth);
    return auth;
  }

  @Post('register/confirm-email')
  async confirmEmailFromLink(
    @Body() body: ConfirmEmailLinkDto,
    @Headers('x-socket-id') socketId?: string,
  ): Promise<IAuthLoginResponse> {
    const auth = await this.authService.confirmEmailLinkToken(body.token);
    this.bindAuthenticatedSocket(socketId, auth);
    return auth;
  }

  @Post('register/resend-code')
  async resendVerificationCode(
    @Body() body: ResendVerificationCodeDto,
  ): Promise<IResendVerificationResponse> {
    return this.authService.resendVerificationCode(body.userId);
  }

  @Post('register/resend-from-link')
  async resendVerificationFromExpiredLink(
    @Body() body: ResendVerificationFromLinkDto,
  ): Promise<IResendVerificationResponse> {
    return this.authService.resendVerificationFromExpiredLink(
      body.token,
    );
  }

  @Post('register/link-context')
  async getVerificationLinkContext(
    @Body() body: ConfirmEmailLinkDto,
  ): Promise<IVerificationLinkContextResponse> {
    return this.authService.getVerificationLinkContext(body.token);
  }

  @Post('google')
  async googleLogin(
    @Body() body: { token: string; redirectUri?: string },
    @Headers('x-socket-id') socketId?: string,
  ): Promise<IAuthLoginResponse> {
    const auth = await this.authService.googleLogin(
      body.token,
      body.redirectUri,
    );
    this.bindAuthenticatedSocket(socketId, auth);
    return auth;
  }

  @Post('validate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  async validateToken(@Req() req: any) {
    return req.user;
  }
}
