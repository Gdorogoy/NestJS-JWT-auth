import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequest } from './dto/register.dto';
import { LoginRequest } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto:RegisterRequest){
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.FOUND)
  login(@Body() dto:LoginRequest){
    return this.authService.login(dto);
  }

}
