import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from 'src/config/jwt.config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[JwtModule.registerAsync({
    imports:[ConfigModule],
    useFactory:getJwtConfig,

    inject:[ConfigService],
  })]
})
export class AuthModule {}
