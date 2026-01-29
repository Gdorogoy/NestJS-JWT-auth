"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon2_1 = require("argon2");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(prismaService, configService, jwtService) {
        this.prismaService = prismaService;
        this.configService = configService;
        this.jwtService = jwtService;
        this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow('JWT_ACCESS_TOKEN_TTL');
        this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow('JWT_REFRESH_TOKEN_TTL');
        this.JWT_SECRET = this.configService.getOrThrow('JWT_SECRET');
    }
    async login(dto) {
        const { password, email } = dto;
        const existUser = await this.prismaService.user.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                password: true
            }
        });
        if (!existUser) {
            throw new common_1.NotFoundException("User not found");
        }
        const isValidpassword = await (0, argon2_1.verify)(existUser.password, password);
        if (!isValidpassword) {
            throw new common_1.NotFoundException("User not found");
        }
        return this.generateTokens(existUser.id);
    }
    async register(dto) {
        const { name, password, email } = dto;
        const existUser = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });
        if (existUser) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const res = await this.prismaService.user.create({
            data: {
                name,
                password: await (0, argon2_1.hash)(password),
                email
            }
        });
        return this.generateTokens(res.id);
    }
    generateTokens(id) {
        const payload = { id };
        console.log(typeof this.JWT_ACCESS_TOKEN_TTL);
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.JWT_ACCESS_TOKEN_TTL
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.JWT_REFRESH_TOKEN_TTL
        });
        return { accessToken, refreshToken };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map