/**
 * Common service mocks used across multiple test files.
 * These cover services that are frequently injected as dependencies.
 */

export function createMockJwtService() {
  return {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
    verify: jest.fn().mockReturnValue({ userId: 'user-1', role: 'USER' }),
    decode: jest.fn().mockReturnValue({ sub: 'user-1', purpose: 'email-confirm' }),
  };
}

export function createMockConfigService() {
  const config: Record<string, string> = {
    FRONTEND_URL: 'http://localhost:5173',
    JWT_SECRET: 'test-secret',
  };
  return {
    get: jest.fn((key: string) => config[key]),
  };
}

export function createMockMailService() {
  return {
    sendByTemplateType: jest.fn().mockResolvedValue(undefined),
  };
}

export function createMockTranslatorService() {
  return {
    authMessage: jest.fn((key: string) => `translated:${key}`),
    userMessage: jest.fn((key: string) => `translated:${key}`),
    pipelineMessage: jest.fn((key: string) => `translated:${key}`),
  };
}

export function createMockSocketService() {
  return {
    setUserActiveTenant: jest.fn(),
    emitToUser: jest.fn(),
    emitToRoom: jest.fn(),
  };
}

export function createMockUserTenantViewCacheService() {
  return {
    get: jest.fn(),
    set: jest.fn(),
  };
}

export function createMockFileService() {
  return {
    saveFile: jest.fn().mockResolvedValue({ url: 'https://storage.example.com/file.png' }),
    deleteFile: jest.fn().mockResolvedValue(undefined),
  };
}

import { BadRequestException, ForbiddenException } from '@nestjs/common';

export function createMockClsService() {
  const store: Record<string, any> = { tenantId: 'tenant-1' };
  return {
    get: jest.fn((key: string) => store[key]),
    set: jest.fn((key: string, value: any) => { store[key] = value; }),
  };
}

export function createMockTenantContextService(
  tenantId: string | null = 'tenant-1',
) {
  return {
    getTenantId: jest.fn(() => tenantId ?? undefined),
    requireTenantId: jest.fn(() => {
      if (!tenantId) {
        throw new ForbiddenException('No tenant context');
      }
      return tenantId;
    }),
    requireTenantIdOrBadRequest: jest.fn(() => {
      if (!tenantId) {
        throw new BadRequestException('No tenant workspace is active');
      }
      return tenantId;
    }),
  };
}

export function createMockGoogleIntegrationService() {
  return {
    isConfigured: jest.fn().mockReturnValue(true),
    updateCalendar: jest.fn().mockResolvedValue(undefined),
    deleteCalendar: jest.fn().mockResolvedValue(undefined),
  };
}

export function createMockGoogleIntegrationManagerService() {
  return {
    createEnterpriseCalendar: jest.fn(),
    getEnterpriseCalendars: jest.fn().mockResolvedValue([]),
    getUserAccessibleCalendars: jest.fn().mockResolvedValue([]),
    shareCalendarWithMember: jest.fn(),
    updateCalendarSharePermission: jest.fn(),
    removeCalendarAccessFromMember: jest.fn(),
  };
}

export function createMockSocialMidiaConnectService() {
  return {
    sendOutbound: jest.fn().mockResolvedValue('ext-msg-id'),
  };
}

export function createMockPaymentProvider() {
  return {
    createPayment: jest.fn().mockResolvedValue({
      paymentId: 'pay-1',
      paymentUrl: 'https://pay.example.com/1',
      qrCode: null,
      qrCodeText: null,
      expiresAt: null,
    }),
    checkPaymentStatus: jest.fn().mockResolvedValue({
      status: 'PAID',
      paidAt: new Date(),
    }),
  };
}
