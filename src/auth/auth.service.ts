import { ConfigService } from '@nestjs/config';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterRequest } from './dto/register.dto'
import { hash, verify } from 'argon2';
import { JwtPayLoad } from './interfaces/jwt.interface';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { LoginRequest } from './dto/login.dto';


@Injectable()
export class AuthService {
    private readonly JWT_SECRET : string;
    private readonly JWT_ACCESS_TOKEN_TTL: JwtSignOptions['expiresIn'];
    private readonly JWT_REFRESH_TOKEN_TTL: JwtSignOptions['expiresIn'];

    constructor(
        private readonly prismaService:PrismaService ,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService){
        this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow('JWT_ACCESS_TOKEN_TTL');
        this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow('JWT_REFRESH_TOKEN_TTL');
        this.JWT_SECRET = this.configService.getOrThrow<string>('JWT_SECRET');

        }


    async login(dto:LoginRequest){
        const {password,email}=dto;    
        const existUser=await this.prismaService.user.findUnique({
            where:{
                email
            },
            select:{
                id:true,
                password:true
            }
        });
        if(!existUser){
            throw new NotFoundException("User not found");
        } 

        const isValidpassword=await verify(existUser.password,password);
        if(!isValidpassword){
            throw new NotFoundException("User not found");
        }
        return this.generateTokens(existUser.id);

    }

    async register(dto:RegisterRequest){
        const {name,password,email}=dto;    
        const existUser=await this.prismaService.user.findUnique({
            where:{
                email
            }
        });
        if(existUser){
            throw new ConflictException("User with this email already exists");
        } 
        const res=await this.prismaService.user.create({
            data:{
                name,
                password:await hash(password),
                email
            }
        });

        return this.generateTokens(res.id);

    }

    private generateTokens(id: string) {
    const payload: JwtPayLoad = { id };
    console.log(typeof this.JWT_ACCESS_TOKEN_TTL);

    const accessToken = this.jwtService.sign(payload, {
        expiresIn: this.JWT_ACCESS_TOKEN_TTL
    });

    const refreshToken = this.jwtService.sign(payload, {
        expiresIn: this.JWT_REFRESH_TOKEN_TTL
    });

    return { accessToken, refreshToken };
    }



}
