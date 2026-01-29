import { ConfigService } from '@nestjs/config';
import { type JwtModuleOptions } from '@nestjs/jwt';
export declare function getJwtConfig(configService: ConfigService): Promise<JwtModuleOptions>;
