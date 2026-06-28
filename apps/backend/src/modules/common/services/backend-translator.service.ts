import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import {
  AuthBackendMessageKey,
  getAuthBackendMessage,
  getPipelineBackendMessage,
  getUserBackendMessage,
  normalizeBackendAuthLocale,
  PipelineBackendMessageKey,
  UserBackendMessageKey,
} from '@global-types/backend-translations';
import { CLS_REQUEST_LANGUAGE_KEY } from '../cls-language.constants';

@Injectable()
export class BackendTranslatorService {
  constructor(private readonly cls: ClsService) {}

  private currentLocale() {
    return normalizeBackendAuthLocale(
      this.cls.get<string>(CLS_REQUEST_LANGUAGE_KEY),
    );
  }

  authMessage(key: AuthBackendMessageKey): string {
    return getAuthBackendMessage(key, this.currentLocale());
  }

  userMessage(key: UserBackendMessageKey): string {
    return getUserBackendMessage(key, this.currentLocale());
  }

  pipelineMessage(
    key: PipelineBackendMessageKey,
    params?: Record<string, string>,
  ): string {
    return getPipelineBackendMessage(key, this.currentLocale(), params);
  }
}
