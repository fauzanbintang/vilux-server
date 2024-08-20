import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseDto } from 'src/dto/response.dto';
import { UserDto } from 'src/dto/user.dto';
import { RegisterUserDto, LoginUserDto } from 'src/dto/auth.dto';

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

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<ResponseDto<UserDto>> {
    const user = await this.authService.login(loginUserDto);
    return { data: user };
  }
}
