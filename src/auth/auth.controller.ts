import { Controller, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiResponse } from '../common/services/response.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    try {
      const user = await this.authService.register(registerDto);
      ApiResponse.send(res, user, 'User registered successfully', HttpStatus.CREATED);
    } catch (error: any) {
        ApiResponse.send(res, null, 'Registration failed', HttpStatus.INTERNAL_SERVER_ERROR, true);
      
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      ApiResponse.send(res, null, 'Invalid credentials', HttpStatus.UNAUTHORIZED, true);
      return;
    }
    const loginResult = await this.authService.login(user);
    ApiResponse.send(res, loginResult, 'Login successful', HttpStatus.OK);
  }

}
