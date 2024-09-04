import {
  Controller,
  Get,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from 'src/dto/response/user.dto';
import { UserService } from './user.service';
import { RoleGuard } from 'src/common/roleGuard/role.guard';
import { Roles } from 'src/common/roleGuard/roles.decorator';
import { ResponseDto } from 'src/dto/response/response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HttpCode(200)
  @UseGuards(RoleGuard)
  @Roles(['admin'])
  async getUsers(): Promise<ResponseDto<UserDto[]>> {
    const users = await this.userService.getUsers();
    return { data: users };
  }
}
