/**
 * Runs after route guards (Nest order: guards → interceptors), so `req.user`
 * from JWT is set and can override `x-language`. Stores locale in CLS for
 * {@link BackendTranslatorService}.
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { normalizeBackendAuthLocale } from '@global-types/backend-translations';
import { CLS_REQUEST_LANGUAGE_KEY } from '../cls-language.constants';

@Injectable()
export class RequestLanguageInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }
    const req = context.switchToHttp().getRequest();
    const headerRaw = req.headers['x-language'] as
      | string
      | string[]
      | undefined;
    const headerLang = Array.isArray(headerRaw) ? headerRaw[0] : headerRaw;
    let locale = normalizeBackendAuthLocale(headerLang);
    const user = req.user as { language?: string } | undefined;
    if (user?.language) {
      locale = normalizeBackendAuthLocale(user.language);
    }
    this.cls.set(CLS_REQUEST_LANGUAGE_KEY, locale);
    return next.handle();
  }
}
