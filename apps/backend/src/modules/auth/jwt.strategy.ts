import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const emailConfirmed =
      typeof payload.emailConfirmed === 'boolean'
        ? payload.emailConfirmed
        : true;
    return {
      id: payload.userId,
      role: payload.role,
      emailConfirmed,
      language:
        typeof payload.language === 'string'
          ? payload.language
          : undefined,
    };
  }
}
