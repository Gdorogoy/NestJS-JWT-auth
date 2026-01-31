import { ConfigService } from '@nestjs/config';
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterRequest } from './dto/register.dto'
import { hash, verify } from 'argon2';
import { JwtPayLoad } from './interfaces/jwt.interface';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { LoginRequest } from './dto/login.dto';
import { Request, Response } from 'express';
import { isDev } from 'src/utils/is-dev.uitl';


@Injectable()
export class AuthService {
    private readonly JWT_SECRET : string;
    private readonly JWT_ACCESS_TOKEN_TTL: JwtSignOptions['expiresIn'];
    private readonly JWT_REFRESH_TOKEN_TTL: JwtSignOptions['expiresIn'];
    private readonly COOKIE_DOMAIN:string; 

    constructor(
        private readonly prismaService:PrismaService ,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService){
        this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow('JWT_ACCESS_TOKEN_TTL');
        this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow('JWT_REFRESH_TOKEN_TTL');
        this.JWT_SECRET = this.configService.getOrThrow<string>('JWT_SECRET');
        this.COOKIE_DOMAIN=this.configService.getOrThrow<string>('COOKIE_DOMAIN');

    }

    async refresh(req:Request, res:Response ){
        const refreshToken=req.cookies['refreshToken'];
        if(!refreshToken){
            throw new UnauthorizedException('Refresh Token not found');
        }

        const payload:JwtPayLoad=await this.jwtService.verifyAsync(refreshToken);

        if(payload){
            const user = await this.prismaService.user.findUnique({
                where:{
                    id:payload.id
                },
                select:{
                    id:true
                }
            });

            if(!user){
                throw new NotFoundException('User not found');
            }

            return this.auth(res,user.id);
        }
        
    }

    async logout(res:Response){
        this.setCookie(res,'refreshToken',new Date(0));
    }


    async login(res :Response , dto:LoginRequest){
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
        return this.auth(res,existUser.id);

    }

    async register(res:Response ,dto:RegisterRequest){
        const {name,password,email}=dto;    
        const existUser=await this.prismaService.user.findUnique({
            where:{
                email
            }
        });
        if(existUser){
            throw new ConflictException("User with this email already exists");
        } 
        const user=await this.prismaService.user.create({
            data:{
                name,
                password:await hash(password),
                email
            }
        });

        return this.auth(res,user.id);

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

    private auth(res :Response,id:string){
        const { accessToken, refreshToken }=this.generateTokens(id);

        this.setCookie(res,refreshToken,new Date(Date.now() +60*60*24*7*1000));
        return accessToken;
    }

    private setCookie(res :Response,value:string, expiresAt:Date){
        res.cookie(
            'refreshToken',
            value,
            {
                expires:expiresAt,
                httpOnly:true,
                domain:this.COOKIE_DOMAIN,
                secure:!isDev(this.configService),
                sameSite: isDev(this.configService)? 'none' :'lax'
            }
        )
    }



}
