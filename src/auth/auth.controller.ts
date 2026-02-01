import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/register.dto';
import { LoginRequest } from './dto/login.dto';
import { Request, Response } from 'express';
import { ApiBadRequestResponse, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthResponse } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Authorization } from './decorators/authorization.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @ApiOperation({
    summary:'User register ',
    description:'Register user method'
  })
  @ApiOkResponse({
    type:AuthResponse
  })
  @ApiConflictResponse({
    description:'User with this email already exists'
  })
  @ApiBadRequestResponse({
    description:'Incorrect input data'
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  create(@Res({passthrough:true}) res :Response ,@Body() dto:RegisterRequest){
    return this.authService.register(res, dto);
  }



  @ApiOperation({
    summary:'User login ',
    description:'Login user method'
  })
  @ApiOkResponse({
    type:AuthResponse
  })
  @ApiBadRequestResponse({
    description:'Incorrect input data'
  })
  @ApiNotFoundResponse({
    description:'User not found'
  })
  @Post('login')
  @HttpCode(HttpStatus.FOUND)
  login(@Res({passthrough:true}) res :Response ,@Body() dto:LoginRequest){
    return this.authService.login(res,dto);
  }



  @ApiOperation({
    summary:'Token refresh ',
    description:'Refresh user access token method'
  })
  @ApiOkResponse({
    type:AuthResponse
  })
  @ApiUnauthorizedResponse({
    description:'Unauthorized description'
  })
  @ApiBadRequestResponse({
    description:'Incorrect input data'
  })
  @Post('refresh')
  @HttpCode(HttpStatus.FOUND)
  refresh(
    @Req() req:Request,
    @Res({passthrough:true}) res :Response)
  {
    return this.authService.refresh(req,res);
  }



  @ApiOperation({
    summary:'User logout ',
    description:'Logout user method'
  })
  @Post('logout')
  @HttpCode(HttpStatus.FOUND)
  logout(
    @Res({passthrough:true}) res :Response)
  {
    return this.authService.logout(res);
  } 



  @Authorization()
  @Get('curr')
  @HttpCode(HttpStatus.OK)
  getCurrentUser(@Req() req:Request){
    return req.user;
  }



}
