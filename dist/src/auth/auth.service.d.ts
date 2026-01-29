import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterRequest } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest } from './dto/login.dto';
export declare class AuthService {
    private readonly prismaService;
    private readonly configService;
    private readonly jwtService;
    private readonly JWT_SECRET;
    private readonly JWT_ACCESS_TOKEN_TTL;
    private readonly JWT_REFRESH_TOKEN_TTL;
    constructor(prismaService: PrismaService, configService: ConfigService, jwtService: JwtService);
    login(dto: LoginRequest): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    register(dto: RegisterRequest): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private generateTokens;
}
