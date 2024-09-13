import { Controller, Post, Body, HttpCode, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRes, UserDto } from 'src/dto/response/user.dto';
import { RegisterUserDto, LoginUserDto } from 'src/dto/request/auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/dto/response/response.dto';
import { Response } from 'express';

@ApiTags('auth')
@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    type: RegisterUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been registered successfully.',
    schema: {
      example: {
        message: 'User registered successfully',
        data: {
          id: '00000000-0000-0000-0000-000000000000',
          username: 'test',
          email: 'test@mail.com',
          full_name: 'Test Test',
          date_of_birth: '1999-01-01',
          gender: 'male',
          role: 'client',
        },
        errors: null,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    schema: {
      example: {
        message: 'Invalid data',
        data: null,
        errors: 'Email already in use',
      },
    },
  })
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<ResponseDto<UserDto>> {
    const user = await this.authService.register(registerUserDto);

    return {
      message: 'User registered successfully',
      data: user,
      errors: null,
    };
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The user has logged in successfully.',
    schema: {
      example: {
        message: 'successfully login',
        data: {
          uid: '00000000-0000-0000-0000-000000000000',
        },
        errors: null,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        message: 'Invalid credentials',
        data: null,
        errors: 'Unauthorized',
      },
    },
  })
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<ResponseDto<LoginRes>> {
    const loginRes = await this.authService.login(loginUserDto);

    res.cookie('JWT', loginRes.token);

    return {
      message: 'successfully login',
      data: { user_id: loginRes.user_id },
      errors: null,
    };
  }
}
