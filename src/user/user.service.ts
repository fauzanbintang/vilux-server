import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { UserDto } from 'src/dto/response/user.dto';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getUsers(): Promise<UserDto[]> {
    this.logger.debug('Get all users');

    const users = await this.prismaService.user.findMany();
    return users.map((user) => {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        date_of_birth: user.date_of_birth,
        gender: user.gender,
        role: user.role,
      };
    });
  }
}
