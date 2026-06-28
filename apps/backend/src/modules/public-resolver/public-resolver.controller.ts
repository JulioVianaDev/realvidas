import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsUUID, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { PublicResolverService } from './public-resolver.service';
import {
  SHORT_PATH_MAX_LENGTH,
  SHORT_PATH_MIN_LENGTH,
  SHORT_PATH_REGEX,
} from '@global-types/entities/url-shortener.entity-type';

class ResolveTenantQueryDto {
  @IsUUID()
  enterpriseId: string;
}

class ResolveShortPathParamDto {
  @IsString()
  @MinLength(SHORT_PATH_MIN_LENGTH)
  @MaxLength(SHORT_PATH_MAX_LENGTH)
  @Matches(SHORT_PATH_REGEX)
  shortPath: string;
}

@Controller({ path: 'public', version: '1' })
@ApiTags('Public')
export class PublicResolverController {
  constructor(private readonly resolver: PublicResolverService) {}

  @Get('resolve-tenant')
  async resolveByEnterpriseId(@Query() q: ResolveTenantQueryDto) {
    const tenantId = await this.resolver.resolveTenantIdByEnterpriseId(
      q.enterpriseId,
    );
    return { tenantId };
  }

  @Get('short-path/:shortPath')
  async resolveShortPath(@Param() params: ResolveShortPathParamDto) {
    return this.resolver.resolveByShortPath(params.shortPath);
  }
}
