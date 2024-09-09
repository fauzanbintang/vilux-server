import {
  Controller,
  Post,
  Body,
  HttpCode,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/dto/response/user.dto';
import { RegisterUserDto, LoginUserDto } from 'src/dto/request/auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/dto/response/response.dto';
import { Response } from 'express';

@ApiTags('auth')
@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(201)
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<ResponseDto<UserDto>> {
    const user = await this.authService.register(registerUserDto);
    return { data: user };
  }
r
  @Post('/login')
  @HttpCode(200)
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<ResponseDto<string>> {
    const token = await this.authService.login(loginUserDto);

    res.cookie('JWT', token);

    return { message: 'successfully login' };
  }
}
