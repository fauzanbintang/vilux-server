import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from 'src/dto/response/user.dto';
import { UserService } from './user.service';
import { RoleGuard } from 'src/common/roleGuard/role.guard';
import { Roles } from 'src/common/roleGuard/roles.decorator';
import { ResponseDto } from 'src/dto/response/response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto, UpdateUserPasswordDto, UserQuery } from 'src/dto/request/auth.dto';

@ApiTags('user')
@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Get all users',
    schema: {
      example: {
        message: 'Successfully get all users',
        data: [
          {
            id: '60cd3158-6318-49ba-82a2-5b02d0e1af10',
            username: 'test',
            email: 'test@mail.com',
            full_name: 'Test Test',
            date_of_birth: '1998-12-31T17:00:00.000Z',
            gender: 'male',
            role: 'client',
            created_at: '2021-01-01T17:00:00.000Z',
          },
        ],
        errors: null,
      },
    },
  })
  @UseGuards(RoleGuard)
  @Roles(['admin'])
  async getUsers(
    @Query() query: UserQuery,
  ): Promise<ResponseDto<UserDto[]>> {
    query.role = Array.isArray(query.role)
      ? query.role
      : [query.role];

    const users = await this.userService.getUsers(query);
    return { message: 'Successfully get all users', data: users, errors: null };
  }

  @Put('change-password/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Change password for user' })
  @ApiResponse({
    status: 200,
    description: 'Change password for user',
    schema: {
      example: {
        message: 'Successfully change password',
        data: null,
        errors: null,
      },
    },
  })
  async changePassword(
    @Param('id') id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ): Promise<ResponseDto<UserDto>> {
    await this.userService.changePassword(id, updateUserPasswordDto);
    return {
      message: 'Successfully change password',
      data: null,
      errors: null,
    };
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({
    status: 200,
    description: 'Get user',
    schema: {
      example: {
        message: 'Successfully get user',
        data: {
          id: '60cd3158-6318-49ba-82a2-5b02d0e1af10',
          username: 'test',
          email: 'test@mail.com',
          full_name: 'Test Test',
          date_of_birth: '1998-12-31T17:00:00.000Z',
          gender: 'male',
          role: 'client',
          phone_number: '+1234567890',
          created_at: '2021-01-01T17:00:00.000Z',
        },
        errors: null,
      },
    },
  })
  async getUser(@Param('id') id: string): Promise<ResponseDto<UserDto>> {
    const user = await this.userService.getUser(id);
    return { message: 'Successfully get user', data: user, errors: null };
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'Update user',
    schema: {
      example: {
        message: 'Successfully update user',
        data: {
          id: '60cd3158-6318-49ba-82a2-5b02d0e1af10',
          username: 'test',
          email: 'test@mail.com',
          full_name: 'Test Test',
          date_of_birth: '1998-12-31T17:00:00.000Z',
          gender: 'male',
          role: 'client',
        },
        errors: null,
      },
    },
  })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseDto<UserDto>> {
    const user = await this.userService.update(id, updateUserDto);
    return { message: 'Successfully update user', data: user, errors: null };
  }
}
