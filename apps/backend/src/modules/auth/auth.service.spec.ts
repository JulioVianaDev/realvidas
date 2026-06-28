import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { REPOSITORY_TOKENS_MAIN } from 'src/infra/postgres-databases/main/repository-tokens';
import {
  createMockUserRepository,
  mockMainRepository,
} from 'src/test-utils/database-mock';
import {
  createMockJwtService,
  createMockConfigService,
  createMockMailService,
  createMockTranslatorService,
} from 'src/test-utils/service-mock';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { BackendTranslatorService } from '../common/services/backend-translator.service';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: ReturnType<typeof createMockUserRepository>;
  let jwtService: ReturnType<typeof createMockJwtService>;
  let mailService: ReturnType<typeof createMockMailService>;
  let translator: ReturnType<typeof createMockTranslatorService>;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER' as const,
    emailConfirmed: true,
    language: 'pt-BR',
    currentTenantViewId: 'tenant-1',
    imageUrl: null,
    theme: 'light',
  };

  beforeEach(async () => {
    userRepository = createMockUserRepository();
    jwtService = createMockJwtService();
    mailService = createMockMailService();
    translator = createMockTranslatorService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: createMockConfigService() },
        { provide: MailService, useValue: mailService },
        { provide: BackendTranslatorService, useValue: translator },
        mockMainRepository(REPOSITORY_TOKENS_MAIN.USER_REPOSITORY, userRepository),
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── loginUser ──────────────────────────────────────────────────────

  describe('loginUser', () => {
    it('should return auth token when credentials are valid', async () => {
      userRepository.getUserByEmail.mockResolvedValue(mockUser);
      userRepository.comparePassword.mockResolvedValue(true);

      const result = await service.loginUser({
        email: 'test@example.com',
        password: 'correct-password',
      });

      expect(result).toHaveProperty('token', 'mock-jwt-token');
      expect(result).toHaveProperty('role', 'USER');
      expect(result).toHaveProperty('id', 'user-1');
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(userRepository.comparePassword).toHaveBeenCalledWith('user-1', 'correct-password');
    });

    it('should throw NotFoundException when user does not exist', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null);

      await expect(
        service.loginUser({ email: 'unknown@example.com', password: 'any' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      userRepository.getUserByEmail.mockResolvedValue(mockUser);
      userRepository.comparePassword.mockResolvedValue(false);

      await expect(
        service.loginUser({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ── validateToken ──────────────────────────────────────────────────

  describe('validateToken', () => {
    it('should return decoded payload for a valid token', async () => {
      const result = await service.validateToken('valid-token');
      expect(result).toEqual({ userId: 'user-1', role: 'USER' });
      expect(jwtService.verify).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for an invalid token', async () => {
      jwtService.verify.mockImplementation(() => { throw new Error('expired'); });

      await expect(service.validateToken('expired-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ── registerLocalUser ──────────────────────────────────────────────

  describe('registerLocalUser', () => {
    const dto = {
      email: 'new@example.com',
      name: 'New User',
      password: 'Str0ngP@ss',
      role: 'USER' as const,
    };

    it('should register a new user and send verification email', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null);
      userRepository.createUser.mockResolvedValue({ ...mockUser, id: 'user-new', email: dto.email });
      userRepository.getUserById.mockResolvedValue({ ...mockUser, id: 'user-new', email: dto.email });

      const result = await service.registerLocalUser(dto);

      expect(result).toHaveProperty('requiresEmailVerification', true);
      expect(result).toHaveProperty('email', 'new@example.com');
      expect(userRepository.createUser).toHaveBeenCalled();
      expect(mailService.sendByTemplateType).toHaveBeenCalled();
    });

    it('should throw ConflictException when email is already in use', async () => {
      userRepository.getUserByEmail.mockResolvedValue(mockUser);

      await expect(service.registerLocalUser(dto)).rejects.toThrow(ConflictException);
    });
  });

  // ── verifyRegistrationCode ─────────────────────────────────────────

  describe('verifyRegistrationCode', () => {
    it('should return auth token when code is valid', async () => {
      userRepository.validateRegistrationCodeAndConfirm.mockResolvedValue(mockUser);

      const result = await service.verifyRegistrationCode('user-1', '123456');

      expect(result).toHaveProperty('token');
      expect(result.emailConfirmed).toBe(true);
    });

    it('should throw BadRequestException when code is invalid', async () => {
      userRepository.validateRegistrationCodeAndConfirm.mockResolvedValue(null);

      await expect(
        service.verifyRegistrationCode('user-1', '000000'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ── confirmEmailLinkToken ──────────────────────────────────────────

  describe('confirmEmailLinkToken', () => {
    it('should confirm email and return auth token', async () => {
      jwtService.verify.mockReturnValue({ sub: 'user-1', purpose: 'email-confirm' });
      userRepository.confirmEmailByUserId.mockResolvedValue(mockUser);

      const result = await service.confirmEmailLinkToken('valid-link-token');

      expect(result).toHaveProperty('token');
      expect(userRepository.confirmEmailByUserId).toHaveBeenCalledWith('user-1');
    });

    it('should throw BadRequestException for invalid token', async () => {
      jwtService.verify.mockImplementation(() => { throw new Error('expired'); });

      await expect(
        service.confirmEmailLinkToken('bad-token'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when purpose is not email-confirm', async () => {
      jwtService.verify.mockReturnValue({ sub: 'user-1', purpose: 'other' });

      await expect(
        service.confirmEmailLinkToken('wrong-purpose-token'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      jwtService.verify.mockReturnValue({ sub: 'user-missing', purpose: 'email-confirm' });
      userRepository.confirmEmailByUserId.mockResolvedValue(null);

      await expect(
        service.confirmEmailLinkToken('valid-token'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── resendVerificationCode ─────────────────────────────────────────

  describe('resendVerificationCode', () => {
    it('should resend code when user exists and email is not confirmed', async () => {
      userRepository.getUserById.mockResolvedValue({ ...mockUser, emailConfirmed: false });

      const result = await service.resendVerificationCode('user-1');

      expect(result).toHaveProperty('message');
      expect(userRepository.setUserAuthCodes).toHaveBeenCalled();
      expect(mailService.sendByTemplateType).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      userRepository.getUserById.mockResolvedValue(null);

      await expect(
        service.resendVerificationCode('missing'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when email is already verified', async () => {
      userRepository.getUserById.mockResolvedValue({ ...mockUser, emailConfirmed: true });

      await expect(
        service.resendVerificationCode('user-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
