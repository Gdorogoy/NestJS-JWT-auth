import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/register.dto';
import { LoginRequest } from './dto/login.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  create(@Res({passthrough:true}) res :Response ,@Body() dto:RegisterRequest){
    return this.authService.register(res, dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.FOUND)
  login(@Res({passthrough:true}) res :Response ,@Body() dto:LoginRequest){
    return this.authService.login(res,dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.FOUND)
  refresh(
    @Req() req:Request,
    @Res({passthrough:true}) res :Response)
  {
    return this.authService.refresh(req,res);
  }



  @Post('logout')
  @HttpCode(HttpStatus.FOUND)
  logout(
    @Res({passthrough:true}) res :Response)
  {
    return this.authService.logout(res);
  }
  



}
