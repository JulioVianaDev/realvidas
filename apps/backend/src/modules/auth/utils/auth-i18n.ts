import { HttpException, HttpStatus } from '@nestjs/common';
import {
  AuthBackendMessageKey,
  BackendAuthLocale,
  getAuthBackendMessage,
} from '@global-types/backend-translations/auth.backend-translations';

export function authHttpException(
  status: HttpStatus,
  key: AuthBackendMessageKey,
  locale: BackendAuthLocale,
): HttpException {
  return new HttpException(
    {
      statusCode: status,
      message: getAuthBackendMessage(key, locale),
      code: key,
      locale,
    },
    status,
  );
}
